const mysql = require('mysql');
const DbInterface = require('./DbInterface');
const { getInfoByComment, getFormTypeByChinese } = require('./util');

const TYPES = {
    VARCHAR: {
        form: 'input',
        java: 'String',
    },
    CHAR: {
        form: 'input',
        java: 'String',
    },
    BLOB: {
        form: 'input',
        java: 'String',
    },
    TEXT: {
        form: 'textarea',
        java: 'String',
    },
    INTEGER: {
        form: 'number',
        java: 'Long',
    },
    TINYINT: {
        form: 'number',
        java: 'Integer',
    },
    SMALLINT: {
        form: 'number',
        java: 'Integer',
    },
    MEDIUMINT: {
        form: 'number',
        java: 'Integer',
    },
    BIT: {
        form: 'switch',
        java: 'Boolean',
    },
    BIGINT: {
        form: 'number',
        java: 'BigInteger',
    },
    FLOAT: {
        form: 'number',
        java: 'Float',
    },
    DOUBLE: {
        form: 'number',
        java: 'Double',
    },
    DECIMAL: {
        form: 'number',
        java: 'BigDecimal',
    },
    BOOLEAN: {
        form: 'switch',
        java: 'Boolean',
    },
    ID: {
        form: 'input',
        java: 'Long',
    },
    DATE: {
        form: 'date',
        java: 'Date',
    },
    TIME: {
        form: 'time',
        java: 'Time',
    },
    DATETIME: {
        form: 'date-time',
        java: 'Timestamp',
    },
    TIMESTAMP: {
        form: 'date-time',
        java: 'Timestamp',
    },
    YEAR: {
        form: 'date',
        java: 'Date',
    },
};

function getTypes(type, chinese) {
    const types = TYPES[type] || {};
    const defaultForm = 'input';
    const defaultJava = 'String';
    const form = getFormTypeByChinese(chinese, types.form || defaultForm);
    const java = types.java || defaultJava;

    return {
        form,
        java,
    };
}

module.exports = class MySql extends DbInterface {
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
                    const type = item.DATA_TYPE; // COLUMN_TYPE
                    const comment = item.COLUMN_COMMENT;
                    const isNullable = item.IS_NULLABLE === 'YES';
                    const length = item.CHARACTER_MAXIMUM_LENGTH; // CHARACTER_OCTET_LENGTH

                    const commentInfo = getInfoByComment(comment);
                    const { chinese, options } = commentInfo;

                    const types = getTypes(type, chinese);

                    return {
                        type,
                        types,
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
};
