#!/usr/bin/env node
const path = require('path');
const spawn = require('cross-spawn');
const { initLocalTemplates, choosePort, openBrowser, saveUseLog } = require('../util');
const config = require('../config');

const program = require('commander');

// 命令配置
program
    .version(require('../package').version)
    .option('-v, --version', 'output the version number')
    .option('-p, --port <type>', 'set port')
    .on('--help', function() {
        console.log();
        console.log('Examples:');
        console.log('   $ ra-init [dir]      default init to current dir');
        console.log();
    })
    .parse(process.argv);

let options = program.opts();

const HOST = options.host || 'localhost';
const DEFAULT_PORT = parseInt(options.port, 10) || 30001;
const ROOT_PATH = path.join(__dirname, '..');

(async () => {
    // 如果本地模版不存在，创建本地模版
    initLocalTemplates();

    const port = await choosePort(HOST, DEFAULT_PORT, true);
    const nativeRoot = process.cwd();
    const command = path.join(ROOT_PATH, 'node_modules', '.bin', 'nodemon');
    // 监听本地目录改变之后，重启服务
    spawn(command, ['-w', config.localGeneratorPath, '--exec', `node index.js --port=${port} --nativeRoot=${nativeRoot}`], { stdio: 'inherit', cwd: ROOT_PATH });
    // spawn('node', ['index.js', `--port=${port}`], { stdio: 'inherit', cwd: ROOT_PATH });

    openBrowser(`http://${HOST}:${port}`);

    // 记录使用情况，等待数据库连接
    setTimeout(async () => {
        await saveUseLog();
    }, 1000);
})();
