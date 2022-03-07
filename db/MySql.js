const mysql = require('mysql2');
const DbInterface = require('./DbInterface');
const { getInfoByComment, getFormTypeByChinese } = require('./util');

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

class MySql extends DbInterface {
    database;

    constructor(url) {
        super(url);
        this.database = new URL(url).pathname.replace('/', '');
    }

    async getConnection() {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(this.url);

            connection.connect(function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
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
        const tableInfoSql = `select table_name, table_comment
                              from information_schema.tables
                              where table_schema = '${this.database}'
                                and (table_type = 'base table' or table_type = 'BASE TABLE')`;

        return new Promise((resolve, reject) => {
            connection.query(tableInfoSql, (error, results) => {
                if (error) return reject(error);

                resolve(results.map(item => {
                    return {
                        name: item.table_name || item.TABLE_NAME,
                        comment: item.table_comment || item.TABLE_COMMENT,
                    };
                }));
            });

        }).finally(() => connection.end());
    }

    async getColumns(tableName) {
        const connection = await this.getConnection();
        const tableInfoSql = `select *
                              from information_schema.columns
                              where table_schema = "${this.database}"
                                and table_name = "${tableName}"`;

        return new Promise((resolve, reject) => {
            connection.query(tableInfoSql, (error, results) => {
                if (error) return reject(error);

                resolve(results.map(item => {
                    const name = item.COLUMN_NAME;
                    const type = item.DATA_TYPE.toUpperCase(); // COLUMN_TYPE
                    const comment = item.COLUMN_COMMENT;
                    const isNullable = item.IS_NULLABLE === 'YES';
                    const length = item.CHARACTER_MAXIMUM_LENGTH; // CHARACTER_OCTET_LENGTH

                    const commentInfo = getInfoByComment(name, comment);
                    const { chinese, options } = commentInfo;

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
                }));
            });
        }).finally(() => connection.end());
    }
}

MySql.DB_TYPES = DB_TYPES;
module.exports = MySql;
