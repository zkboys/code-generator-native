const path = require('path');

// 命令行参数 --port=3001
const args = process.argv.slice(2).reduce((prev, curr) => {
    const key = curr.split('=')[0].replace('--', '');
    const value = curr.split('=')[1];
    return { ...prev, [key]: value };
}, {});

const nativeProjectRootPath = args.nativePath || process.cwd();
// const nativeProjectRootPath = process.cwd();
const localDir = path.join(nativeProjectRootPath, '.generator');

module.exports = {
    // 端口
    port: args.port || 3001,
    // 本地项目文件目录，存放模板等
    localDir,
    // 本地模版文件夹
    localTemplatesPath: path.join(localDir, 'templates'),
    // 系统模板文件夹
    systemTemplatesPath: path.join(__dirname, '.generator', 'templates'),
};

