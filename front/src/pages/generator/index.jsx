import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, notification, Modal, Input, Select, Row, Col, Radio, Space, Checkbox, Tabs } from 'antd';
import { CodeOutlined, CopyOutlined, DownloadOutlined, FileDoneOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useDebounceFn } from 'ahooks';
import { v4 as uuid } from 'uuid';
import { storage, isMac } from 'src/commons';
import { confirm, PageContent } from 'src/components';
import { ajax } from 'src/hocs';
import FieldTable from './FieldTable';
import Feedback from './Feedback';
import FileList from './FileList';
import s from './style.module.less';
import PreviewModal from 'src/pages/generator/PreviewModal';
import HelpModal from 'src/pages/generator/HelpModal';
import BatchModal from 'src/pages/generator/BatchModal';

const { TabPane } = Tabs;

export default ajax()(function Generator(props) {
    const [tableOptions, setTableOptions] = useState([]);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [moduleNames, setModuleNames] = useState({});
    const [loading, setLoading] = useState();
    const [loadingTip, setLoadingTip] = useState(undefined);
    const [checkExist, setCheckExist] = useState({});
    const [dataSource, setDataSource] = useState([]);
    const [filesVisible, setFilesVisible] = useState(true);
    const [activeKey, setActiveKey] = useState('files');
    const [helpVisible, setHelpVisible] = useState(false);
    const [batchVisible, setBatchVisible] = useState(false);
    const [dbInfoVisible, setDbInfoVisible] = useState(false);
    const [previewParams, setPreviewParams] = useState(null);
    const [dbTypeOptions, setDbTypeOptions] = useState([]);
    const [files, setFiles] = useState([]);
    const [form] = Form.useForm();

    // 发请求获取模块名
    const fetchModuleNames = useCallback(async (name) => {
        return await props.ajax.get(`/moduleNames/${name}`);
    }, [props.ajax]);

    // 发请求，获取模版
    const fetchTemplates = useCallback(async (options = {}) => {
        const templates = await props.ajax.get('/templates', null, { ...options });

        const templateOptions = templates.map(item => ({ record: item, value: item.id, label: item.name }));
        setTemplateOptions(templateOptions);
        return templateOptions;
    }, [props.ajax]);

    // 生成文件事件
    // 生成代码、代码预览
    const handleGenerate = useCallback(async (preview = false) => {
        try {
            if (!dataSource?.length) return Modal.info({ title: '温馨提示', content: '表格的字段配置不能为空！' });

            const values = await form.validateFields();

            if (dataSource.some(item => !item.name || !item.chinese)) return Modal.info({ title: '温馨提示', content: '表格的字段配置有必填项未填写！' });
            const { files, moduleName } = values;
            const params = {
                moduleName,
                files,
                config: dataSource,
            };

            if (preview) {
                setPreviewParams(params);
            } else {
                // 检测文件是否存在
                const res = await props.ajax.post('/generate/files/exist', params, { setLoading }) || [];

                // 用户选择是否覆盖
                for (let targetPath of res) {
                    const file = files.find(it => it.targetPath === targetPath);

                    try {
                        await confirm({
                            width: 600,
                            title: '文件已存在',
                            content: targetPath,
                            okText: '覆盖',
                            okButtonProps: {
                                danger: true,
                            },
                        });
                        file.rewrite = true;
                    } catch (e) {
                        file.rewrite = false;
                    }
                }

                const paths = await props.ajax.post('/generate/files', params, { setLoading });
                if (!paths?.length) return Modal.info({ title: '温馨提示', content: '未生成任何文件！' });

                Modal.success({
                    width: 600,
                    title: '生成文件如下',
                    content: (
                        <div style={{ maxHeight: 200, overflow: 'auto' }}>
                            {paths.map(p => <div key={p}>{p}</div>)}
                        </div>
                    ),
                });

                setCheckExist({});
            }
        } catch (e) {
            if (e?.errorFields?.length) {
                return Modal.info({ title: '温馨提示', content: '表单填写有误，请检查后再提交！' });
            }
            console.error(e);
        }
    }, [form, dataSource, props.ajax]);

    // 数据库连接改变事件
    const { run: handleDbUrlChange } = useDebounceFn(async (e) => {
        form.setFieldsValue({ tableNames: undefined, moduleName: undefined });
        let tableOptions;
        let dbTypeOptions;
        try {
            const dbUrl = e.target.value;
            const tables = await props.ajax.get('/db/tables', { dbUrl });
            tableOptions = tables.map(item => ({
                value: item.name,
                label: `${item.name}${item.comment ? `（${item.comment}）` : ''}`,
                comment: item.comment,
            }));

            dbTypeOptions = await props.ajax.get('/db/types', { dbUrl });
        } catch (e) {
            tableOptions = [];
            dbTypeOptions = [];
        }

        setTableOptions(tableOptions);
        setDbTypeOptions(dbTypeOptions);
    }, { wait: 300 });

    // 设置模块名
    const handleModuleName = useCallback(async (tableName) => {
        let moduleNames;
        let moduleName;

        if (tableName) {
            moduleNames = await fetchModuleNames(tableName);
            moduleName = moduleNames['module-name'];
        }

        // moduleName并没有改变，不设置
        if (moduleName === form.getFieldValue('moduleName')) return;

        setModuleNames(moduleNames);
        form.setFieldsValue({ moduleName });
    }, [fetchModuleNames, form]);

    // 设置dataSource
    const handleDataSourceChange = useCallback(dataSource => {
        const files = form.getFieldValue('files');
        let changed;
        files.forEach(col => {
            const { templateId } = col;
            const template = templateOptions.find(item => item.value === templateId)?.record;
            const options = template?.defaultFieldOptions || template?.fieldOptions || [];

            dataSource.forEach(item => {
                if (!item.fileOptions) item.fileOptions = {};

                if (!item.fileOptions[templateId]) {
                    item.fileOptions[templateId] = [...options];
                    changed = true;
                }
            });
        });

        if (changed) {
            setDataSource([...dataSource]);
        }

        setDataSource(dataSource);
    }, [templateOptions, form]);

    // 数据库表改变事件
    const handleTableNameChange = useCallback(async (tableNames) => {
        await handleModuleName(tableNames?.[0]);

        const dbUrl = form.getFieldValue('dbUrl');

        // 查询表格数据
        if (!dbUrl || !tableNames?.length) return handleDataSourceChange([]);

        const dataSource = await props.ajax.post('/db/tables/columns', { dbUrl, tableNames }, { setLoading });
        handleDataSourceChange(dataSource);
    }, [form, handleModuleName, props.ajax, handleDataSourceChange]);

    // 模块名改变事件
    const { run: handleModuleNameChange } = useDebounceFn(async (e) => {
        const moduleName = e.target.value;
        if (!moduleName) return;
        const moduleNames = await fetchModuleNames(moduleName);
        setModuleNames(moduleNames);
    }, { wait: 300 });

    // 文件改变 添加、删除、修改模版、地址、选项
    const handleFilesChange = useCallback(() => {
        setTimeout(() => {
            const files = form.getFieldValue('files');
            setFiles(files);
        });
    }, [form]);

    // 添加模版
    const handleFilesAdd = useCallback(() => {
        handleFilesChange();
        setTimeout(() => {
            handleDataSourceChange(dataSource);
        });
    }, [handleFilesChange, dataSource, handleDataSourceChange]);

    // 模版改变事件
    const handleTemplateChange = useCallback((name, templateId) => {
        const record = templateOptions.find(item => item.value === templateId).record;
        const { targetPath, options } = record;

        const files = form.getFieldValue('files');
        const file = form.getFieldValue(['files', name]);
        file.targetPath = targetPath;
        file.options = [...options];
        files[name] = file;

        form.setFieldsValue({ files: [...files] });
        handleFilesChange();
    }, [templateOptions, form, handleFilesChange]);

    // 表单改变事件
    const { run: handleFormChange } = useDebounceFn(() => {
        const { dbUrl, files } = form.getFieldsValue();
        storage.local.setItem('files', files);
        storage.local.setItem('dbUrl', dbUrl);
    }, { wait: 500 });

    // 更新软件版本
    const handleUpdate = useCallback(async () => {
        try {
            setLoadingTip('更新中，请稍成功后请重启服务！');
            await props.ajax.put('/update', null, { errorTip: false, setLoading });
            Modal.info({
                title: '温馨提示',
                content: '更新成功！请重启服务，使用最新版本！',
            });
        } catch (e) {
            Modal.error({
                title: '温馨提示',
                content: '更新失败，请手动更新：npm i @ra-lib/gen -g',
            });
        } finally {
            setLoadingTip(undefined);
        }
    }, [props.ajax]);

    // 解析sql
    const handleParseSql = useCallback(async () => {
        const sql = form.getFieldValue('sql');
        const dbUrl = form.getFieldValue('dbUrl');
        if (!sql?.trim()) {
            return Modal.info({
                title: '温馨提示',
                content: 'sql语句不能为空！',
            });
        }
        if (!dbUrl?.trim()) {
            return Modal.info({
                title: '温馨提示',
                content: '数据库连接不能为空！',
            });
        }
        if (!sql) return;
        const dataSource = await props.ajax.post('/db/sql', { dbUrl, sql }, { setLoading });
        handleDataSourceChange(dataSource || []);

        await handleModuleName(dataSource?.[0].tableName);
    }, [form, handleModuleName, props.ajax, handleDataSourceChange]);

    // sql语句输入框，command 或 ctrl + enter 解析
    const handleSqlPressEnter = useCallback(async (e) => {
        const { ctrlKey, metaKey } = e;
        if (!(ctrlKey || metaKey)) return;

        await handleParseSql();
    }, [handleParseSql]);

    // 获取新加一行初始化数据
    const getNewRecord = useCallback((fields = {}) => {
        const isItems = activeKey === 'items';
        let name;
        if (isItems) {
            name = dataSource.length + 1;
            name = name < 10 ? `0${name}` : `name`;
        }
        return {
            id: uuid(),
            // comment: `新增列${length + 1}`,
            // chinese: `新增列${length + 1}`,
            // name: `field${length + 1}`,
            name,
            type: 'VARCHAR',
            formType: 'input',
            dataType: 'String',
            isNullable: true,
            __isNew: true,
            __isItems: isItems,
            ...fields,
        };

    }, [activeKey, dataSource.length]);

    // 表格新增一行事件
    const handleAdd = useCallback((append = false) => {
        const newRecord = getNewRecord();

        append ? dataSource.push(newRecord) : dataSource.unshift(newRecord);
        handleDataSourceChange([...dataSource]);
    }, [dataSource, getNewRecord, handleDataSourceChange]);

    // 更新本地模版
    const handleUpdateLocalTemplates = useCallback(async () => {
        await confirm('本地同名模版将被覆盖，是否继续？');
        await props.ajax.get('/templates/local/download', null, { successTip: '更新成功！' });

        // 等待本地服务器重启
        const si = setInterval(async () => {
            await fetchTemplates({ errorTip: false });
            clearInterval(si);
        }, 1000);
    }, [props.ajax, fetchTemplates]);

    // 初始化时，加载模板
    useEffect(() => {
        (async () => {
            await fetchTemplates();

            // 默认展示全部模板
            // const files = templateOptions.map(item => ({
            //     templateId: item.record?.id,
            //     targetPath: item.record?.targetPath,
            //     options: [...(item.record?.options || [])],
            // }));
            // form.setFieldsValue({ files });
        })();
    }, [fetchTemplates]);

    // 从本地同步数据库链接
    useEffect(() => {
        (async () => {
            const dbUrl = storage.local.getItem('dbUrl');
            if (!dbUrl) return;

            form.setFieldsValue({ dbUrl });
            await handleDbUrlChange({ target: { value: dbUrl } });
        })();
    }, [form, handleDbUrlChange]);

    // 从本地同步files
    useEffect(() => {
        if (!templateOptions?.length) return;

        let files = storage.local.getItem('files');
        if (!files) {
            const record = templateOptions[0].record;
            files = [{
                templateId: record.id,
                targetPath: record.targetPath,
                options: [...record.options],
            }];
        }

        const nextFiles = files.map(item => {
            const record = templateOptions.find(it => it.value === item.templateId)?.record;
            if (!record) return null;

            return {
                ...item,
                ...record,
                options: [...(record.defaultOptions || record.options)],
            };
        }).filter(Boolean);
        if (!nextFiles?.length) return;

        form.setFieldsValue({ files: nextFiles });

        handleFilesChange();
    }, [form, templateOptions, handleFilesChange]);

    // 检查是否有新版本
    useEffect(() => {
        (async () => {
            const res = await props.ajax.get('/version', null, { errorTip: false });
            const { lastVersion, currentVersion } = res;
            if (currentVersion !== lastVersion) {
                notification.success({
                    message: '有新版本！',
                    description: (
                        <div>
                            <span style={{ color: 'red' }}>{currentVersion}</span>
                            <span style={{ margin: '0 8px' }}>-></span>
                            <span style={{ color: 'green' }}>{lastVersion}</span>
                        </div>
                    ),
                    btn: (
                        <Button
                            type="primary"
                            onClick={async () => {
                                notification.destroy();
                                await handleUpdate();
                            }}
                        >
                            更新
                        </Button>),
                    duration: 10,
                });
            }
        })();
    }, [props.ajax, handleUpdate]);

    return (
        <PageContent className={s.root} loading={loading} loadingTip={loadingTip}>
            <Form
                className={s.query}
                form={form}
                layout="inline"
                initialValues={{ files: [{}], searchType: 'tables' }}
                onValuesChange={handleFormChange}
            >
                <Row style={{ width: '100%', paddingRight: 50 }}>
                    <Col flex="0 0 600px">
                        <Form.Item
                            align="right"
                            label={<div style={{ paddingLeft: 28 }}>数据库连接</div>}
                            name="dbUrl"
                        >
                            <Input
                                placeholder="mysql://username:password@host:port/database"
                                onChange={handleDbUrlChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col flex="0 0 112px">
                        <Form.Item name="searchType">
                            <Radio.Group
                                options={[
                                    { value: 'sql', label: 'sql' },
                                    { value: 'tables', label: '表' },
                                ]}
                                optionType="button"
                                buttonStyle="solid"
                            />
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item
                            noStyle
                            shouldUpdate={(p, c) => p.searchType !== c.searchType}
                        >
                            {({ getFieldValue }) => {
                                const searchType = getFieldValue('searchType');
                                if (searchType === 'tables') {
                                    return (
                                        <Form.Item name="tableNames">
                                            <Select
                                                mode="multiple"
                                                showSearch
                                                placeholder="请选择数据库表"
                                                onChange={handleTableNameChange}
                                                options={tableOptions}
                                            />
                                        </Form.Item>
                                    );
                                }

                                return (
                                    <div className={s.sqlWrapper}>
                                        <div className={s.sqlAreaWrapper}>
                                            <Form.Item name="sql">
                                                <Input.TextArea
                                                    style={{ height: 78 }}
                                                    className={s.sqlArea}
                                                    placeholder={[
                                                        `支持多表关联，可以输入 ?、\${xx}、#{xx}等占位符；`,
                                                        '多表重复字段将会被去重；',
                                                        `解析快捷键：${isMac ? '⌘' : 'ctrl'} + enter。`,
                                                    ].join('\n')}
                                                    onPressEnter={handleSqlPressEnter}
                                                />
                                            </Form.Item>
                                        </div>
                                        <Button
                                            type="primary"
                                            className={s.sqlButton}
                                            onClick={handleParseSql}
                                        >
                                            解析
                                        </Button>
                                    </div>
                                );
                            }}
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{ marginTop: 8 }}>
                    <Form.Item
                        labelCol={{ flex: '0 0 112px' }}
                        label="模块名"
                        name="moduleName"
                        rules={[{ required: true, message: '请输入模块名！' }]}
                    >
                        <Input
                            style={{ width: 472 }}
                            placeholder="比如：user-center"
                            onChange={handleModuleNameChange}
                        />
                    </Form.Item>
                </div>
                <div style={{ width: '100%', marginTop: 4 }}>
                    <FileList
                        form={form}
                        templateOptions={templateOptions}
                        filesVisible={filesVisible}
                        moduleNames={moduleNames}
                        checkExist={checkExist}
                        onTemplateChange={handleTemplateChange}
                        onTargetPathChange={handleFilesChange}
                        onOptionsChange={handleFilesChange}
                        onAdd={handleFilesAdd}
                        onRemove={handleFilesChange}
                    />
                </div>
                <Tabs
                    style={{ width: '100%', userSelect: 'none' }}
                    tabBarStyle={{ marginBottom: 0 }}
                    tabBarExtraContent={{
                        left: (
                            <Space style={{ marginRight: 16 }}>
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => handleAdd()}
                                >
                                    添加一行
                                </Button>
                                <Button
                                    icon={<CodeOutlined />}
                                    onClick={() => handleGenerate(true)}
                                >
                                    代码预览
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    icon={<FileDoneOutlined />}
                                    onClick={() => handleGenerate()}
                                >
                                    生成文件
                                </Button>
                                <Checkbox
                                    checked={filesVisible}
                                    onChange={e => setFilesVisible(e.target.checked)}
                                >
                                    展开文件列表
                                </Checkbox>
                                <Checkbox
                                    checked={dbInfoVisible}
                                    onChange={e => setDbInfoVisible(e.target.checked)}
                                >
                                    显示数据库信息
                                </Checkbox>
                            </Space>
                        ),
                        right: (
                            <Space>
                                <Button
                                    icon={<CopyOutlined />}
                                    disabled={!tableOptions?.length}
                                    onClick={() => setBatchVisible(true)}
                                >
                                    批量生成
                                </Button>
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={handleUpdateLocalTemplates}
                                >
                                    更新本地模版
                                </Button>
                                <Button
                                    icon={<QuestionCircleOutlined />}
                                    onClick={() => setHelpVisible(true)}
                                >
                                    帮助
                                </Button>
                            </Space>
                        ),
                    }}
                    activeKey={activeKey}
                    onChange={setActiveKey}
                >
                    <TabPane key="files" tab="文件编辑" />
                    <TabPane key="items" tab="选项编辑" />
                </Tabs>
                <FieldTable
                    form={form}
                    files={files}
                    filesVisible={filesVisible}
                    activeKey={activeKey}
                    dbInfoVisible={dbInfoVisible}
                    dataSource={dataSource}
                    templateOptions={templateOptions}
                    dbTypeOptions={dbTypeOptions}
                    onDataSourceChange={handleDataSourceChange}
                    onAdd={handleAdd}
                    getNewRecord={getNewRecord}
                />
                <PreviewModal
                    visible={!!previewParams}
                    params={previewParams}
                    onOk={() => setPreviewParams(null)}
                    onCancel={() => setPreviewParams(null)}
                />
                <HelpModal
                    visible={helpVisible}
                    onCancel={() => setHelpVisible(false)}
                />
                <BatchModal
                    visible={batchVisible}
                    onCancel={() => setBatchVisible(false)}
                    form={form}
                    tableOptions={tableOptions}
                />
                <Feedback />
            </Form>
        </PageContent>
    );
});
