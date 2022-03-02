#!/usr/bin/env node
const path = require('path');
const spawn = require('cross-spawn');
const { initLocalTemplates, choosePort, openBrowser } = require('../util');
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

const HOST = options.host || '0.0.0.0';
const DEFAULT_PORT = parseInt(options.port, 10) || 3001;
const ROOT_PATH = path.join(__dirname, '..');

(async () => {
    // 如果本地模版不存在，创建本地模版
    initLocalTemplates();

    const port = await choosePort(HOST, DEFAULT_PORT, true);
    const cwd = process.cwd();
    // 监听本地目录改变之后，重启服务
    spawn('nodemon', ['-w', config.localGeneratorPath, '--exec', `node index.js --port=${port} --nativeRoot=${cwd}`], { stdio: 'inherit', cwd: ROOT_PATH });
    // spawn('node', ['index.js', `--port=${port}`], { stdio: 'inherit', cwd: ROOT_PATH });

    openBrowser(`http://${HOST}:${port}`);
})();
