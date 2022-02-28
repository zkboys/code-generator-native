module.exports = class DbInterface {
    url;

    constructor(url) {
        this.url = url;
    }

    async testConnection(){
        throw Error('The testConnection method is not implemented!');
    }

    async getTables() {
        throw Error('The getTables method is not implemented!');
    }

    async getColumns(tableName) {
        throw Error('The getColumns method is not implemented!');
    }
};
