const sequelize = require('./sequelize');

// sequelize.sync({ force: true });

module.exports = {
    sequelize,
    Name: require('./model/Name'),
};
