const path = require('path');
const fs = require('fs-extra');
const staticCache = require('koa-static-cache');
const inflection = require('inflection');
const openBrowser = require('./openBrowser');
const choosePort = require('./choosePort');
const config = require('../config');
const assert = require('assert');
const { exec } = require('child_process');
const packageJson = require('../package.json');
const mysql = require('mysql');


async function downloadTemplates() {
    const systemTemplatesDir = config.systemTemplatesPath;
    const systemTemplates = getAllFiles(systemTemplatesDir);

    for (let filePath of systemTemplates) {
        const fileName = path.relative(systemTemplatesDir, filePath);
        const localPath = path.join(config.localTemplatesPath, fileName);
        const fileContent = await fs.readFile(filePath, 'UTF-8');
        await fs.ensureFile(localPath);
        await fs.writeFile(localPath, fileContent, 'UTF-8');
    }
}

/**
 * 获取本地项目模板
 */
function getLocalTemplates() {
    const templatesDir = config.localTemplatesPath;

    const files = getAllFiles(templatesDir);

    return files.map(filePath => {
        const template = require(filePath);
        const extname = path.extname(filePath);
        const basename = path.basename(filePath);

        const fileName = path.relative(templatesDir, filePath).replace(extname, '');
        const id = fileName.replace(/\W/g, '_');
        const shortName = template.name || basename.replace(extname, '');
        const name = template.name || fileName;
        return {
            ...template,
            filePath,
            id,
            name,
            shortName,
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
 * 获取文件内容
 * @param files
 * @param moduleName
 * @param fields
 * @returns {Promise<*>}
 */
function getFilesContent(files, moduleName, fields) {
    // 保存用户字段配置 name chinese
    // 不是用await，防止阻塞
    saveNames(fields);

    const templates = getLocalTemplates();

    return files.map(file => {
        const { templateId, name } = file;
        const template = templates.find(item => item.id === templateId);

        assert(template, `${name} 模版不存在!`);

        const moduleNames = getModuleNames(moduleName);

        const fis = fields.map(item => {
            const fieldOptions = item.options && item.options[templateId] || [];
            const __names = getModuleNames(item.name);
            return {
                ...item,
                validation: item.validation || [],
                __names,
                fieldOptions,
            };
        });
        const NULL_LINE = '_____NULL_LINE_____';
        const cfg = { NULL_LINE, file, files, moduleNames, fields: fis };
        const content = template.getContent(cfg)
            .trim()
            .split('\n')
            .filter(item => !item.includes(NULL_LINE))
            .join('\n');

        return {
            ...template,
            ...file,
            content,
        };
    });
}

/**
 * 检查文件是否存在
 * @param filePaths
 * @returns {Promise<*[]>}
 */
async function checkFilesExist(filePaths) {
    let result;
    for (let fp of filePaths) {
        const filePath = path.join(config.nativeRoot, fp);
        const exist = await fs.exists(filePath);
        if (exist) {
            if (!result) result = [];
            result.push(fp);
        }
    }
    return result;
}

/**
 * 写入文件
 * @param files
 * @param moduleName
 * @param fields
 * @returns {Promise<void>}
 */
async function writeFile(files, moduleName, fields) {
    const filesContents = getFilesContent(files, moduleName, fields);
    const result = [];
    for (let file of filesContents) {
        const { targetPath, content } = file;

        const filePath = path.join(config.nativeRoot, targetPath);

        await fs.ensureFile(filePath);
        await fs.writeFile(filePath, content, 'UTF-8');

        console.log('generate file');
        console.log(`    at (${filePath}:1:1)`);

        result.push(targetPath);
    }

    return result;
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

async function getLastVersion() {
    return await new Promise((resolve, reject) => {
        exec(`npm view ${packageJson.name} version`, (error, stdout, stderr) => {
            if (stdout) return resolve(stdout.trim());
            reject(Error('获取版本失败'));
        });
    });
}

async function updateVersion() {
    return await new Promise((resolve, reject) => {
        exec(`npm i ${packageJson.name} -g --registry=https://registry.npmmirror.com`, (error, stdout, stderr) => {
            if (stdout) return resolve(stdout.trim());
            reject(Error('更新版本失败'));
        });
    });
}

async function getConnection() {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection('mysql://root:123456@172.16.60.247:3306/code-generator');

        connection.connect(function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
}

async function getNames(names, field) {
    const connection = await getConnection();
    const values = names.map(item => item[field]);
    if (!values.length) return [];
    return new Promise((resolve, reject) => {
        const sql = `select name, chinese, weight
                     from names
                     where ${field} in (?)
                     order by weight desc`;
        connection.query(sql, [values], (error, results) => {
            if (error) return reject(error);

            const res = values.map(value => {
                const record = results.find(item => item[field] === value);
                if (record) return record;

                // 未查到结果 调用翻译接口？？？
                // return {
                //     name: 'aaa',
                //     chinese: '',
                //     [field]: value,
                //     weight: 0,
                // };
            }).filter(Boolean);
            resolve(res);
        });
    }).finally(() => connection.end());
}

async function saveNames(names) {
    names = names.filter(item => item.name && item.chinese);

    const connection = await getConnection();
    const insert = (name, chinese, weight) => new Promise((resolve, reject) => {
        if (!weight) weight = 0;
        const sql = `insert into names (name, chinese, weight)
                     values (?, ?, ?)`;
        connection.query(sql, [name, chinese, weight], (error, results) => {
            if (error) return reject(error);

            resolve(results);
        });
    });

    const query = (name, chinese) => new Promise((resolve, reject) => {
        const sql = `select id, name, chinese, weight
                     from names
                     where name = ?
                       and chinese = ?
        `;
        connection.query(sql, [name, chinese], (error, results) => {
            if (error) return reject(error);

            resolve(results);
        });
    });
    const modifyWeight = (id, newWeight) => new Promise((resolve, reject) => {
        const sql = `update names
                     set weight=?
                     where id = ?`;

        connection.query(sql, [newWeight, id], (error, results) => {
            if (error) return reject(error);

            resolve(results);
        });
    });

    try {
        for (let item of names) {
            const { name, chinese } = item;
            const result = await query(name, chinese);
            if (result && result.length) {
                await modifyWeight(result[0].id, result[0].weight + 1);
            } else {
                await insert(name, chinese);
            }
        }
    } finally {
        connection.end();
    }
}

module.exports = {
    downloadTemplates,
    getLocalTemplates,
    initLocalTemplates,
    choosePort,
    openBrowser,
    serveStatic,
    getModuleNames,
    stringFormat,
    getFilesContent,
    checkFilesExist,
    writeFile,
    getLastVersion,
    updateVersion,
    getNames,
    saveNames,
};
