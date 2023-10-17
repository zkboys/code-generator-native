const Router = require('koa-router');
const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const NodeSQLParser = require('node-sql-parser');
const db = require('./db');
const {
    getLocalTemplates,
    getModuleNames,
    checkFilesExist,
    writeFile,
    getFilesContent,
    downloadTemplates,
    stringFormat,
    getLastVersion,
    updateVersion,
    autoFill,
    getTablesColumns,
    getProjectNames,
    splitComment,
    getOptions,
    API_JAVA_TYPE,
} = require('./util');
const generalBasicOCR = require('./util/ocr');
const {getApiOptions, getApiFields, getApiDocs, getApis, getAllFields} = require('./util/swagger');

const {DB_TYPES} = require('./db/MySql');
const packageJson = require('./package.json');

const apiRouter = new Router({prefix: '/api'});
module.exports = apiRouter
    // 结果处理
    .use(async (ctx, next) => {
        try {
            const data = await next();
            if (ctx.body === undefined) ctx.body = {code: 0, message: 'ok', data};
        } catch (error) {
            console.error(error);
            ctx.body = {code: 9999, message: error.message, error, data: null};
        }
    })
    // 获取数据库表
    .get('/db/tables', async ctx => {
        const {dbUrl} = ctx.query;
        assert(dbUrl, '数据库地址不能为空！');
        return db(dbUrl).getTables();
    })
    // 获取数据库表字段
    .post('/db/tables/columns', async ctx => {
        const {dbUrl, tableNames} = ctx.request.body;

        assert(tableNames, '数据库表不能为空');
        assert(dbUrl, '数据库地址不能为空！');

        const columns = await getTablesColumns(dbUrl, tableNames);
        // 去重
        return columns.reduce((prev, item) => {
            if (!prev.some(it => it.name === item.name)) {
                prev.push(item);
            }
            return prev;
        }, []);
    })
    // 解析sql语句，获取数据库表字段
    .post('/db/sql', async ctx => {
        let {dbUrl, sql} = ctx.request.body;

        sql = sql.replace(/[$#]+[\s]*({)?{[\s\w]*}(?!})/g, '?');

        const parser = new NodeSQLParser.Parser();

        let ast = parser.astify(sql);

        if (Array.isArray(ast)) ast = ast[0];

        const {columns, from} = ast;

        const tableNames = from.map(item => item.table);
        const allColumns = await getTablesColumns(dbUrl, tableNames);

        if (columns === '*') return allColumns.reduce((prev, item) => {
            if (!prev.some(it => it.name === item.name)) {
                prev.push(item);
            }
            return prev;
        }, []);

        let cols = [];
        columns.forEach(item => {
            const {expr} = item;
            let {table, column} = expr;
            column = column.toLowerCase();

            if (!table) {
                const col = allColumns.find(it => it.name.toLowerCase() === column);
                if (!col) return;

                if (!cols.some(it => it.name === col.name)) {
                    cols.push(col);
                }
                return;
            }

            let tableName = from.find(it => it.table === table || it.as === table).table;

            tableName = tableName.toLowerCase();

            if (column === '*') {
                allColumns.forEach(col => {
                    if (col.tableName.toLowerCase() === tableName && !cols.some(it => it.name === col.name)) {
                        cols.push(col);
                    }
                });
                return;
            }
            const col = allColumns.find(it => (it.name.toLowerCase() === column || it.dbName.toLowerCase() === column) && it.tableName.toLowerCase() === tableName);
            if (!col) return;
            if (!cols.some(it => it.name === col.name)) {
                cols.push(col);
            }
        });

        return cols;
    })
    // 获取数据库类型 options
    .get('/db/types', async ctx => {
        const {dbUrl} = ctx.query;

        if (!dbUrl) return DB_TYPES;

        return db(dbUrl).getTypeOptions();
    })
    // 获取swagger apis
    .get('/swagger/apis', async (ctx) => {
        const {swaggerUrl} = ctx.query;

        return await getApiOptions(swaggerUrl);
    })
    // 获取swagger api 中的字段
    .post('/swagger/apis', async (ctx) => {
        const {swaggerUrl, apiKeys} = ctx.request.body;

        const docs = await getApiDocs(swaggerUrl);
        const apis = getApis(docs);
        const {definitions} = docs;

        const res = apiKeys.map(key => {
            const api = apis.find(item => item.key === key);
            return getAllFields(api, definitions)
        })

        return res.flat(1).reduce((prev, curr) => {
            const {name, type, description: comment} = curr;

            if (prev.some(item => item.name === name)) return prev;

            const chinese = splitComment(comment)[0];
            const options = getOptions({comment})

            return [
                ...prev,
                {
                    id: name,
                    chinese,
                    options,
                    dataType: API_JAVA_TYPE[type],
                    ...curr,
                },
            ]
        }, [])
    })
    // 获取所有模版
    .get('/templates', async () => {
        const res = await getLocalTemplates();
        return res.filter(item => !item.shortName.startsWith('_'));
    })
    // 获取模版详情
    .get('/templates/:id', async ctx => {
        const {id} = ctx.params;
        assert(id, '模版id不能为空！');

        const templates = await getLocalTemplates();
        const template = templates.find(item => item.id === id);
        assert(template, '模版不存在！');

        return template;
    })
    // 下载模板
    .get('/templates/local/download', async () => await downloadTemplates())
    // 获取模块名
    .get('/moduleNames/:name', async ctx => {
        const {name} = ctx.params;
        assert(name, 'name参数不能为空！');

        return getModuleNames(name);
    })
    // 批量查询文件是否存在
    .post('/generate/files/exist', async ctx => {
        const {files, ...others} = ctx.request.body;
        // 通过是否生成了实际文件，判断文件是否真的重复
        const filesContents = await getFilesContent({files, ...others});

        const filePaths = files
            .filter(item => !item.force)
            .map(item => item.targetPath)
            .filter(item => filesContents.some(it => it.targetPath === item));

        return await checkFilesExist(filePaths);
    })
    // 单个查询文件是否存在
    .post('/generate/file/exist', async ctx => {
        const {targetPath} = ctx.request.body;
        const res = await checkFilesExist([targetPath]);
        return !!(res && res.length);
    })
    // 生成文件
    .post('/generate/files', async ctx => {
        const {files, ...others} = ctx.request.body;
        const nextFiles = files.filter(item => item.rewrite !== false);

        return await writeFile({
            ...others,
            files: nextFiles,
        });
    })
    // 批量生成
    .post('/generate/files/batch', async ctx => {
        const {files, tables, dbUrl} = ctx.request.body;
        const result = [];
        const templates = getLocalTemplates();
        const allTemplates = templates.map(item => [item, ...item.extraFiles]).flat();

        for (let tableName of tables) {
            const moduleNames = getModuleNames(tableName);
            const moduleName = moduleNames['module-name'];
            const data = {
                ...moduleNames,
                ...getProjectNames(),
            }
            const nextFiles = files.map(file => {
                const targetPath = stringFormat(file.targetPath, data);
                return {
                    ...file,
                    targetPath,
                };
            });

            const tableFields = await db(dbUrl).getColumns(tableName);
            const fields = tableFields.map(item => {
                const fieldOptions = nextFiles.reduce((prev, curr) => {
                    const {templateId, parentTemplateId} = curr;
                    const fieldOptions = allTemplates.find(item => item.id === (parentTemplateId || templateId))?.fieldOptions || [];
                    return {
                        ...prev,
                        [parentTemplateId || templateId]: [...fieldOptions],
                    };
                }, {});
                return {
                    ...item,
                    fieldOptions,
                };
            });
            const _fields = await autoFill(fields);
            const res = await writeFile({files: nextFiles, moduleName, fields: _fields});
            result.push(res);
        }
        return result.flat();
    })
    // 代码预览
    .post('/generate/preview', async ctx => await getFilesContent(ctx.request.body))
    // 获取软件最新版本
    .get('/version', async () => {
        const lastVersion = await getLastVersion();
        const currentVersion = packageJson.version;
        return {
            lastVersion,
            currentVersion,
        };
    })
    // 更新
    .put('/update', async () => await updateVersion())
    // 保存模版
    .put('/template', async (ctx) => {
        const {content, filePath} = ctx.request.body;
        await fs.writeFileSync(filePath, content, 'UTF-8');
        return true;
    })
    // 获取帮助文档
    .get('/help', async () => await fs.readFile(path.join(__dirname, 'README.md'), 'UTF-8'))
    // 自动填充
    .post('/autoFill', async ctx => {
        const {fields, justNames} = ctx.request.body;

        return await autoFill(fields, justNames);
    })
    // 获取项目名称
    .get('/projectNames', () => getProjectNames())
    .post('/ocr', async ctx => {
        const {imageBase64} = ctx.request.body;
        return await generalBasicOCR(imageBase64);
    })
;
