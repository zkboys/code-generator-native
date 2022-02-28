const path = require('path');
const nativeProjectRootPath = process.cwd();
const localDir = path.join(nativeProjectRootPath, '.generator');

module.exports = {
    // 本地项目文件目录，存放模板等
    localDir,
    // 本地模版文件夹
    localTemplatesPath: path.join(localDir, 'templates'),
    // 系统模板文件夹
    systemTemplatesPath: path.join(__dirname, '.generator', 'templates'),
};
