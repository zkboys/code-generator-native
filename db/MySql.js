const DbInterface = require('./DbInterface');
const { getInfoByComment, getFormTypeByChinese } = require('./util');
const { Sequelize } = require('sequelize');
const { QueryTypes } = require('@sequelize/core');

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
    sequelize;

    constructor(url) {
        super(url);
        this.database = new URL(url).pathname.replace('/', '');
        this.sequelize = new Sequelize(url, { logging: false });
    }

    async getTypeOptions() {
        return DB_TYPES;
    }

    async testConnection() {
        try {
            await this.sequelize.authenticate();
            return true;
        } catch (e) {
            return false;
        }
    }

    async getTables() {
        const tableInfoSql = `select table_name as name, table_comment as comment
                              from information_schema.tables
                              where table_schema = '${this.database}'
                                and (table_type = 'base table' or table_type = 'BASE TABLE')`;

        return await this.sequelize.query(tableInfoSql, { type: QueryTypes.SELECT });
    }

    async getColumns(tableName) {
        const tableInfoSql = `select *
                              from information_schema.columns
                              where table_schema = "${this.database}"
                                and table_name = "${tableName}"`;
        const results = await this.sequelize.query(tableInfoSql, { type: QueryTypes.SELECT });

        return results.map(item => {
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
        });
    }
}

MySql.DB_TYPES = DB_TYPES;
module.exports = MySql;
