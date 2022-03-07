import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Form, Space, Button, notification, Modal, Input, Select} from 'antd';
import {MinusCircleOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {storage} from 'src/commons';
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
    const [form] = Form.useForm();

    const fetchDbTables = useCallback(async (dbUrl) => {
        return await props.ajax.get('/db/tables', { dbUrl });
    }, [props.ajax]);

    const fetchModuleNames = useCallback(async (name) => {
        return await props.ajax.get(`/moduleNames/${name}`);
    }, [props.ajax]);

    const fetchTemplates = useCallback(async () => {
        return await props.ajax.get('/templates');
    }, [props.ajax]);

    const fetchVersion = useCallback(async () => {
        return await props.ajax.get('/version', null, { errorTip: false });
    }, [props.ajax]);

    const fetchUpdate = useCallback(async () => {
        return await props.ajax.put('/update', null, { errorTip: false, setLoading });
    }, [props.ajax]);

    const { run: searchFields } = useDebounceFn(() => setRefreshTable({}), { wait: 300 });

    // 数据库连接改变事件
    const { run: handleDbUrlChange } = useDebounceFn(async (e) => {
        form.setFieldsValue({ tableName: undefined, moduleName: undefined });
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

    // 数据库表改变事件
    const { run: handleTableNameChange } = useDebounceFn(async (tableName) => {
        const moduleNames = await fetchModuleNames(tableName);
        setModuleNames(moduleNames);
        form.setFieldsValue({ moduleName: moduleNames['module-name'] });
        searchFields();
    }, { wait: 300 });

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

    // 初始化时，加载模板
    useEffect(() => {
        (async () => {
            const templates = await fetchTemplates();
            const templateOptions = templates.map(item => ({ record: item, value: item.id, label: item.name }));
            setTemplateOptions(templateOptions);

            // 默认展示全部模板
            // const files = templates.map(item => ({
            //     templateId: item.id,
            //     targetPath: item.targetPath,
            //     options: [...(item.options || [])],
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
                initialValues={{ files: [{}] }}
                onValuesChange={handleFormChange}
            >
                <Form.Item
                    align="right"
                    label={<div style={{ paddingLeft: 28 }}>数据库连接</div>}
                    name="dbUrl"
                >
                    <Input
                        style={{ width: 307 }}
                        placeholder="mysql://username:password@host:port/database"
                        onChange={handleDbUrlChange}
                    />
                </Form.Item>
                <Form.Item
                    label="数据库表"
                    name="tableName"
                >
                    <Select
                        showSearch
                        style={{ width: 315 }}
                        placeholder="请选择数据库表"
                        onChange={handleTableNameChange}
                        options={tableOptions}
                    />
                </Form.Item>
                <Form.Item
                    label="模块名"
                    name="moduleName"
                    rules={[{ required: true, message: '请输入模块名！' }]}
                >
                    <Input
                        style={{ width: 200 }}
                        placeholder="比如：user-center"
                        onChange={handleModuleNameChange}
                    />
                </Form.Item>
                <div style={{ width: '100%', marginTop: 8 }}>
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
                    templateOptions={templateOptions}
                    tableOptions={tableOptions}
                />
            </Form>
        </PageContent>
    );
});
