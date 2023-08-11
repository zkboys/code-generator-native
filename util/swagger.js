const axios = require('axios');

const url = `http://admin:fhhj#$@80969HKJKJKDWER@@@@172.16.46.133:8081`;
// const url = `http://172.16.46.133:8081`;

(async () => {
    const docs = await getApiDocs(url);
    const {tags, paths, definitions} = docs;
    const apis = Object.entries(paths).map(([url, record]) => {
        return Object.entries(record).map(([method, options]) => {
            return {
                ...options,
                method,
                url,
            }
        })
    }).flat(Infinity);
    const options = tags.map(item => {
        const {description, name} = item;
        const children = apis.filter(it => it.tags.includes(name));
        return {
            key: name,
            title: name,
            description,
            children: children.map(it => {
                const {method, url, summary, parameters, responses} = it;
                const originalRef = responses?.[200]?.schema?.originalRef;
                const properties = definitions?.[originalRef]?.properties;

                const key = `${method}${url}${summary}`;
                return {
                    key,
                    ...it,
                }
            })
        }
    })
    console.log(JSON.stringify(options[0], null, 2));
})()


function getAllFields(api) {
    if (!api) return [];
    const {parameters, responses} = api;
    const responseSchema = responses?.['200']?.schema;

    if (!parameters?.length && !responseSchema) return [];


    const loop = data => {
        if (!data) return;
        if (typeof data !== 'object') return;


    }

    // originalRef:
    const schemas = [];
    parameters.forEach(item => {
        if (item.schema) {
            schemas.push(item.schema);
            ;
        }
    })

}


/**
 * 请求封装
 * @param url swagger网址
 * @returns {function(*, {}=): Promise<AxiosResponse<any>>}
 */
function axiosRequest(url) {
    const {origin, username, password} = analyzeURL(url);

    return async (_url, options = {}) => {
        const {headers, ...others} = options;

        const _headers = username && password ? {'Authorization': 'Basic ' + btoa(`${username}:${password}`)} : {};
        return await axios.get(`${origin}${_url}`, {
            ...others,
            headers: {
                ..._headers,
                ...headers,
            },
        });
    }
}

async function getApiDocs(url) {
    const request = axiosRequest(url);

    const res = await request('/swagger-resources');
    const resource = res?.data?.[0];
    if (!resource) return null;

    const docsRes = await request(resource.url);
    return docsRes.data;
}

async function getResources(url) {
    const request = axiosRequest(url);

    const res = await request('/swagger-resources');

    return res.data;
}


/**
 * 解析url 含有特殊字符的url 无法直接使用 new URL解析 比如 http://admin:fhhj#$@80WER@@@@127.0.0.1:8080
 * @param url
 * @returns {{password: *, username: *}|null}
 */
function analyzeURL(url) {
    // 正则表达式匹配用户名和密码部分
    const regex = /\/\/(.*):(.*)@/;
    const match = url.match(regex);

    if (match && match.length >= 3) {
        const username = match[1];
        const password = match[2];
        const _url = url.replace(`${username}:${password}@`, '');
        const {href, origin, protocol, host, hostname, port} = new URL(_url);
        return {
            href,
            origin,
            protocol,
            host,
            hostname,
            port,
            username,
            password
        };
    } else {
        return null; // 匹配失败
    }
}
