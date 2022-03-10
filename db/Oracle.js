const DbInterface = require('./DbInterface');
const oracledb = require('oracledb');
oracledb.autoCommit = true;
// 数据库类型与后端数据类型对应关系
const TYPES = {
    VARCHAR: 'String',
    CHAR: 'String',
    BLOB: 'String',
    TEXT: 'String',
    INTEGER: 'long',
    TINYINT: 'int',
    SMALLINT: 'int',
    MEDIUMINT: 'int',
    BIT: 'boolean',
    BIGINT: 'BigInteger',
    FLOAT: 'float',
    DOUBLE: 'double',
    DECIMAL: 'BigDecimal',
    BOOLEAN: 'boolean',
    DATE: 'Date',
    TIME: 'Time',
    DATETIME: 'Timestamp',
    TIMESTAMP: 'Timestamp',
    YEAR: 'Date',
    TINYBLOB: 'String',
    TINYTEXT: 'String',
    MEDIUMBLOB: 'String',
    MEDIUMTEXT: 'String',
    LONGBLOB: 'String',
    LONGTEXT: 'String',
};
const DB_TYPES = Object.keys(TYPES).map(value => ({ value, label: value }));

class Oracle extends DbInterface {
    database;
    sequelize;

    constructor(url) {
        super(url);
        this.database = new URL(url).pathname.replace('/', '');
    }

    async getConnection() {
        const { username: user, password, host, pathname } = new URL(this.url);
        const connectString = `${host}${pathname}`;
        return await oracledb.getConnection({
            user,
            password,
            connectString,
        });
    }

    async getTypeOptions() {
        return DB_TYPES;
    }

    async testConnection() {
        try {
            await this.getConnection();
            return true;
        } catch (e) {
            return false;
        }
    }

    async getTables() {
        const connection = await this.getConnection();
        try {
            // -- 查询本用户的表,视图等
            // const res = await connection.execute('select * from user_tab_comments');
            const res = await connection.execute('select t.table_name,t.comments from user_tab_comments t');
            const { rows } = res;
            return rows.map(item => {
                const [name, comment] = item;
                return {
                    name,
                    comment,
                };
            });
        } catch (err) {
            console.log('Error in processing:\n', err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.log('Error in closing connection:\n', err);
                }
            }
        }
    }

    async getColumns(tableName) {
        const connection = await this.getConnection();
        try {
            // -- 查询本用户的表,视图等
            const res = await connection.execute(`
                select *
                from user_col_comments a
                where a.table_name = '${tableName}'
            `);

            const info = res.rows.map(item => {
                const [tableName, name, comment] = item;

                return {
                    id: `${tableName}_${name}`,
                    name,
                    comment,
                };
            });

            const res2 = await connection.execute(`
                SELECT column_name, data_type, data_length, nullable, data_default
                FROM user_tab_cols
                WHERE table_name = '${tableName}'
            `);
            return res2.rows.map(item => {
                const [name, type, length, nullable, defaultValue] = item;
                const record = info.find(it => it.name === name);
                const isNullable = nullable === 'Y';
                return {
                    id: record.id,
                    name: record.name,
                    comment: record.comment,
                    type,
                    dataType: TYPES[type] || 'String',
                    isNullable,
                    length,
                    defaultValue,
                };

            });
        } catch (err) {
            console.log('Error in processing:\n', err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.log('Error in closing connection:\n', err);
                }
            }
        }
    }
}

Oracle.DB_TYPES = DB_TYPES;
module.exports = Oracle;
