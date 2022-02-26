const path = require('path');
const fs = require('fs-extra');
const openBrowser = require('./openBrowser');
const choosePort = require('./choosePort');


function processArgs() {
    return process.argv.slice(2).reduce((prev, curr) => {
        const key = curr.split('=')[0].replace('--', '');
        const value = curr.split('=')[1];
        return {
            ...prev,
            [key]: value,
        };
    }, {});
}

async function getLocalTemplates() {
    const projectRootPath = process.cwd();
    const templatesDir = path.join(projectRootPath, '.generator-templates');

    const files = getAllFiles(templatesDir);

    return files.map(filePath => {
        const template = require(filePath);
        const extname = path.extname(filePath);
        const templatePath = path.relative(templatesDir, filePath);
        const fileName = templatePath.replace(extname, '');
        return {
            fileName,
            filePath,
            ...template,
        };
    });
}

function getAllFiles(dir, fileList = []) {
    const exist = fs.existsSync(dir);

    if (!exist) return fileList;

    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getAllFiles(fullPath, fileList);
        } else {
            fileList.push(fullPath);
        }
    });

    return fileList;
}

function initLocalTemplates() {
    const projectRootPath = process.cwd();
    const templatesDir = path.join(projectRootPath, '.generator-templates');
    if (fs.existsSync(templatesDir)) return;

    // 目标项目的本地模版不存在，初始化默认模板
    const defaultTemplatesDir = path.join(__dirname, '.generator-templates');

    fs.copySync(defaultTemplatesDir, templatesDir);
}

module.exports = {
    processArgs,
    getLocalTemplates,
    initLocalTemplates,
    choosePort,
    openBrowser,
};
