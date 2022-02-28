const path = require('path');
const fs = require('fs-extra');
const staticCache = require('koa-static-cache');
const inflection = require('inflection');
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
            id: fileName.replace(/\W/g, '_'),
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


/**
 * 静态文件服务
 * @param prefix
 * @param filePath
 * @param options
 * @returns {(function(*, *): Promise<*|number|undefined>)|*}
 */
function serveStatic(prefix, filePath, options = {}) {
    return staticCache(path.resolve(__dirname, filePath), {
        prefix: prefix,
        gzip: true,
        dynamic: true,
        ...options,
    });
}

/**
 * 获取各种类型的名字，驼峰、下划线、连字符等等
 * @param name
 */
function getNames(name) {
    name = name.replace(/-/g, '_');

    const names = {
        module_name: '',
        module_names: '',
        Module_name: '',
        Module_names: '',
        Module_Name: '',
        Module_Names: '',

        ['module-name']: '',
        ['module-names']: '',
        ['Module-name']: '',
        ['Module-names']: '',
        ['Module-Name']: '',
        ['Module-Names']: '',

        moduleName: '',
        ModuleName: '',
        moduleNames: '',
        ModuleNames: '',
    };

    // 复数 users
    const pluralize = inflection.pluralize(name);
    // 单数 user
    const singularize = inflection.singularize(name);
    // 首字母小写驼峰 userName
    const camelize = inflection.camelize(name, true);
    // 首字母大写驼峰 UserName
    const Camelize = inflection.camelize(name);
    // 下划线，首字母小写 user_name
    const underscore = inflection.underscore(name);
    // 下划线转空格，首字母大写 User name
    const Humanize = inflection.humanize(name);
    // 下划线转空格，首字母消息 user name
    const humanize = inflection.humanize(name, true);
    // 首字母大写 User_name
    const capitalize = inflection.capitalize(name);
    // 连字符 user-name
    const dasherize = inflection.dasherize(name);
    // 数据库表 user_names
    const tableize = inflection.tableize(name);
    // java类名 UserName
    const classify = inflection.classify(name);
    // 数据库外键
    const foreign_key = inflection.foreign_key(name);


    return {
        pluralize,
        singularize,
        camelize,
        Camelize,
        underscore,
        Humanize,
        humanize,
        capitalize,
        dasherize,
        tableize,
        classify,
        foreign_key,
    };
}


module.exports = {
    processArgs,
    getLocalTemplates,
    initLocalTemplates,
    choosePort,
    openBrowser,
    serveStatic,
    getNames,
};
