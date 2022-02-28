const proxy = require('http-proxy-middleware');

// 前端web服务代理配置
module.exports = function(app) {
    app.use(
        proxy('/api', {
            target: 'http://localhost:3001',
            // pathRewrite: { '^/api': '' },
            changeOrigin: true,
            secure: false, // 是否验证证书
            ws: true, // 启用websocket
        }),
    );
};

