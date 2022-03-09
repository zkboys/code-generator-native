const Router = require('koa-router');
const assert = require('assert');
const db = require('./db');
const {
    getLocalTemplates,
    getModuleNames,
    checkFilesExist,
    writeFile,
    getFilesContent,
    downloadTemplates,
    stringFormat,
    getLastVersion,
    updateVersion,
    getNames,
    getValidation,
} = require('./util');
const { DB_TYPES } = require('./db/MySql');
const packageJson = require('./package.json');

const apiRouter = new Router({ prefix: '/api' });
module.exports = apiRouter
    /** 结果处理 */
    .use(async (ctx, next) => {
        try {
            const data = await next();
            if (ctx.body === undefined) ctx.body = { code: 0, message: 'ok', data };
        } catch (error) {
            console.error(error);
            ctx.body = { code: 9999, message: error.message, error, data: null };
        }
    })
    /** 获取数据库表 */
    .get('/db/tables', async ctx => {
        const { dbUrl } = ctx.query;
        assert(dbUrl, '数据库地址不能为空！');
        return db(dbUrl).getTables();
    })
    /** 获取数据库表字段 */
    .get('/db/tables/:tableName', async ctx => {
        const { dbUrl } = ctx.query;
        const { tableName } = ctx.params;

        assert(tableName, '数据库表不能为空');
        assert(dbUrl, '数据库地址不能为空！');

        const res = await db(dbUrl).getColumns(tableName);
        return res.map(item => {
            const { name } = item;

            return {
                ...item,
                dbName: name,
                name: getModuleNames(name).moduleName,
                validation: getValidation(item),
            };
        });
    })
    /** 获取数据库类型 options */
    .get('/db/types', async ctx => {
        const { dbUrl } = ctx.query;

        if (!dbUrl) return DB_TYPES;

        return db(dbUrl).getTypeOptions();
    })
    /** 获取所有模版 */
    .get('/templates', async ctx => {
        return await getLocalTemplates();
    })
    /** 获取模版详情 */
    .get('/templates/:id', async ctx => {
        const { id } = ctx.params;
        assert(id, '模版id不能为空！');

        const templates = await getLocalTemplates();
        const template = templates.find(item => item.id === id);
        assert(template, '模版不存在！');

        return template;
    })
    .get('/templates/local/download', async ctx => {
        await downloadTemplates();
    })
    .get('/moduleNames/:name', async ctx => {
        const { name } = ctx.params;
        assert(name, 'name参数不能为空！');

        return getModuleNames(name);
    })
    .post('/generate/files/exist', async ctx => {
        const { files } = ctx.request.body;
        const filePaths = files.filter(item => !item.force).map(item => item.targetPath);
        return await checkFilesExist(filePaths);
    })
    .post('/generate/file/exist', async ctx => {
        const { targetPath } = ctx.request.body;
        const res = await checkFilesExist([targetPath]);
        return !!(res && res.length);
    })
    .post('/generate/files', async ctx => {
        const { files, moduleName, config } = ctx.request.body;
        const nextFiles = files.filter(item => item.rewrite !== false);

        return await writeFile(nextFiles, moduleName, config);
    })
    .post('/generate/files/batch', async ctx => {
        const { files, tables, dbUrl } = ctx.request.body;
        const result = [];
        for (let tableName of tables) {
            const moduleNames = getModuleNames(tableName);
            const moduleName = moduleNames['module-name'];

            const nextFiles = files.map(item => {
                const templates = getLocalTemplates();
                const template = templates.find(it => it.id === item.templateId);
                if (!template) return null;

                const targetPath = template.targetPath;
                return {
                    ...template,
                    ...item,
                    targetPath: stringFormat(targetPath, moduleNames),
                };
            }).filter(Boolean);

            const tableFields = await db(dbUrl).getColumns(tableName);
            const fields = tableFields.map(item => {
                const options = nextFiles.reduce((prev, curr) => {
                    const { templateId, fieldOptions } = curr;
                    return {
                        ...prev,
                        [templateId]: [...fieldOptions],
                    };
                }, {});
                return {
                    ...item,
                    options,
                };
            });
            const res = await writeFile(nextFiles, moduleName, fields);
            result.push(res);
        }
        return result.flat();
    })
    .post('/generate/preview', async ctx => {
        const { files, moduleName, config } = ctx.request.body;
        return await getFilesContent(files, moduleName, config);
    })
    .get('/version', async ctx => {
        const lastVersion = await getLastVersion();

        const currentVersion = packageJson.version;
        return {
            lastVersion,
            currentVersion,
        };
    })
    .put('/update', async ctx => {
        return await updateVersion();
    })
    .post('/autoNames', async ctx => {
        const { names } = ctx.request.body;
        const _chinese = [];
        const _names = [];
        names.forEach(item => {
            const { name, chinese } = item;
            if (!name && chinese) {
                _chinese.push(item);
            }
            if (name && !chinese) {
                _names.push(item);
            }
        });

        const chineseRes = await getNames(_chinese, 'chinese');
        const nameRes = await getNames(_names, 'name');
        const result = [...chineseRes, ...nameRes];

        return names.map(item => {
            const { name, chinese } = item;
            if (!name && chinese) {
                const record = result.find(it => it.chinese === chinese);
                item.name = record?.name;
                if (item.name) item.name = getModuleNames(item.name).moduleName;
                return item;
            }
            if (name && !chinese) {
                const record = result.find(it => it.name === name);
                item.chinese = record?.chinese;
                return item;
            }
            return item;
        });
    })
;
