const path = require('path');
const fs = require('fs-extra');
const openBrowser = require('./openBrowser');
const choosePort = require('./choosePort');
const config = require('../config');

/**
 * 获取命令行参数 --port=3000 --name=user  => {port: 3000, name: 'user'}
 * @returns {*}
 */
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

/**
 * 获取本地项目模板
 * @returns {Promise<{[p: string]: *}[]>}
 */
async function getLocalTemplates() {
    const templatesDir = config.localTemplatesPath;

    const files = getAllFiles(templatesDir);

    return files.map(filePath => {
        const template = require(filePath);
        const extname = path.extname(filePath);
        const templatePath = path.relative(templatesDir, filePath);
        const fileName = templatePath.replace(extname, '');
        return {
            id: fileName,
            fileName,
            filePath,
            ...template,
        };
    });
}

/**
 * 递归获取目录下所有文件
 * @param dir
 * @param fileList
 * @returns {*[]}
 */
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

/**
 * 基于系统模板，初始化本地项目模板
 */
function initLocalTemplates() {
    const templatesDir = config.localTemplatesPath;
    if (fs.existsSync(templatesDir)) return;

    // 目标项目的本地模版不存在，初始化默认模板
    const defaultTemplatesDir = config.systemTemplatesPath;

    fs.copySync(defaultTemplatesDir, templatesDir);
}

module.exports = {
    processArgs,
    getLocalTemplates,
    initLocalTemplates,
    choosePort,
    openBrowser,
};
