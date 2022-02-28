const MySql = require('./MySql');

function getDb(url) {
    const data = new URL(url);
    const { protocol } = data;

    if (protocol === 'mysql:') return new MySql(url);

    throw Error(`${protocol} is not supported!`);
}

module.exports = getDb;
