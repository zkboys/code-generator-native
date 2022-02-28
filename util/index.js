const path = require('path');
const fs = require('fs-extra');
const staticCache = require('koa-static-cache');
const inflection = require('inflection');
const openBrowser = require('./openBrowser');
const choosePort = require('./choosePort');
const config = require('../config');

/**
 * 获取本地项目模板
 * @returns {Promise<{[p: string]: *}[]>}
 */
async function getLocalTemplates() {
    const templatesDir = config.localTemplatesPath;

    const files = getAllFiles(templatesDir);

    return files.map(filePath => {
        // TODO  应为这个require，模版改了之后，node服务部重启，拿不到最新数据
        const template = require(filePath);
        const extname = path.extname(filePath);
        const templatePath = path.relative(templatesDir, filePath);
        const fileName = templatePath.replace(extname, '');
        return {
            id: fileName.replace(/\W/g, '_'),
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
    return staticCache(filePath, {
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
function getModuleNames(name) {
    const {
        pluralize,
        singularize,
        camelize,
        underscore,
        capitalize,
        dasherize,
        titleize,
    } = inflection;
    name = name.replace(/-/g, '_');

    const moduleName = singularize(camelize(name, true));
    const ModuleName = singularize(camelize(name));
    const moduleNames = pluralize(moduleName);
    const ModuleNames = pluralize(ModuleName);
    const module_name = underscore(moduleName);
    const module_names = underscore(moduleNames);
    const Module_name = capitalize(module_name);
    const Module_names = capitalize(module_names);
    const Module_Name = titleize(module_name).replace(/\s/g, '_');
    const Module_Names = titleize(module_names).replace(/\s/g, '_');

    return {
        moduleName,
        ModuleName,
        moduleNames,
        ModuleNames,

        module_name,
        module_names,
        Module_name,
        Module_names,
        Module_Name,
        Module_Names,

        'module-name': dasherize(module_name),
        'module-names': dasherize(module_names),
        'Module-name': dasherize(Module_name),
        'Module-names': dasherize(Module_names),
        'Module-Name': dasherize(Module_Name),
        'Module-Names': dasherize(Module_Names),
    };
}

/**
 * 格式化字符串
 * @param str  eg: /front/pages/{module-name}/index.jsx
 * @param data eg: {'module-name': 'user-center'}
 * @returns {string}  eg: /front/pages/user-center/index.jsx
 */
function stringFormat(str, data) {
    if (!str || typeof str !== 'string' || !data) return str;

    return Object.entries(data)
        .reduce((prev, curr) => {
            const [key, value] = curr;
            const reg = new RegExp('({)?\\{' + key + '\\}(?!})', 'gm');
            return prev.replace(reg, value);
        }, str);
}

module.exports = {
    getLocalTemplates,
    initLocalTemplates,
    choosePort,
    openBrowser,
    serveStatic,
    getModuleNames,
    stringFormat,
};
