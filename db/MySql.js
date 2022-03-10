const DbInterface = require('./DbInterface');
const { Sequelize } = require('sequelize');
const { QueryTypes } = require('@sequelize/core');

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
    }
}

MySql.DB_TYPES = DB_TYPES;
module.exports = MySql;
