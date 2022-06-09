const path = require('path');

const args = getCommandArgs();
const port = Number(args.port) || 30001;
const nativeRoot = args.nativeRoot || process.cwd();
const generatorPath = 'generator';
const localGeneratorPath = path.join(nativeRoot, generatorPath);
const localTemplatesPath = path.join(localGeneratorPath, 'templates');
const systemTemplatesPath = path.join(__dirname, generatorPath, 'templates');

module.exports = {
    // 端口
    port,
    // 本地项目根目录
    nativeRoot,
    // 本地 localGeneratorPath
    localGeneratorPath,
    // 本地模版文件夹
    localTemplatesPath,
    // 系统模板文件夹
    systemTemplatesPath,
};

/**
 * 获取命令行参数 --port=3001 => {port: 3001}
 * @returns {{}}
 */
function getCommandArgs() {
    return process.argv.slice(2).reduce((prev, curr) => {
        const key = curr.split('=')[0].replace('--', '');
        const value = curr.split('=')[1];
        return { ...prev, [key]: value };
    }, {});
}
