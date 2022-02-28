const Router = require('koa-router');
const assert = require('assert');
const apiRouter = new Router({ prefix: '/api' });
const { getLocalTemplates, getNames } = require('./util');

module.exports = apiRouter
    .use(async (ctx, next) => {
        try {
            const data = await next();
            if (data !== undefined) {
                ctx.body = {
                    code: 0,
                    message: 'ok',
                    data,
                };
            }
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                code: 9999,
                message: error.message,
                error,
                data: null,
            };
        }
    })
    // 获取模版
    .get('/templates', async (ctx) => {
        return await getLocalTemplates();
    })
    .get('/templates/:id', async (ctx) => {
        const { id } = ctx.params;
        const {moduleName} = ctx.query;
        assert(id, '模版id不能为空！');

        const templates = await getLocalTemplates();
        const template = templates.find(item => item.id === id);
        assert(template, '模版不存在！');

        const temp = require(template.filePath);
        const names = getNames(moduleName || 'userName');
        console.log(names);
        console.log(temp);

        return template;
    });
