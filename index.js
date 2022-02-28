const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const koaBody = require('koa-body');
const favicon = require('koa-favicon');
const cors = require('@koa/cors');
const { serveStatic } = require('./util');
const config = require('./config');
const api = require('./api');
const version = require('./package').version;

const app = new Koa();

app
    .use(favicon(path.join(__dirname, '/public/favicon.ico')))
    .use(serveStatic('/public/static', path.join(__dirname, 'public', 'static'), { maxAge: 60 * 60 * 24 * 30 }))
    .use(serveStatic('/public', path.join(__dirname, 'public')))
    .use(serveStatic('/upload', path.join(__dirname, 'upload')))
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
    .use(api.routes())
    .use(async ctx => {
        ctx.type = 'html';
        ctx.body = fs.createReadStream(path.resolve(__dirname, 'public', 'index.html'));
    })
;
// 获取端口号
const port = Number(config.port);

app.listen(port);
console.log(`generator server@${version} started at http://localhost:${port}`);
