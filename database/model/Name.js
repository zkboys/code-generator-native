const sequelize = require('../sequelize');
const { INTEGER, STRING } = require('sequelize');

module.exports = sequelize.define('Name', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING(50), comment: '字段名' },
    chinese: { type: STRING(50), comment: '中文名' },
    weight: { type: INTEGER, comment: '权重' },
}, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
});
