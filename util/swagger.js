const axios = require('axios');

const url = `http://admin:fhhj#$@80969HKJKJKDWER@@@@22.50.9.44:8080`;
// const url = `http://172.16.46.133:8081`;

(async () => {

    const options = await getApiOptions(url);

    const api = options[10]?.children?.[0];

    const fields = await getApiFields(api.key, url);

    console.log(fields);
})()

async function getApiFields(key, url) {
    const docs = await getApiDocs(url);
    const apis = getApis(docs);
    const api = apis.find(item => item.key === key);

    const {definitions} = docs;
    return getAllFields(api, definitions);
}

async function getApiOptions(url) {
    const docs = await getApiDocs(url);
    const apis = getApis(docs);
    const {tags} = docs;

    return tags.map(item => {
        const {description, name} = item;
        const children = apis.filter(it => it.tags.includes(name));
        return {
            key: name,
            title: name,
            description,
            children,
        }
    });
}

function getApis(docs) {
    const {paths} = docs;
    return Object.entries(paths).map(([url, record]) => {
        return Object.entries(record).map(([method, options]) => {
            const key = `${method}${url}`;
            return {
                ...options,
                key,
                method,
                url,
            }
        })
    }).flat(Infinity);
}


const IGNORE_NAMES = [
    'pageNum',
    'pageSize',
    'pageNumber',
    'paged',
    'totalElements',
    'totalPages',
];

function getAllFields(api, definitions) {
    const fields = [];
    const originalRefs = [];

    const loop = data => {
        if (!data) return;

        if (typeof data !== 'object') return;

        if (Array.isArray(data)) return data.forEach(loop);

        Object.entries(data).forEach(([key, value]) => {
            if (!['parameters', 'properties', 'schema'].includes(key)) {
                loop(value);
            }

            if (key === 'schema') {
                const {originalRef} = value;
                if (!originalRefs.includes(originalRef)) {
                    originalRefs.push(originalRef);

                    const obj = definitions?.[originalRef] || {};
                    loop(obj)
                }
            }

            if (key === 'parameters') {
                value.forEach(item => {
                    const {name, in: position, description, required, type, schema} = item;
                    if (schema) {
                        const {originalRef} = schema;
                        if (originalRefs.includes(originalRef)) return;
                        originalRefs.push(originalRef);

                        const obj = definitions?.[originalRef] || {};
                        loop(obj)
                    } else {
                        if (!['array', 'object'].includes(type) && !IGNORE_NAMES.includes(name)) fields.push({
                            name,
                            position,
                            description,
                            required,
                            type
                        });
                    }
                })
            }
            if (key === 'properties') {
                const ks = Object.keys(value);
                if (ks.includes('content')) {
                    loop(value.content)
                } else if (ks.includes('data')) {
                    loop(value.data);
                } else {
                    Object.entries(value).forEach(([name, v]) => {
                        const {
                            type,
                            format,
                            description,
                            minimum,
                            maximum,
                            exclusiveMinimum,
                            exclusiveMaximum,
                            readOnly,
                            enum: _enum,
                            items,
                            originalRef,
                        } = v;
                        const {_originalRef} = items || {};
                        const ori = _originalRef || originalRef

                        if (ori) {
                            if (originalRefs.includes(ori)) return;
                            originalRefs.push(ori);

                            const obj = definitions?.[ori] || {};
                            loop(obj)
                        } else {
                            if (!['array', 'object'].includes(type) && !IGNORE_NAMES.includes(name)) fields.push({
                                name,
                                type,
                                format,
                                description,
                                minimum,
                                maximum,
                                exclusiveMinimum,
                                exclusiveMaximum,
                                readOnly,
                                _enum,
                            })
                        }
                    })
                }
            }
        })
    }

    loop(api);

    return fields;
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

    const res = await getResources(url);
    const resource = res?.[0];

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
