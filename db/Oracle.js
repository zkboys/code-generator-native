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
            const { rows } = res;
            return rows.map(item => {
                const [tableName, name, comment] = item;
                // TODO 类型
                const type = 'VARCHAR';
                const isNullable = true;
                const length = undefined;

                return {
                    id: `${tableName}_${name}`,
                    type,
                    dataType: TYPES[type],
                    name,
                    isNullable,
                    comment,
                    length,
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
