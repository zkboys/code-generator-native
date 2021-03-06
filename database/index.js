const sequelize = require('./sequelize');

// sequelize.sync({ force: false });

module.exports = {
    sequelize,
    authenticated: false,
    Name: require('./model/Name'),
    FormType: require('./model/FormType'),
    DbType: require('./model/DbType'),
    Validation: require('./model/Validation'),
    UseLog: require('./model/UseLog'),
};

(async () => {
    try {
        await sequelize.authenticate();
        module.exports.authenticated = true;
    } catch (error) {
        module.exports.authenticated = false;
        console.log('词库连接失败，将无法使用，降级使用翻译。');
    }
})();
