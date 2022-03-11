import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Form, Space, Button, notification, Modal, Input, Select, Tooltip, Row, Col, Radio} from 'antd';
import {MinusCircleOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {storage, isMac} from 'src/commons';
import {PageContent, OptionsTag} from 'src/components';
import FieldTable from './field-table';
import s from './style.module.less';
import {useDebounceFn} from 'ahooks';
import {ajax} from 'src/hocs';
import TargetPathInput from './TargetPathInput';

export default ajax()(function Generator(props) {
    const [tableOptions, setTableOptions] = useState([]);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [moduleNames, setModuleNames] = useState({});
    const [loading, setLoading] = useState();
    const [loadingTip, setLoadingTip] = useState(undefined);
    // 控制表格更新，如果频繁更新，会比较卡
    const [refreshTable, setRefreshTable] = useState({});
    const [checkExist, setCheckExist] = useState({});
    const [dataSource, setDataSource] = useState([]);
    const [form] = Form.useForm();

    const fetchDbTables = useCallback(async (dbUrl) => {
        return await props.ajax.get('/db/tables', { dbUrl });
    }, [props.ajax]);

    const fetchModuleNames = useCallback(async (name) => {
        return await props.ajax.get(`/moduleNames/${name}`);
    }, [props.ajax]);

    const fetchTemplates = useCallback(async (options = {}) => {
        const templates = await props.ajax.get('/templates', null, { ...options });

        const templateOptions = templates.map(item => ({ record: item, value: item.id, label: item.name }));
        setTemplateOptions(templateOptions);
        return templateOptions;
    }, [props.ajax]);

    const fetchVersion = useCallback(async () => {
        return await props.ajax.get('/version', null, { errorTip: false });
    }, [props.ajax]);

    const fetchUpdate = useCallback(async () => {
        return await props.ajax.put('/update', null, { errorTip: false, setLoading });
    }, [props.ajax]);

    const { run: searchFields } = useDebounceFn(() => setRefreshTable({}), { wait: 300 });

    // 生成文件事件
    const handleGenerate = useCallback(() => {
        setCheckExist({});
    }, []);

    // 数据库连接改变事件
    const { run: handleDbUrlChange } = useDebounceFn(async (e) => {
        form.setFieldsValue({ tableNames: undefined, moduleName: undefined });
        let tableOptions;
        try {
            const dbUrl = e.target.value;
            const tables = await fetchDbTables(dbUrl);
            tableOptions = tables.map(item => ({
                value: item.name,
                label: `${item.name}${item.comment ? `（${item.comment}）` : ''}`,
                comment: item.comment,
            }));
        } catch (e) {
            tableOptions = [];
        }

        setTableOptions(tableOptions);
    }, { wait: 300 });

    const handleModuleName = useCallback(async (tableName) => {
        let moduleNames;
        let moduleName;

        if (tableName) {
            moduleNames = await fetchModuleNames(tableName);
            moduleName = moduleNames['module-name'];
        }
        setModuleNames(moduleNames);
        form.setFieldsValue({ moduleName });
    }, [fetchModuleNames, form]);

    // 数据库表改变事件
    const handleTableNameChange = useCallback(async (tableNames) => {
        await handleModuleName(tableNames?.[0]);

        const dbUrl = form.getFieldValue('dbUrl');

        // 查询表格数据
        if (!dbUrl || !tableNames?.length) return setDataSource([]);

        const dataSource = await props.ajax.post('/db/tables/columns', { dbUrl, tableNames }, { setLoading });
        setDataSource(dataSource);
    }, [form, handleModuleName, props.ajax]);

    // 模块名改变事件
    const { run: handleModuleNameChange } = useDebounceFn(async (e) => {
        const moduleName = e.target.value;
        if (!moduleName) return;
        const moduleNames = await fetchModuleNames(moduleName);
        setModuleNames(moduleNames);
    }, { wait: 300 });

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
        searchFields();
    }, [templateOptions, form, searchFields]);

    // 表单改变事件
    const formChangeStRef = useRef(0);
    const handleFormChange = useCallback(() => {
        clearTimeout(formChangeStRef.current);
        formChangeStRef.current = setTimeout(() => {
            const { dbUrl, files } = form.getFieldsValue();
            storage.local.setItem('files', files);
            storage.local.setItem('dbUrl', dbUrl);
        }, 500);
    }, [form]);

    // 更新软件版本
    const handleUpdate = useCallback(async () => {
        try {
            setLoadingTip('更新中，请稍成功后请重启服务！');
            await fetchUpdate();
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
    }, [fetchUpdate]);

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
        setDataSource(dataSource || []);

        await handleModuleName(dataSource?.[0].tableName);
    }, [form, handleModuleName, props.ajax]);

    // sql语句输入框，command 或 ctrl + enter 解析
    const handleSqlPressEnter = useCallback(async (e) => {
        const { ctrlKey, metaKey } = e;
        if (!(ctrlKey || metaKey)) return;

        await handleParseSql();
    }, [handleParseSql]);

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
            };
        }).filter(Boolean);
        if (!nextFiles?.length) return;

        form.setFieldsValue({ files: nextFiles });
    }, [form, templateOptions]);

    useEffect(() => {
        (async () => {
            const res = await fetchVersion();
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
    }, [fetchVersion, handleUpdate]);

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
                    <Col flex="0 0 115px">
                        <Form.Item name="searchType">
                            <Radio.Group
                                options={[
                                    { value: 'sql', label: 'Sql' },
                                    { value: 'tables', label: '表' },
                                ]}
                                optionType="button"
                                buttonStyle="solid"
                            />
                        </Form.Item>
                    </Col>
                    <Col flex={1}>
                        <Form.Item noStyle shouldUpdate>
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
                                                    placeholder={`请输入sql语句，多表重复字段将会被去重，${isMac ? '⌘' : 'ctrl'} + enter 进行解析`}
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
                    <Form.List name="files">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, isListField, ...restField }, index) => {
                                    const isFirst = index === 0;
                                    const number = index + 1;
                                    const label = `文件${number}`;

                                    const templateId = form.getFieldValue(['files', name, 'templateId']);
                                    const record = templateOptions.find(item => item.value === templateId)?.record;
                                    const options = record?.options || [];

                                    return (
                                        <div key={key} className={s.fileRow}>
                                            <Space className={s.fileOperator}>
                                                <Button
                                                    className={s.fileMinus}
                                                    danger
                                                    icon={<MinusCircleOutlined/>}
                                                    type="link"
                                                    disabled={fields.length === 1}
                                                    onClick={() => {
                                                        remove(name);
                                                        searchFields();
                                                    }}
                                                />
                                                {isFirst && (fields.length < templateOptions.length) && (
                                                    <Button
                                                        className={s.filePlus}
                                                        type="link"
                                                        icon={<PlusCircleOutlined/>}
                                                        onClick={() => {
                                                            const files = form.getFieldValue('files');
                                                            const record = templateOptions.find(item => !files.find(it => it.templateId === item.value))?.record;
                                                            const { id: templateId, targetPath, options } = record || {};
                                                            add({ templateId, targetPath, options: [...options] });
                                                            searchFields();
                                                        }}
                                                    />
                                                )}
                                            </Space>
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prevValues, currValues) => {
                                                    return prevValues?.files?.length !== currValues?.files?.length;
                                                }}
                                            >
                                                {({ getFieldValue }) => {
                                                    const files = getFieldValue('files');
                                                    const options = templateOptions.filter(item => {
                                                        if (templateId === item.value) return true;
                                                        return !files.find(f => f.templateId === item.value);
                                                    });
                                                    return (
                                                        <div>
                                                            <Form.Item
                                                                {...restField}
                                                                label={label}
                                                                name={[name, 'templateId']}
                                                                rules={[{ required: true, message: '请选择模板文件！' }]}
                                                            >
                                                                <Select
                                                                    style={{ width: 211 }}
                                                                    options={options}
                                                                    placeholder="请选择模板"
                                                                    onChange={(id) => handleTemplateChange(name, id)}
                                                                />
                                                            </Form.Item>
                                                        </div>
                                                    );
                                                }}
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                label="目标位置"
                                                name={[name, 'targetPath']}
                                                rules={[
                                                    { required: true, message: '请输入目标文件位置！' },
                                                    {
                                                        validator(_, value) {
                                                            if (!value) return Promise.resolve();
                                                            const files = form.getFieldValue('files');
                                                            const records = files.filter(item => item.targetPath === value);
                                                            if (records.length > 1) return Promise.reject('不能使用相同的目标文件！请修改');
                                                            return Promise.resolve();
                                                        },
                                                    },
                                                ]}
                                            >
                                                <TargetPathInput
                                                    style={{ width: 400 }}
                                                    moduleNames={moduleNames}
                                                    templateId={form.getFieldValue(['files', name, 'templateId'])}
                                                    templateOptions={templateOptions}
                                                    placeholder="请输入目标文件位置"
                                                    name={['files', name, 'targetPath']}
                                                    form={form}
                                                    checkExist={checkExist}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'options']}
                                            >
                                                <OptionsTag options={options}/>
                                            </Form.Item>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </Form.List>
                </div>
                <FieldTable
                    refreshTable={refreshTable}
                    form={form}
                    dataSource={dataSource}
                    templateOptions={templateOptions}
                    tableOptions={tableOptions}
                    onGenerate={handleGenerate}
                    fetchTemplates={fetchTemplates}
                />
            </Form>
            <Tooltip
                title="问题反馈"
                placement="left"
            >
                <a
                    className={s.github}
                    href="https://github.com/zkboys/code-generator-native/issues"
                    target={'_blank'} rel="noreferrer"
                >
                    <svg
                        height="24"
                        width="24"
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        version="1.1"
                        data-view-component="true"
                        className="octicon octicon-mark-github v-align-middle"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                        />
                    </svg>
                </a>
            </Tooltip>
        </PageContent>
    );
});
