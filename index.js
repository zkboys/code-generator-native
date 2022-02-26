const Koa = require('koa');
const app = new Koa();
const { processArgs, getLocalTemplates } = require('./util');
const version = require('./package').version;

app.use(async ctx => {
    ctx.body = 'Hello World';
});

const data = processArgs();
// 获取端口号
const port = Number(data.port) || 3001;

(async () => {
    const templates = await getLocalTemplates();
    console.log(templates.map(item => item.fileName));
})();

app.listen(port);
console.log(`generator server@${version} started at http://localhost:${port}`);

