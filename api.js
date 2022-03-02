const Router = require('koa-router');
const assert = require('assert');
const db = require('./db');
const {
    getLocalTemplates,
    getModuleNames,
    checkFilesExist,
    writeFile,
    getFilesContent,
} = require('./util');
const { DB_TYPES } = require('./db/MySql');

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

        return db(dbUrl).getColumns(tableName);
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
    .post('/generate/files', async ctx => {
        const { files, config } = ctx.request.body;
        const nextFiles = files.filter(item => item.rewrite !== false);

        await writeFile(nextFiles, config);
        return nextFiles.map(item => item.targetPath);
    })
    .post('/generate/preview', async ctx => {
        const { files, config } = ctx.request.body;
        return await getFilesContent(files, config);
    })
;
