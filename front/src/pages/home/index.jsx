import React, {useState, useEffect, useCallback} from 'react';
import {Form, Space, Button} from 'antd';
import {MinusCircleOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {PageContent, FormItem, storage} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import {OptionsTag} from 'src/components';
import {stringFormat} from 'src/commons';
import FieldTable from './field-table';
import s from './style.less';
import {useDebounceFn} from 'ahooks';

export default config({
    path: '/',
    title: '首页',
})(function Home(props) {
    const [tableOptions, setTableOptions] = useState([]);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [moduleNames, setModuleNames] = useState({});
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

    // 数据库连接改变事件
    const { run: handleDbUrlChange } = useDebounceFn(async (e) => {
        let tableOptions;
        try {
            const dbUrl = e.target.value;
            const tables = await fetchDbTables(dbUrl);
            tableOptions = tables.map(item => ({ value: item.name, label: item.name }));
        } catch (e) {
            tableOptions = [];
        }

        setTableOptions(tableOptions);
    }, { wait: 500 });

    // 数据库表改变事件
    const { run: handleTableNameChange } = useDebounceFn(async (tableName) => {
        const moduleNames = await fetchModuleNames(tableName);
        setModuleNames(moduleNames);
        form.setFieldsValue({ moduleName: moduleNames['module-name'] });
    }, { wait: 500 });

    // 模块名改变事件
    const { run: handleModuleNameBlur } = useDebounceFn(async (e) => {
        const moduleName = e.target.value;
        if (!moduleName) return;
        const moduleNames = await fetchModuleNames(moduleName);
        setModuleNames(moduleNames);
    }, { wait: 500 });

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

    }, [templateOptions, form]);

    // 表单改变事件
    const handleFormChange = useCallback((changedValues) => {
        if ('dbUrl' in changedValues) storage.local.setItem('dbUrl', changedValues.dbUrl);
        if ('files' in changedValues) storage.local.setItem('files', changedValues.files);
    }, []);

    // moduleNames 或 templateOptions 改变，处理targetPath
    useEffect(() => {
        if (!Object.keys(moduleNames).length || !templateOptions?.length) return;

        const files = form.getFieldValue('files') || [];
        if (!files?.length) return;

        const nextFiles = files.map(item => {
            const record = templateOptions.find(it => it.value === item.templateId)?.record || {};
            return {
                ...item,
                targetPath: stringFormat(record.targetPath, moduleNames),
            };
        });
        form.setFieldsValue({ files: nextFiles });
    }, [form, templateOptions, moduleNames]);

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

    const formItemProps = {
        // size: 'small',
    };

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
                                    const isFirst = index === 0;
                                    const number = index + 1;
                                    let label = number;
                                    if (isFirst) label = `文件${number}`;

                                    return (
                                        <div key={key} className={s.fileRow}>
                                            <Space className={s.fileOperator}>
                                                <Button
                                                    className={s.fileMinus}
                                                    danger
                                                    icon={<MinusCircleOutlined/>}
                                                    type="link"
                                                    disabled={fields.length === 1}
                                                    onClick={() => remove(name)}
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
                                                            add({ templateId, targetPath: stringFormat(targetPath, moduleNames), options: [...options] });
                                                        }}
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
                                                style={{ width: 400 }}
                                                label="目标位置"
                                                name={[name, 'targetPath']}
                                                placeholder="请输入目标文件位置"
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
                                            />
                                            <FormItem noStyle shouldUpdate>
                                                {({ getFieldValue }) => {
                                                    const templateId = getFieldValue(['files', name, 'templateId']);
                                                    const record = templateOptions.find(item => item.value === templateId)?.record;
                                                    const options = record?.options || [];
                                                    return (
                                                        <FormItem
                                                            {...formItemProps}
                                                            {...restField}
                                                            name={[name, 'options']}
                                                        >
                                                            <OptionsTag options={options}/>
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
                    {({ getFieldsValue }) => {
                        const { dbUrl, tableName, files } = getFieldsValue();
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
