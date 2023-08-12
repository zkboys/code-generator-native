import React, {useState, useEffect, useCallback} from 'react';
import {
    Form,
    Button,
    notification,
    Modal,
    Input,
    Select,
    Row,
    Col,
    Radio,
    Space,
    Checkbox,
    Tabs,
    TreeSelect
} from 'antd';
import {
    CodeOutlined,
    CopyOutlined,
    DownloadOutlined,
    FileDoneOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    FormOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import {useDebounceFn} from 'ahooks';
import {v4 as uuid} from 'uuid';
import {storage, isMac, stringFormat, getFiles} from 'src/commons';
import {confirm, PageContent} from 'src/components';
import {ajax} from 'src/hocs';
import FieldTable from './FieldTable';
import Feedback from './Feedback';
import FileList from './FileList';
import previewModal from 'src/pages/generator/previewModal';
import batchModal from 'src/pages/generator/batchModal';
import fastEditModal from './fastEditModal';
import helpModal from './helpModal';
import s from './style.module.less';

const {TabPane} = Tabs;

export default ajax(function Generator(props) {
    const [tableOptions, setTableOptions] = useState([]);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [moduleNames, setModuleNames] = useState({});
    const [loading, setLoading] = useState();
    const [loadingTip, setLoadingTip] = useState(undefined);
    const [checkExist, setCheckExist] = useState({});
    const [dataSource, setDataSource] = useState([]);
    const [activeKey, setActiveKey] = useState('files');
    const [filesVisible, setFilesVisible] = useState(true);
    const [dbInfoVisible, setDbInfoVisible] = useState(false);
    const [dbTypeOptions, setDbTypeOptions] = useState([]);
    const [files, setFiles] = useState([]);
    const [projectNames, setProjectNames] = useState({});
    const [apiOptions, setApiOptions] = useState([]);
    const [form] = Form.useForm();

    // 发请求获取模块名
    const fetchModuleNames = useCallback(async (name) => {
        return await props.ajax.get(`/moduleNames/${name}`);
    }, [props.ajax]);

    // 发请求，获取模版
    const fetchTemplates = useCallback(async (options = {}) => {
        const templates = await props.ajax.get('/templates', null, {...options});

        const templateOptions = templates.map(item => ({record: item, value: item.id, label: item.name}));
        setTemplateOptions(templateOptions);
        return templateOptions;
    }, [props.ajax]);

    // 生成文件事件 生成代码、代码预览
    const handleGenerate = useCallback(async (preview = false) => {
        try {
            let _dataSource = [...dataSource];
            const values = await form.validateFields();
            const {files, dataSource: ds, tableNames, ...others} = values;
            // if (!_dataSource?.length) return Modal.info({ title: '温馨提示', content: '表格的字段配置不能为空！' });
            if (!_dataSource?.length) _dataSource = [{
                id: uuid(),
                comment: '备注',
                chinese: '字段名',
                name: 'field',
                type: 'VARCHAR',
                formType: 'input',
                dataType: 'String',
                isNullable: true,
                __isNew: true,
                fieldOptions: files.map(item => item.templateId).reduce((prev, templateId) => {
                    const fieldOptions = templateOptions.find(it => it.value === templateId)?.record?.fieldOptions;
                    return {
                        ...prev,
                        [templateId]: fieldOptions,
                    };
                }, {}),
            }];

            if (_dataSource.some(item => !item.name || !item.chinese)) return Modal.info({
                title: '温馨提示',
                content: '表格的字段配置有必填项未填写！'
            });

            const nextFiles = getFiles({
                files,
                templateOptions,
                moduleNames,
                moduleChineseName: others.moduleChineseName || moduleNames.module_name,
                projectNames,
            });

            const tables = tableOptions.filter(item => tableNames.includes(item.value));

            const params = {
                ...others,
                tableNames,
                tables,
                files: nextFiles,
                fields: _dataSource,
            };

            if (preview) {
                previewModal({params, tableOptions});
            } else {
                // 检测文件是否存在
                const res = await props.ajax.post('/generate/files/exist', params, {setLoading}) || [];

                // 用户选择是否覆盖
                for (let targetPath of res) {
                    const file = nextFiles.find(it => it.targetPath === targetPath);

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

                const paths = await props.ajax.post('/generate/files', params, {setLoading});
                if (!paths?.length) return Modal.info({title: '温馨提示', content: '未生成任何文件！'});

                Modal.success({
                    width: 600,
                    title: '生成文件如下',
                    content: (
                        <div style={{maxHeight: 200, overflow: 'auto'}}>
                            {paths.map(p => <div key={p}>{p}</div>)}
                        </div>
                    ),
                });

                setCheckExist({});
            }
        } catch (e) {
            if (e?.errorFields?.length) {
                return Modal.info({title: '温馨提示', content: '表单填写有误，请检查后再提交！'});
            }
            console.error(e);
        }
    }, [dataSource, form, templateOptions, moduleNames, projectNames, tableOptions, props.ajax]);

    // 数据库连接改变事件
    const {run: handleDbUrlChange} = useDebounceFn(async (e) => {
        form.setFieldsValue({tableNames: undefined, apis: undefined, moduleName: undefined});
        const dbUrl = e.target.value;

        // swagger 链接
        if(dbUrl?.trim()?.startsWith('http')) {
            try {
                const apiOptions = await props.ajax.get('/swagger/apis', {swaggerUrl: dbUrl});
                setApiOptions(apiOptions);
            }catch (e) {
                setApiOptions([]);
            }
            return ;
        }

        // 数据库链接

        let tableOptions;
        let dbTypeOptions;
        try {
            const dbUrl = e.target.value;
            const tables = await props.ajax.get('/db/tables', {dbUrl});
            tableOptions = tables.map(item => ({
                value: item.name,
                label: `${item.name}${item.comment ? `（${item.comment}）` : ''}`,
                comment: item.comment,
            }));

            dbTypeOptions = await props.ajax.get('/db/types', {dbUrl});
        } catch (e) {
            tableOptions = [];
            dbTypeOptions = [];
        }

        setTableOptions(tableOptions);
        setDbTypeOptions(dbTypeOptions);
    }, {wait: 300});

    // 设置模块名
    const handleModuleName = useCallback(async (tableName) => {
        let moduleNames;
        let moduleName;
        let moduleChineseName;

        if (tableName) {
            moduleNames = await fetchModuleNames(tableName);
            moduleName = moduleNames['module-name'];
            moduleChineseName = tableOptions.find(it => it.value === tableName)?.comment;
        }

        // moduleName并没有改变，不设置
        if (moduleName === form.getFieldValue('moduleName')) return;

        setModuleNames(moduleNames);
        form.setFieldsValue({moduleName, moduleChineseName: moduleChineseName || moduleName});
    }, [fetchModuleNames, form, tableOptions]);

    // 设置dataSource
    const handleDataSourceChange = useCallback(dataSource => {
        const files = form.getFieldValue('files');
        let changed;
        files.forEach(col => {
            const {templateId} = col;
            const template = templateOptions.find(item => item.value === templateId)?.record;
            const options = template?.defaultFieldOptions || template?.fieldOptions || [];

            dataSource.forEach(item => {
                if (!item.fieldOptions) item.fieldOptions = {};

                if (!item.fieldOptions[templateId]) {
                    item.fieldOptions[templateId] = [...options];
                    changed = true;
                }
            });
        });

        if (changed) {
            setDataSource([...dataSource]);
        }

        setDataSource(dataSource);
    }, [templateOptions, form]);

    // 自动填充表单，name chinese validation formType等
    const handleAutoFill = useCallback(async (e, ds) => {
        const _dataSource = ds || dataSource;
        const newDataSource = await props.ajax.post('/autoFill', {fields: _dataSource});

        // 获取鼠标焦点所在input，数据更新后会失去焦点，要再次选中
        const currentTabIndex = e?.target?.getAttribute('tabindex');

        // 更新数据
        form.setFieldsValue({dataSource: newDataSource});
        handleDataSourceChange(newDataSource);

        // 等待页面刷新之后，重新使输入框获取焦点
        if (currentTabIndex !== undefined) {
            setTimeout(() => {
                const input = document.querySelector(`input[tabindex='${currentTabIndex}']`);
                if (input) input.focus();
            });
        }
    }, [dataSource, form, props.ajax, handleDataSourceChange]);

    // 选择apis事件
    const handleApisChange = useCallback(async (apiKeys) => {
        const swaggerUrl = form.getFieldValue('dbUrl');

        const dataSource = await props.ajax.post('/swagger/apis', {swaggerUrl, apiKeys}, {setLoading} );

        await handleAutoFill(null, dataSource);

    }, [form, handleAutoFill, props.ajax]);

    // 数据库表改变事件
    const handleTableNameChange = useCallback(async (tableNames) => {
        await handleModuleName(tableNames?.[0]);

        const dbUrl = form.getFieldValue('dbUrl');

        // 查询表格数据
        if (!dbUrl || !tableNames?.length) return handleDataSourceChange([]);

        const dataSource = await props.ajax.post('/db/tables/columns', {dbUrl, tableNames}, {setLoading});
        // handleDataSourceChange(dataSource);
        await handleAutoFill(null, dataSource);
    }, [form, handleModuleName, props.ajax, handleDataSourceChange, handleAutoFill]);

    // 模块名改变事件
    const {run: handleModuleNameChange} = useDebounceFn(async (e) => {
        const moduleName = e.target.value;
        if (!moduleName) return;
        const moduleNames = await fetchModuleNames(moduleName);
        setModuleNames(moduleNames);
    }, {wait: 300});

    // 模块名自动补签
    const handleAutoModuleName = useCallback(async (e, isModuleName = false) => {
        const {ctrlKey, metaKey, keyCode} = e;
        const enterKey = keyCode === 13;
        if (!((ctrlKey || metaKey) && enterKey)) return;

        let {moduleName: name, moduleChineseName: chinese} = form.getFieldsValue();
        if (!name && !chinese) return;

        if (isModuleName && name) {
            chinese = undefined;
        }

        if (!isModuleName && chinese) {
            name = undefined;
        }

        const res = await props.ajax.post('/autoFill', {fields: [{name, chinese}], justNames: true});
        if (!res?.length) return;

        const result = res[0];

        const moduleNames = await fetchModuleNames(result.name);

        const moduleName = moduleNames['module-name'];

        form.setFieldsValue({
            moduleName: moduleName,
            moduleChineseName: result.chinese,
        });
        setModuleNames(moduleNames);
    }, [fetchModuleNames, form, props.ajax]);

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
        const {targetPath, defaultOptions, options} = record;

        form.setFields([
            {
                name: ['files', name, 'templateId'],
                value: templateId,
            },
            {
                name: ['files', name, 'targetPath'],
                value: stringFormat(targetPath, {...moduleNames, ...projectNames}),
            },
            {
                name: ['files', name, 'options'],
                value: [...(defaultOptions || options)],
            },
        ]);

        handleFilesChange();
        handleDataSourceChange(dataSource);
    }, [projectNames, moduleNames, templateOptions, form, handleFilesChange, handleDataSourceChange, dataSource]);

    // 表单改变事件
    const {run: handleFormChange} = useDebounceFn(() => {
        const {dbUrl, files} = form.getFieldsValue();
        storage.local.setItem('files', files);
        storage.local.setItem('dbUrl', dbUrl);
    }, {wait: 500});

    // 更新软件版本
    const handleUpdate = useCallback(async () => {
        try {
            setLoadingTip('更新中，请稍成功后请重启服务！');
            await props.ajax.put('/update', null, {errorTip: false, setLoading});
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
        const dataSource = await props.ajax.post('/db/sql', {dbUrl, sql}, {setLoading});
        // handleDataSourceChange(dataSource || []);
        await handleAutoFill(null, dataSource || []);


        await handleModuleName(dataSource?.[0].tableName);
    }, [form, handleModuleName, props.ajax, handleAutoFill]);

    // sql语句输入框，command 或 ctrl + enter 解析
    const handleSqlPressEnter = useCallback(async (e) => {
        const {ctrlKey, metaKey} = e;
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
            // type: 'VARCHAR',
            // formType: 'input',
            // dataType: 'String',
            // length: 50,
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
        await props.ajax.get('/templates/local/download', null, {successTip: '更新成功！'});

        // 等待本地服务器重启
        const si = setInterval(async () => {
            await fetchTemplates({errorTip: false});
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

            form.setFieldsValue({dbUrl});
            await handleDbUrlChange({target: {value: dbUrl}});
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
                options: [...(record.defaultOptions || record.options)],
            }];
        }

        const nextFiles = files.map(item => {
            const record = templateOptions.find(it => it.value === item.templateId)?.record;

            if (!record) return null;

            return item;
        }).filter(Boolean);
        if (!nextFiles?.length) return;

        form.setFieldsValue({files: nextFiles});

        handleFilesChange();
    }, [form, templateOptions, handleFilesChange]);

    // 检查是否有新版本
    useEffect(() => {
        (async () => {
            const res = await props.ajax.get('/version', null, {errorTip: false});
            const {lastVersion, currentVersion} = res;
            if (lastVersion > currentVersion) {
                notification.success({
                    message: '有新版本！',
                    description: (
                        <div>
                            <span style={{color: 'red'}}>{currentVersion}</span>
                            <span style={{margin: '0 8px'}}>-&gt</span>
                            <span style={{color: 'green'}}>{lastVersion}</span>
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

    useEffect(() => {
        if (activeKey === 'items') {
            setDbInfoVisible(false);
        }

    }, [activeKey]);

    // 加载项目名称
    useEffect(() => {
        (async () => {
            const projectNames = await props.ajax.get('/projectNames');
            setProjectNames(projectNames)
        })();
    }, [props.ajax]);

    return (
        <PageContent className={s.root} loading={loading} loadingTip={loadingTip}>
            <Form
                form={form}
                layout="horizontal"
                initialValues={{files: [{}], searchType: 'tables'}}
                onValuesChange={handleFormChange}
            >
                <Row style={{width: '100%', paddingRight: 50}}>
                    <Col flex="0 0 600px">
                        <Form.Item
                            align="right"
                            label={<div style={{paddingLeft: 0}}>swagger/数据库</div>}
                            name="dbUrl"
                        >
                            <Input
                                placeholder="mysql://username:password@host:port/database"
                                onChange={handleDbUrlChange}
                            />
                        </Form.Item>
                    </Col>
                    <Form.Item shouldUpdate noStyle>
                        {({getFieldValue}) => {
                            const dbUrl = getFieldValue('dbUrl');
                            const isSwagger = dbUrl?.trim()?.startsWith('http');
                            if(isSwagger) return null;

                            return (
                                <Col flex="0 0 112px">
                                    <Form.Item name="searchType">
                                        <Radio.Group
                                            options={[
                                                {value: 'sql', label: 'sql'},
                                                {value: 'tables', label: '表'},
                                            ]}
                                            optionType="button"
                                            buttonStyle="solid"
                                        />
                                    </Form.Item>
                                </Col>
                            );
                        }}
                    </Form.Item>
                    <Form.Item shouldUpdate noStyle>
                        {({getFieldValue}) => {
                            const dbUrl = getFieldValue('dbUrl');
                            const isSwagger = dbUrl?.trim()?.startsWith('http');
                            if(isSwagger) return (
                                <Col flex={1}>
                                    <Form.Item name="apis">
                                        <TreeSelect
                                            treeCheckable
                                            maxTagCount={3}
                                            mode="multiple"
                                            showSearch
                                            placeholder="请选择API"
                                            onChange={handleApisChange}
                                            treeData={apiOptions}
                                            treeDefaultExpandAll
                                        />
                                    </Form.Item>
                                </Col>
                            );

                            return (
                                <Col flex={1}>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(p, c) => p.searchType !== c.searchType}
                                    >
                                        {({getFieldValue}) => {
                                            const searchType = getFieldValue('searchType');
                                            if (searchType === 'tables') {
                                                return (
                                                    <Form.Item name="tableNames">
                                                        <Select
                                                            mode="multiple"
                                                            showSearch
                                                            optionFilterProp={'label'}
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
                                                                style={{height: 78}}
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
                            );
                        }}
                    </Form.Item>
                </Row>
                <div style={{marginTop: 8, display: 'flex'}}>
                    <Form.Item
                        labelCol={{flex: '0 0 112px'}}
                        label="模块名"
                        name="moduleName"
                        rules={[{required: true, message: '请输入模块名！'}]}
                    >
                        <Input
                            style={{width: 211}}
                            placeholder="比如：user-center"
                            onChange={handleModuleNameChange}
                            onKeyDown={(e) => handleAutoModuleName(e, true)}
                        />
                    </Form.Item>
                    <Form.Item
                        labelCol={{flex: '0 0 126px'}}
                        label="中文名"
                        name="moduleChineseName"
                    >
                        <Input
                            style={{width: 164}}
                            placeholder="比如：用户"
                            onKeyDown={handleAutoModuleName}
                        />
                    </Form.Item>
                </div>
                <div style={{width: '100%', marginTop: 4}}>
                    <Form.Item shouldUpdate noStyle>
                        {({getFieldValue}) => {
                            const moduleChineseName = getFieldValue('moduleChineseName');
                            return (
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
                                    moduleChineseName={moduleChineseName}
                                    projectNames={projectNames}
                                />
                            );
                        }}
                    </Form.Item>
                </div>
                <Tabs
                    style={{width: '100%', userSelect: 'none'}}
                    tabBarStyle={{marginBottom: 0}}
                    tabBarExtraContent={{
                        left: (
                            <Space style={{marginRight: 16}}>
                                <Button icon={<PlusOutlined/>} onClick={() => handleAdd()}>
                                    添加一行
                                </Button>
                                <Button
                                    icon={<FormOutlined/>}
                                    onClick={() => fastEditModal({
                                        dataSource, getNewRecord,
                                        onOk: async dataSource => {
                                            handleDataSourceChange(dataSource);
                                            await handleAutoFill(null, dataSource);
                                        },
                                    })}
                                >
                                    快速编辑
                                </Button>
                                <Button icon={<CodeOutlined/>} onClick={() => handleGenerate(true)}>
                                    代码预览
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    icon={<FileDoneOutlined/>}
                                    onClick={() => handleGenerate()}
                                >
                                    生成文件
                                </Button>
                                <Checkbox
                                    checked={filesVisible}
                                    onChange={e => setFilesVisible(e.target.checked)}
                                >
                                    文件列表
                                </Checkbox>
                                <Checkbox
                                    checked={dbInfoVisible}
                                    disabled={
                                        ['items', 'db'].includes(activeKey)
                                        || !form.getFieldValue('dbUrl')
                                        || !dataSource?.length
                                    }
                                    onChange={e => setDbInfoVisible(e.target.checked)}
                                >
                                    数据库信息
                                </Checkbox>
                            </Space>
                        ),
                        right: (
                            <Space>
                                <Button
                                    icon={<DeleteOutlined/>}
                                    disabled={!dataSource?.length}
                                    onClick={async () => {
                                        await confirm('您确定清空表格吗？');
                                        handleDataSourceChange([]);
                                    }}
                                >
                                    清空表格
                                </Button>
                                <Button
                                    icon={<CopyOutlined/>}
                                    disabled={!tableOptions?.length}
                                    onClick={() => batchModal({
                                        form,
                                        tableOptions,
                                        templateOptions,
                                        moduleNames,
                                        projectNames,
                                        moduleChineseName: form.getFieldValue('moduleChineseName'),
                                    })}
                                >
                                    批量生成
                                </Button>
                                <Button
                                    icon={<DownloadOutlined/>}
                                    onClick={handleUpdateLocalTemplates}
                                >
                                    更新本地模版
                                </Button>
                                <Button
                                    icon={<QuestionCircleOutlined/>}
                                    onClick={() => helpModal()}
                                >
                                    帮助
                                </Button>
                            </Space>
                        ),
                    }}
                    activeKey={activeKey}
                    onChange={setActiveKey}
                >
                    <TabPane key="files" tab="文件"/>
                    <TabPane key="items" tab="选项"/>
                    <TabPane key="db" tab="数据库"/>
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
                    onAutoFill={handleAutoFill}
                />
                <Feedback/>
            </Form>
        </PageContent>
    );
});
