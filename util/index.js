const path = require('path');
const fs = require('fs-extra');
const assert = require('assert');
const {exec} = require('child_process');
const staticCache = require('koa-static-cache');
const inflection = require('inflection');
const {internalIpV4} = require('./ip');
const moment = require('moment');

const openBrowser = require('./openBrowser');
const choosePort = require('./choosePort');
const config = require('../config');
const packageJson = require('../package.json');
const {
    Name: NameModel,
    FormType: FormTypeModel,
    Validation: ValidationModel,
    UseLog: UseLogModel,
    DbType: DbTypeModel,
} = require('../database');
const translate = require('./translate');
const db = require('../db');

const simpleGit = require('simple-git');
const git = simpleGit();


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

const API_JAVA_TYPE = {
    string: 'String',
    integer: 'init',
    number: 'init',
    boolean: 'boolean',
}

const JAVA_PACKAGE_MAP = {
    BigDecimal: 'import java.math.BigDecimal',
    Date: 'import java.util.Date',
    LocalDateTime: 'import java.time.LocalDateTime',
};

const INSERT_ANNOTATION = '此注释用于标记代码生成器插入代码位置，请勿删除！';

function getProjectNames() {
    return config.projectNames;
}

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
        delete require.cache[require.resolve(filePath)];
        const template = require(filePath);
        const templateContent = fs.readFileSync(filePath, 'UTF-8');

        const extname = path.extname(filePath);
        const basename = path.basename(filePath);
        if (basename.startsWith('_')) return null;

        const fileName = path.relative(templatesDir, filePath).replace(extname, '');
        const id = fileName.replace(/\W/g, '_');
        const shortName = template.name || basename.replace(extname, '');
        const name = template.name || fileName;
        const extraFiles = (template.extraFiles || []).map((it, index) => {
            const {targetPath, filePath} = it;
            const templateContent = filePath ? fs.readFileSync(filePath, 'UTF-8') : undefined;
            const name = it.name || targetPath.split('/').pop();

            // templateContent 怎么获取？？？

            return {
                ...it,
                id: `${id}__${index}`,
                name,
                targetPath,
                shortName: it.shortName || name,
                options: template.options || [],
                fieldOptions: template.fieldOptions || [],
                filePath,
                templateContent,
            };
        });
        return {
            ...template,
            id,
            name,
            shortName,
            extraFiles,
            options: template.options || [],
            fieldOptions: template.fieldOptions || [],
            filePath,
            templateContent,
        };
    }).filter(Boolean);
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
async function getFilesContent(options) {
    const {files, moduleName, fields, moduleChineseName, ...others} = options;
    // 保存用户字段配置 name chinese
    // 不是用await，防止阻塞
    saveFields((fields || []).filter(item => !item.__isItems)).then();

    const templates = getLocalTemplates();
    const moduleNames = getModuleNames(moduleName);
    moduleNames.chineseName = moduleChineseName;
    const allTemplates = templates.map(item => [item, ...item.extraFiles]).flat();

    const result = await Promise.all(files.map(async file => {
        const {templateId, parentTemplateId, targetPath} = file;

        let template = allTemplates.find(item => item.id === templateId);

        assert(template, `${templateId} 模版不存在!`);

        const fis = fields.map(item => {
            const fieldOptions = item.fieldOptions && item.fieldOptions[parentTemplateId || templateId] || [];
            const __names = getModuleNames(item.name);
            return {
                ...item,
                validation: item.validation || [],
                __names,
                fieldOptions,
            };
        });
        const NULL_LINE = '_____NULL_LINE_____';

        const gitUser = await getGitUser();

        const author = gitUser ? `${gitUser?.userName} <${gitUser?.userEmail}>` : '@ra-lib/gen';

        // 传递给模版的数据
        const cfg = {
            ...others,
            NULL_LINE,
            file: file,
            files,
            moduleNames,
            fields: fis,
            ...getProjectNames(),
            javaPackages: Array.from(new Set(fis.map(item => {
                const {dataType} = item;
                const p = JAVA_PACKAGE_MAP[dataType];
                if (!p) return p;
                return `${p};`
            }).filter(Boolean))).join('\n'),
            ignoreFields: [
                'id',
                'updatedAt',
                'createdAt',
                'isDeleted',
                'creater',
                'creator',
                'updater',
                'createTime',
                'updateTime',
                'createDate',
                'updateDate',
            ],
            moment,
            gitUser,
            author,
        };

        let content = template.getContent(cfg);

        if (content === false) return null;

        content = content.split('\n')
            .filter(item => !item.includes(NULL_LINE))
            .join('\n');

        // 插入式
        if (template.getFullContent) {
            content = content.trimRight();
            const filePath = path.join(config.nativeRoot, targetPath);

            const targetExist = await fs.exists(filePath);

            let fullContent;
            if (targetExist) {
                fullContent = await fs.readFile(filePath, 'UTF-8');
            } else {
                fullContent = template.getFullContent(cfg);
            }

            // 包含了就不再次插入了
            if (!fullContent.includes(content)) {
                const contents = fullContent.split('\n');
                const insertIndex = contents.findIndex(item => item.includes(INSERT_ANNOTATION));
                contents.splice(insertIndex, 0, content);

                content = contents.join('\n');
            } else {
                content = fullContent;
            }
        } else {
            content = content.trim();
        }

        return {
            ...template,
            ...file,
            content,
        };
    }));

    return result.filter(Boolean);
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
            const content = await fs.readFile(filePath, 'UTF-8');
            if (!content.includes(INSERT_ANNOTATION)) {
                if (!result) result = [];
                result.push(fp);
            }
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
    const filesContents = await getFilesContent(options);
    const result = [];
    for (let file of filesContents) {
        const {targetPath, content} = file;

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
        origin: name,
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

/**
 * 获取生成器最新版本
 * @returns {Promise<unknown>}
 */
async function getLastVersion() {
    return await new Promise((resolve, reject) => {
        exec(`npm view ${packageJson.name} version --registry=https://registry.npmmirror.com`, (error, stdout) => {
            if (stdout) return resolve(stdout.trim());
            reject(Error('获取版本失败'));
        });
    });
}

/**
 * 生成器升级到最新版本
 * @returns {Promise<unknown>}
 */
async function updateVersion() {
    return await new Promise((resolve, reject) => {
        exec(`npm i ${packageJson.name} -g --registry=https://registry.npmmirror.com`, (error, stdout) => {
            if (stdout) {
                console.log(stdout.trim());
                console.log('更新成功，请重启服务使用最新版本！');
                return resolve(stdout.trim());
            }
            reject(Error('更新版本失败'));
        });
    });
}

/**
 * 从词库、或翻译获取对应的英文
 * @param fields
 * @returns {Promise<unknown[]|*[]>}
 */
async function getNames(fields) {
    const items = fields.filter(item => item.chinese && !item.name)
        .map(item => {
            const chinese = splitComment(item.chinese)[0];
            return {
                ...item,
                chinese,
            };
        });

    if (!items.length) return [];

    const {authenticated} = require('../database');

    const results = authenticated ? await NameModel.findAll({
        where: {chinese: items.map(item => item.chinese)},
        order: [['weight', 'desc'], ['updatedAt', 'desc']],
    }) : [];

    const result = await Promise.all(items.map(async item => {
        const record = results.find(it => it.chinese === item.chinese);
        if (record) return {...item, name: record.name};

        // 未查询出结果，调用翻译接口
        const params = {q: item.chinese, from: 'zh', to: 'en'};
        const res = await translate(params);

        if (!res) return;
        // 结果转驼峰命名
        const name = getModuleNames(res.replace(/\s/g, '_')).moduleName;
        return {...item, name};
    }));

    return result.filter(Boolean);
}

/**
 * 从词库、或翻译获取对应的中文
 * @param fields
 * @returns {Promise<unknown[]|*[]>}
 */
async function getChinese(fields) {
    const items = fields.filter(item => item.name && !item.chinese);

    if (!items.length) return [];

    const {authenticated} = require('../database');

    const results = authenticated ? await NameModel.findAll({
        where: {name: items.map(item => item.name)},
        order: [['weight', 'desc'], ['updatedAt', 'desc']],
    }) : [];

    const result = await Promise.all(items.map(async item => {
        const record = results.find(it => it.name === item.name);
        if (record) return {...item, chinese: record.chinese};

        // 转成自然语言，翻译好识别
        const q = getModuleNames(item.name)['module name'];

        const params = {q, from: 'en', to: 'zh'};
        const res = await translate(params);

        if (!res) return;

        return {...item, chinese: res};
    }));

    return result.filter(Boolean);
}

/**
 * 将中英文配置保存到词库中
 * @param fields
 * @returns {Promise<void>}
 */
async function saveFields(fields) {
    const {authenticated} = require('../database');
    if (!authenticated) return;

    for (let item of fields) {
        const {name, chinese, formType, type, validation} = item;
        // 保存中英文
        if (name && chinese) {
            const result = await NameModel.findOne({where: {name, chinese}});
            if (result) {
                await result.update({weight: result.weight + 1});
            } else {
                await NameModel.create({name, chinese, weight: 0});
            }
        }

        // 保存表单类型
        if (name && formType) {
            const result = await FormTypeModel.findOne({where: {name, formType}});
            if (result) {
                await result.update({weight: result.weight + 1});
            } else {
                await FormTypeModel.create({name, formType, weight: 0});
            }
        }
        // 保存数据库类型
        if (name && type) {
            const result = await DbTypeModel.findOne({where: {name, type}});
            if (result) {
                await result.update({weight: result.weight + 1});
            } else {
                await DbTypeModel.create({name, type, weight: 0});
            }
        }

        // 保存校验规则
        if (name && validation && validation.length) {
            const validationStr = validation.sort().join(',');
            const result = await ValidationModel.findOne({where: {name, validation: validationStr}});
            if (result) {
                await result.update({weight: result.weight + 1});
            } else {
                await ValidationModel.create({name, validation: validationStr, weight: 0});
            }
        }
    }
}

/**
 * 根据字段信息，获取校验规则
 * @param fields
 * @returns {Promise<unknown[]|*[]>}
 */
async function getValidation(fields) {
    const items = fields.filter(item => !item.validation || !item.validation.length);
    if (!items.length) return [];

    const {authenticated} = require('../database');

    const results = authenticated ? await ValidationModel.findAll({
        where: {name: items.map(item => item.name)},
        order: [['weight', 'desc'], ['updatedAt', 'desc']],
    }) : [];

    return Promise.all(items.map(async item => {
        const record = results.find(it => it.name === item.name);
        if (record) return {...item, validation: record.validation?.split(',')};

        let {isNullable = true, comment = '', chinese = '', name = ''} = item;
        comment = chinese || comment;

        const isXxx = (chinese, validator) => {
            if (comment.includes(chinese) || name.toLowerCase().includes(validator)) {
                return validator;
            }
        };

        const validation = Array.from(new Set([
            !isNullable && 'required',
            isXxx('手机号', 'mobile'),
            isXxx('电话', 'mobile'),
            isXxx('邮箱', 'email'),
            isXxx('ip地址', 'ip'),
            isXxx('IP地址', 'ip'),
            isXxx('座机号', 'landLine'),
            isXxx('身份证号', 'cardNumber'),
            isXxx('qq号', 'qq'),
            isXxx('QQ号', 'qq'),
            isXxx('端口号', 'port'),
        ].filter(Boolean)));
        return {...item, validation};
    }));
}

/**
 * 根据字段信息获取表单类型
 * @param fields
 * @returns {Promise<unknown[]>|*[]}
 */
async function getFormType(fields) {
    const items = fields.filter(item => !item.formType);
    if (!items.length) return [];

    const {authenticated} = require('../database');

    const results = authenticated ? await FormTypeModel.findAll({
        where: {name: items.map(item => item.name)},
        order: [['weight', 'desc'], ['updatedAt', 'desc']],
    }) : [];

    return Promise.all(items.map(async item => {
        // 比较确定，优先级较高的类型
        if (item.options && item.options.length) return {...item, formType: 'select'};

        const record = results.find(it => it.name === item.name);
        if (record) return {...item, formType: record.formType};

        let formType = TYPE_MAP[item.dataType] || 'input';

        return {...item, formType};
    }));
}

/**
 * 根据字段信息获取数据库类型
 * @param fields
 * @returns {Promise<unknown[]>|*[]}
 */
async function getDbType(fields) {
    const items = fields.filter(item => !item.type);
    if (!items.length) return [];

    const {authenticated} = require('../database');

    const results = authenticated ? await DbTypeModel.findAll({
        where: {name: items.map(item => item.name)},
        order: [['weight', 'desc'], ['updatedAt', 'desc']],
    }) : [];

    return Promise.all(items.map(async item => {
        const record = results.find(it => it.name === item.name);
        if (record) return {...item, type: record.type};

        const type = 'VARCHAR';

        return {...item, type};
    }));
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
function getChineseFromDb(info) {
    let {comment} = info;
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
    const {comment} = info;
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
 * @returns {Promise<{chinese: *, dbName, name}[]>}
 */
async function getTablesColumns(dbUrl, tableNames) {
    const _db = await db(dbUrl);

    const res = await Promise.all(tableNames.map(async tableName => {
        const columns = await _db.getColumns(tableName);

        return columns.map(item => ({...item, tableName}));
    }));

    return res.flat().map(item => {
        const {name} = item;

        const info = {
            ...item,
            dbName: name,
            name: getModuleNames(name).moduleName,
        };

        info.options = getOptions(info);

        return {
            ...info,
            chinese: getChineseFromDb(info),
        };
    }).filter(Boolean);
}

/**
 * 自动填充内容
 * @param fields
 * @param justNames 是否值补全名称 name 和 chinese
 * @returns {Promise<*>}
 */
async function autoFill(fields, justNames = false) {
    const _chinese = await getChinese(fields);
    const names = await getNames(fields);

    fields.forEach(item => {
        const {name, chinese} = item;
        if (!chinese) {
            item.chinese = _chinese.find(it => it.id === item.id)?.chinese;
        }
        if (!name) {
            item.name = names.find(it => it.id === item.id)?.name;
        }
    });

    if (justNames) return fields;

    const validations = await getValidation(fields);
    const formTypes = await getFormType(fields);

    const types = await getDbType(fields);

    fields.forEach(item => {
        const {validation, formType, type} = item;
        if (!validation || !validation.length) {
            item.validation = validations.find(it => it.id === item.id)?.validation;
        }

        if (!formType) {
            item.formType = formTypes.find(it => it.id === item.id)?.formType;
        }

        if (!type) {
            item.type = types.find(it => it.id === item.id)?.type;
        }
    });

    return fields;
}

/**
 * 保存使用记录
 * @returns {Promise<void>}
 */
async function saveUseLog() {
    const {authenticated} = require('../database');
    const ip = await internalIpV4();

    authenticated && await UseLogModel.create({ip});
}

/**
 * 获取git用户
 * @returns {Promise<{userEmail: *, userName: *}>}
 */
async function getGitUser() {
    try {
        const {value: userName} = await git.getConfig('user.name');
        const {value: userEmail} = await git.getConfig('user.email');
        return {
            userName,
            userEmail,
        }
    } catch (e) {
        return null;
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
    getTablesColumns,
    autoFill,
    saveUseLog,
    getProjectNames,
    getOptions,
    splitComment,
    getGitUser,
    API_JAVA_TYPE,
};
