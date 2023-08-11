const axios = require('axios');

const username = 'admin';
const password = 'fhhj#$@80969HKJKJKDWER@@@';

async function getApiDocs(origin, username, password) {

    const res = await axios.get(`${origin}/v2/api-docs`, {
        headers: {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`)
        },
    })
}
