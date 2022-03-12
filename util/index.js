const path = require('path');
const fs = require('fs-extra');
const assert = require('assert');
const { exec } = require('child_process');
const staticCache = require('koa-static-cache');
const inflection = require('inflection');
const openBrowser = require('./openBrowser');
const choosePort = require('./choosePort');
const config = require('../config');
const packageJson = require('../package.json');
const { Name: NameModel } = require('../database');
const translate = require('./translate');
const db = require('../db');

const TYPE_MAP = {
    String: 'input',
    long: 'number',
    int: 'number',
    boolean: 'switch',
    BigInteger: 'number',
    float: 'number',
    double: 'number',
    BigDecimal: 'number',
    Date: 'date',
    Time: 'time',
    Timestamp: 'date-time',
};


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
            options: template.options || [],
            fieldOptions: template.fieldOptions || [],
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
 * @param options
 * @returns {Promise<*>}
 */
function getFilesContent(options) {
    const { files, moduleName, fields, ...others } = options;
    // 保存用户字段配置 name chinese
    // 不是用await，防止阻塞
    saveNames((fields || []).filter(item => !item.__isItems));

    const templates = getLocalTemplates();

    return files.map(file => {
        const { templateId, name } = file;
        const template = templates.find(item => item.id === templateId);

        assert(template, `${name} 模版不存在!`);

        const moduleNames = getModuleNames(moduleName);

        const fis = fields.map(item => {
            const fieldOptions = item.fileOptions && item.fileOptions[templateId] || [];
            const __names = getModuleNames(item.name);
            return {
                ...item,
                validation: item.validation || [],
                __names,
                fieldOptions,
            };
        });
        const NULL_LINE = '_____NULL_LINE_____';

        const cfg = {
            ...others,
            NULL_LINE,
            file,
            files,
            moduleNames,
            fields: fis,
        };
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
 * @param options
 * @returns {Promise<void>}
 */
async function writeFile(options) {
    const filesContents = getFilesContent(options);
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
        humanize,
    } = inflection;

    // 非字符 比如 连字符、空格等 转下划线
    name = name.replace(/\W/g, '_');

    // 全大写 + 下划线，转为全小写 + 下划线
    if (/^[A-Z_0-9]+$/.test(name)) name = name.toLowerCase();

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
        'Module name': humanize(module_name),
        'module name': humanize(module_name, true),
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
        exec(`npm view ${packageJson.name} version --registry=https://registry.npmmirror.com`, (error, stdout, stderr) => {
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

/**
 * 从词库、或翻译获取对应的中英文
 * @param names
 * @param fromField
 * @returns {Promise<unknown[]|*[]>}
 */
async function getNames(names, fromField) {
    const values = names.map(item => item[fromField]);
    if (!values.length) return [];

    const { authenticated } = require('../database');

    const results = authenticated ? await NameModel.findAll({
        where: { [fromField]: values },
        order: [['weight', 'desc'], ['updatedAt', 'desc']],
    }) : [];

    const result = await Promise.all(values.map(async value => {
        const record = results.find(item => item[fromField] === value);
        if (record) return record;

        // 未查到结果 调用翻译接口
        const isFromName = fromField === 'name';
        // 英文驼峰式命名，转空格（自然语言方式），翻译接口才可以理解
        const val = isFromName ? getModuleNames(value)['module name'] : value;

        const params = {
            q: val,
            from: isFromName ? 'en' : 'zh',
            to: isFromName ? 'zh' : 'en',
        };
        const res = await translate(params);

        if (!res) return;

        return {
            name: isFromName ? value : res,
            chinese: isFromName ? res : value,
        };
    }));

    return result.filter(Boolean);
}

/**
 * 将中英文配置保存到词库中
 * @param names
 * @returns {Promise<void>}
 */
async function saveNames(names) {
    const { authenticated } = require('../database');
    if (!authenticated) return;

    names = names.filter(item => item.name && item.chinese);
    for (let item of names) {
        const { name, chinese } = item;
        const result = await NameModel.findOne({ where: { name, chinese } });
        if (result) {
            await result.update({ weight: result.weight + 1 });
        } else {
            await NameModel.create({ name, chinese, weight: 0 });
        }
    }
}

/**
 * 根据数据库信息，获取校验规则
 * @param info
 * @returns {(boolean|string)[]}
 */
function getValidation(info) {
    const { isNullable, comment = '', name = '' } = info;
    const isXxx = (chinese, validator) => {
        if (comment.includes(chinese) || name.toLowerCase().includes(validator)) {
            return validator;
        }
    };

    return Array.from(new Set([
        !isNullable && 'required',
        isXxx('手机号', 'mobile'),
        isXxx('邮箱', 'email'),
        isXxx('ip地址', 'ip'),
        isXxx('IP地址', 'ip'),
        isXxx('座机号', 'landLine'),
        isXxx('身份证号', 'cardNumber'),
        isXxx('qq号', 'qq'),
        isXxx('QQ号', 'qq'),
        isXxx('端口号', 'port'),
    ].filter(Boolean)));
}

/**
 * 根据数据库信息获取表单类型
 * @param info
 */
function getFormType(info) {
    if (info.options && info.options.length) return 'select';

    return TYPE_MAP[info.dataType] || 'input';
}

/**
 * 基于非_、-、中文、英文、数字，进行拆分
 * @param comment
 * @returns {*[]|*}
 */
function splitComment(comment) {
    if (!comment) return [];
    const str = comment.trim();
    return str
        .split(/[^_\-0-9a-zA-Z\u4e00-\u9fa5]/)
        .filter(Boolean);
}

/**
 * 根据数据库信息，获取中文名
 * @param info
 */
function getChinese(info) {
    let { comment } = info;
    const items = splitComment(comment);
    return items[0];
}

/**
 * 根据数据库信息获取码表数据
 * 数据库注释规则：数字 + 空格 + 文本
 *      比如：状态，用户的状态 01 启用 02 禁用
 * @param info
 */
function getOptions(info) {
    const { comment } = info;
    if (!comment) return;

    const items = splitComment(comment);

    return items.map((item, index) => {
        const nextItem = items[index + 1];
        if (!nextItem) return;

        // 是数字形式 01：启用 02：禁用
        if (Number(item) === Number(item)) {
            return {
                value: item,
                label: nextItem,
            };
        }
        // 是true/false形式 true：启用 false：禁用
        if (['true', 'false'].includes(item)) {
            return {
                value: item === 'true',
                label: nextItem,
            };
        }
    }).filter(Boolean);
}

/**
 * 根据数据库表，获取所有的列信息
 * @param dbUrl
 * @param tableNames
 * @returns {Promise<unknown extends (object & {then(onfulfilled: infer F): any}) ? (F extends ((value: infer V, ...args: any) => any) ? Awaited<V> : never) : unknown extends ReadonlyArray<infer InnerArr> ? FlatArray<InnerArr, [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][0]> : (unknown extends (object & {then(onfulfilled: infer F): any}) ? (F extends ((value: infer V, ...args: any) => any) ? Awaited<V> : never) : unknown)>}
 */
async function getTablesColumns(dbUrl, tableNames) {
    const _db = await db(dbUrl);

    const res = await Promise.all(tableNames.map(async tableName => {
        const columns = await _db.getColumns(tableName);

        return columns.map(item => ({ ...item, tableName }));
    }));

    return res.flat().map(item => {
        const { name } = item;

        const info = {
            ...item,
            dbName: name,
            name: getModuleNames(name).moduleName,
        };

        info.options = getOptions(info);

        return {
            ...info,
            chinese: getChinese(info),
            formType: getFormType(info),
            validation: getValidation(info),
        };
    }).filter(Boolean);
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
    getValidation,
    getChinese,
    getFormType,
    getOptions,
    getTablesColumns,
};
