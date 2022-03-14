module.exports = {
    targetPath: '/src/model/{ModuleName}.js',
    getContent: config => {
        const { fields, moduleNames: mn } = config;
        return `
const sequelize = require('../sequelize');
const { INTEGER, STRING } = require('sequelize');

module.exports = sequelize.define('${mn.ModuleName}', {
    ${fields.map(item => {
            let { name, chinese, type, length, dbOptions = [] } = item;
            const primaryKey = dbOptions.includes('主键');
            const autoIncrement = dbOptions.includes('自增长');
            const allowNull = dbOptions.includes('不为空');
            const unique = dbOptions.includes('唯一');

            if (['VARCHAR', 'CHAR'].includes(type)) type = `STRING(${length})`;
            if (['INT'].includes(type)) type = 'INTEGER';

            // TODO 数据库类型 与 sequelize 类型对应关系
            return `${name}: { type: ${type}, comment: '${chinese}', ${primaryKey ? 'primaryKey: true, ' : ''}${autoIncrement ? 'autoIncrement: true, ' : ''}${allowNull ? 'allowNull: false, ' : ''}${unique ? 'unique: true, ' : ''}},`;
        }).join('\n    ')}
}, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    // timestamps: false,
});
        `;
    },
};
