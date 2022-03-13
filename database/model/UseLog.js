const sequelize = require('../sequelize');
const { INTEGER, STRING } = require('sequelize');

module.exports = sequelize.define('UseLog', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    ip: { type: STRING(50), comment: '使用者的ip地址' },
}, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    // timestamps: false,
});
