const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
    'mysql://root:123456@172.16.60.247:3306/code-generator',
    {
        logging: false,
    },
);
module.exports = sequelize;
