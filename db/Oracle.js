const DbInterface = require('./DbInterface');
const { getInfoByComment, getFormTypeByChinese } = require('./util');
const oracledb = require('oracledb');
oracledb.autoCommit = true;

const TYPES = {
    VARCHAR: {
        form: 'input',
        data: 'String',
    },
    CHAR: {
        form: 'input',
        data: 'String',
    },
    BLOB: {
        form: 'input',
        data: 'String',
    },
    TEXT: {
        form: 'textarea',
        data: 'String',
    },
    INTEGER: {
        form: 'number',
        data: 'long',
    },
    TINYINT: {
        form: 'number',
        data: 'int',
    },
    SMALLINT: {
        form: 'number',
        data: 'int',
    },
    MEDIUMINT: {
        form: 'number',
        data: 'int',
    },
    BIT: {
        form: 'switch',
        data: 'boolean',
    },
    BIGINT: {
        form: 'number',
        data: 'BigInteger',
    },
    FLOAT: {
        form: 'number',
        data: 'float',
    },
    DOUBLE: {
        form: 'number',
        data: 'double',
    },
    DECIMAL: {
        form: 'number',
        data: 'BigDecimal',
    },
    BOOLEAN: {
        form: 'switch',
        data: 'boolean',
    },
    DATE: {
        form: 'date',
        data: 'Date',
    },
    TIME: {
        form: 'time',
        data: 'Time',
    },
    DATETIME: {
        form: 'date-time',
        data: 'Timestamp',
    },
    TIMESTAMP: {
        form: 'date-time',
        data: 'Timestamp',
    },
    YEAR: {
        form: 'date',
        data: 'Date',
    },
    TINYBLOB: {
        form: 'input',
        data: 'String',
    },
    TINYTEXT: {
        form: 'input',
        data: 'String',
    },
    MEDIUMBLOB: {
        form: 'input',
        data: 'String',
    },
    MEDIUMTEXT: {
        form: 'input',
        data: 'String',
    },
    LONGBLOB: {
        form: 'input',
        data: 'String',
    },
    LONGTEXT: {
        form: 'input',
        data: 'String',
    },
};

const DB_TYPES = Object.keys(TYPES).map(value => ({ value, label: value }));

function getTypes(type, chinese) {
    const types = TYPES[type.toUpperCase()] || {};
    const defaultFormType = 'input';
    const defaultDataType = 'String';
    const form = getFormTypeByChinese(chinese, types.form || defaultFormType);
    const data = types.data || defaultDataType;

    return {
        form,
        data,
    };
}

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
                const commentInfo = getInfoByComment(name, comment);
                const { chinese, options } = commentInfo;
                // TODO 类型
                const type = 'VARCHAR';
                const isNullable = true;
                const length = undefined;

                const types = getTypes(type, chinese);

                return {
                    id: `${tableName}_${name}`,
                    type,
                    formType: types.form,
                    dataType: types.data,
                    name,
                    isNullable,
                    comment,
                    chinese,
                    length,
                    options,
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
