import React, { useState, useEffect, useCallback } from 'react';
import { Form, Space } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { PageContent, FormItem, storage } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import { OptionsTag } from 'src/components';
import { stringFormat, triggerWindowResize } from 'src/commons';
import FieldTable from './field-table';
import s from './style.less';

export default config({
    path: '/',
    title: '首页',
})(function Home(props) {
    const [tableOptions, setTableOptions] = useState([]);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [moduleNames, setModuleNames] = useState({});
    const [form] = Form.useForm();

    const fetchDbTables = useCallback(async (dbUrl) => {
        return await props.ajax.get('/db/tables', { dbUrl }, { errorTip: false });
    }, [props.ajax]);

    const fetchModuleNames = useCallback(async (name) => {
        return await props.ajax.get(`/moduleNames/${name}`, null, { errorTip: false });
    }, [props.ajax]);

    const fetchTemplates = useCallback(async () => {
        return await props.ajax.get('/templates', null, { errorTip: false });
    }, [props.ajax]);

    // 数据库连接改变事件
    const handleDbUrlChange = useCallback(async (e) => {
        let tableOptions;
        try {
            const dbUrl = e.target.value;
            storage.local.setItem('dbUrl', dbUrl);
            const tables = await fetchDbTables(dbUrl);
            tableOptions = tables.map(item => ({ value: item.name, label: item.name }));
        } catch (e) {
            tableOptions = [];
        }

        setTableOptions(tableOptions);
    }, [fetchDbTables]);

    // 数据库表改变事件
    const handleTableNameChange = useCallback(async (tableName) => {
        const moduleNames = await fetchModuleNames(tableName);
        setModuleNames(moduleNames);
        form.setFieldsValue({ moduleName: moduleNames['module-name'] });
    }, [fetchModuleNames, form]);

    // 模块名改变事件
    const handleModuleNameBlur = useCallback(async (e) => {
        const moduleName = e.target.value;
        if (!moduleName) return;
        const moduleNames = await fetchModuleNames(moduleName);
        setModuleNames(moduleNames);
    }, [fetchModuleNames]);

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

        // 强制刷新 targetPath
        setModuleNames({ ...moduleNames });
    }, [form, templateOptions, moduleNames]);

    // 表单改变事件
    const handleFormChange = useCallback(() => {
        //  触发窗口事件，表格高度重新计算
        triggerWindowResize();
    }, []);

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

    // 处理模板的目标位置
    useEffect(() => {
        const files = form.getFieldValue('files') || [];
        const nextFiles = files.map(item => {
            if (item.targetPath) {
                const record = templateOptions.find(it => it.value === item.templateId).record;
                item.targetPath = stringFormat(record.targetPath, moduleNames);
            }

            return { ...item };
        });
        form.setFieldsValue({ files: nextFiles });
    }, [form, moduleNames, templateOptions]);

    const formItemProps = {
        // size: 'small',
    };

    console.log('index render');
    return (
        <PageContent className={s.root}>
            <Form
                className={s.query}
                style={{ marginBottom: 8 }}
                form={form}
                layout="inline"
                initialValues={{ files: [{}] }}
                onValuesChange={handleFormChange}
            >
                <FormItem
                    {...formItemProps}
                    labelCol={{ flex: '100px' }}
                    style={{ width: 300 }}
                    align="right"
                    label="数据库"
                    name="dbUrl"
                    placeholder="mysql://username:password@host:port/database"
                    onChange={handleDbUrlChange}
                    tooltip="支持mysql、oracle"
                />
                <FormItem
                    {...formItemProps}
                    labelCol={{ flex: '100px' }}
                    style={{ width: 308 }}
                    type="select"
                    showSearch
                    label="数据库表"
                    name="tableName"
                    onChange={handleTableNameChange}
                    options={tableOptions}
                />
                <FormItem
                    {...formItemProps}
                    labelCol={{ flex: '91px' }}
                    style={{ width: 200 }}
                    label="模块名"
                    name="moduleName"
                    placeholder="比如：user-center"
                    onBlur={handleModuleNameBlur}
                    required
                />
                <div style={{ width: '100%', marginTop: 8 }}>
                    <Form.List name="files">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, isListField, ...restField }, index) => {
                                    const isLast = index === fields.length - 1;
                                    const isFirst = index === 0;
                                    const number = index + 1;
                                    let label = number;
                                    if (isFirst) label = `文件${number}`;

                                    return (
                                        <div key={key} className={s.fileRow}>
                                            <Space className={s.fileOperator}>
                                                {fields?.length > 1 && (
                                                    <MinusCircleOutlined
                                                        className={s.fileMinus}
                                                        onClick={() => remove(name)}
                                                    />
                                                )}
                                                {isLast && (fields.length < templateOptions.length) && (
                                                    <PlusCircleOutlined
                                                        className={s.filePlus}
                                                        onClick={() => add({})}
                                                    />
                                                )}
                                            </Space>
                                            <FormItem noStyle shouldUpdate>
                                                {({ getFieldValue }) => {
                                                    const files = getFieldValue('files');
                                                    const templateId = getFieldValue(['files', name, 'templateId']);
                                                    const options = templateOptions.filter(item => {
                                                        if (templateId === item.value) return true;
                                                        return !files.find(f => f.templateId === item.value);
                                                    });
                                                    return (
                                                        <div style={{ width: 318 }}>
                                                            <FormItem
                                                                {...formItemProps}
                                                                {...restField}
                                                                labelCol={{ flex: '100px', style: { userSelect: 'none' } }}
                                                                style={{ width: 200 }}
                                                                label={label}
                                                                name={[name, 'templateId']}
                                                                rules={[{ required: true, message: '请选择模板文件！' }]}
                                                                options={options}
                                                                placeholder="请选择模板"
                                                                onChange={(id) => handleTemplateChange(name, id)}
                                                            />
                                                        </div>
                                                    );
                                                }}
                                                    </FormItem>
                                                    <FormItem
                                                {...formItemProps}
                                                {...restField}
                                                    style={{width: 400}}
                                                    label="目标位置"
                                                    name={[name, 'targetPath']}
                                                    required
                                                    rules={[
                                                {
                                                    validator(_, value) {
                                                    if (!value) return Promise.resolve();
                                                    const files = form.getFieldValue('files');
                                                    const index = files.findIndex(item => item.targetPath === value);
                                                    const lastIndex = files.findLastIndex(item => item.targetPath === value);
                                                    if (index !== lastIndex) return Promise.reject('不能使用相同的目标文件！请修改');
                                                    return Promise.resolve();
                                                },
                                                },
                                                    ]}
                                                    />
                                                    <FormItem noStyle shouldUpdate>
                                                {({getFieldValue}) => {
                                                    const templateId = getFieldValue(['files', name, 'templateId']);
                                                    const record = templateOptions.find(item => item.value === templateId)?.record;
                                                    const options = record?.options || [];
                                                    return (
                                                    <FormItem
                                                {...formItemProps}
                                                {...restField}
                                                    name={[name, 'options']}
                                                    >
                                                    <OptionsTag options={options} />
                                                    </FormItem>
                                                    );
                                                }}
                                                    </FormItem>
                                                    </div>
                                                    );
                                                })}
                                    </>
                                    )}
                                    </Form.List>
                                    </div>

                                    <FormItem
                                    shouldUpdate={(prevValue, curValue) => {
                                    const fields = ['dbUrl', 'tableName', 'moduleName', 'files'];
                                    return fields.some(field => prevValue?.[field] !== curValue?.[field]);
                                }}
                                    noStyle
                                    >
                                {({getFieldsValue}) => {
                                    const {dbUrl, tableName, files} = getFieldsValue();
                                    return (
                                    <FieldTable
                                    form={form}
                                    dbUrl={dbUrl}
                                    tableName={tableName}
                                    files={files}
                                    templateOptions={templateOptions}
                                    />
                                    );
                                }}
                                    </FormItem>
                                    </Form>
                                    </PageContent>
                                    );
                                });
