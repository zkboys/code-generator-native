const MySql = require('./MySql');
const Oracle = require('./Oracle');

function getDb(url) {
    const data = new URL(url);
    const { protocol } = data;

    if (protocol === 'mysql:') return new MySql(url);
    if (protocol === 'oracle:') return new Oracle(url);

    throw Error(`${protocol} is not supported!`);
}

module.exports = getDb;
