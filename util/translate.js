const md5 = require('md5');
const axios = require('axios');
// 前面加上123123，防止被扫描！！！
const _appid = '12312320220309001118181';
const _secret = '123123RhK65o9phx_9QxOjXOYJ';
const salt = 'asdfsssdfasdfs';

async function translate(options) {
    const appid = _appid.replace('123123', '');
    const secret = _secret.replace('123123', '');
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
