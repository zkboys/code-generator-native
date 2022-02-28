const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body');
const favicon = require('koa-favicon');
const cors = require('@koa/cors');
const { processArgs, serveStatic } = require('./util');
const api = require('./api');
const version = require('./package').version;

const app = new Koa();

app
    .use(favicon(path.join(__dirname, '/public/favicon.ico')))
    .use(serveStatic('/public/static', './public/static', { maxAge: 60 * 60 * 24 * 30 }))
    .use(serveStatic('/public', './public'))
    .use(serveStatic('/upload', './upload'))
    .use(cors({
        credentials: true,
        maxAge: 2592000,
    }))
    .use(koaBody({
        multipart: true,
        formidable: {
            maxFileSize: 200 * 1024 * 1024,
        },
    }))
    .use(api.routes());

const data = processArgs();
// 获取端口号
const port = Number(data.port) || 3001;

app.listen(port);
console.log(`generator server@${version} started at http://localhost:${port}`);
