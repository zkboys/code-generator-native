const path = require('path');

// 命令行参数 --port=3001
const args = process.argv.slice(2).reduce((prev, curr) => {
    const key = curr.split('=')[0].replace('--', '');
    const value = curr.split('=')[1];
    return { ...prev, [key]: value };
}, {});

const port = args.port || 3001;

const nativeRoot = args.nativeRoot || process.cwd();
// const nativeRoot = process.cwd();
const localGeneratorPath = path.join(nativeRoot, '.generator');
const localTemplatesPath = path.join(localGeneratorPath, 'templates');
const systemTemplatesPath = path.join(__dirname, '.generator', 'templates');

module.exports = {
    // 端口
    port,
    // 本地项目根目录
    nativeRoot,
    // 本地模版文件夹
    localTemplatesPath,
    // 系统模板文件夹
    systemTemplatesPath,
};

