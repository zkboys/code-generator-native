const md5 = require('md5');
const axios = require('axios');
const appid = '20220309001118181';
const secret = 'ElNiLc0MwM9qX4gkSXiU';
const salt = 'asdfsssdfasdfs';

async function translate(options) {
    const { q, from, to } = options;
    const str = appid + q + salt + secret;
    const sign = md5(str);

    const params = {
        q,
        from,
        to,
        appid,
        salt,
        sign,
    };
    const res = await axios.get('http://api.fanyi.baidu.com/api/trans/vip/translate', { params });

    if (res && res.data && res.data.trans_result && res.data.trans_result.length) {
        return res.data.trans_result[0].dst;
    }
    return null;
}

module.exports = translate;
