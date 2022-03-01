import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Form, Space, Button, Modal } from 'antd';
import {
    MinusCircleOutlined,
    PlusCircleOutlined,
    PlusOutlined,
    CodeOutlined,
    FileDoneOutlined,
} from '@ant-design/icons';
import { PageContent, FormItem, Operator, storage } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import { OptionsTag, EditTable } from 'src/components';
import s from './style.less';
import { v4 as uuid } from 'uuid';
import { FORM_ELEMENT_OPTIONS, FIELD_EDIT_TYPES, DATA_TYPE_OPTIONS } from './constant';
import { stringFormat, triggerWindowResize } from 'src/commons';

export default config({
    path: '/',
    title: '首页',
})(function Home(props) {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [tableOptions, setTableOptions] = useState([]);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [optionColumns, setOptionColumns] = useState([]);
    const [moduleNames, setModuleNames] = useState({});
    const [form] = Form.useForm();
    const editTableRef = useRef();

    const fetchDbTables = useCallback(async (dbUrl) => {
        return await props.ajax.get('/db/tables', { dbUrl }, { errorTip: false });
    }, [props.ajax]);

    const fetchColumns = useCallback(async (dbUrl, tableName) => {
        return await props.ajax.get(`/db/tables/${tableName}`, { dbUrl }, { errorTip: false, setLoading });
    }, [props.ajax]);

    const fetchModuleNames = useCallback(async (name) => {
        return await props.ajax.get(`/moduleNames/${name}`, null, { errorTip: false });
    }, [props.ajax]);

    const fetchTemplates = useCallback(async () => {
        return await props.ajax.get('/templates', null, { errorTip: false });
    }, [props.ajax]);

    // 删除行
    const handleDelete = useCallback((id) => {
        const nextDataSource = dataSource.filter(item => item.id !== id);
        setDataSource(nextDataSource);
    }, [dataSource]);

    const columns = [
        {
            title: '操作', dataIndex: 'operator', width: 60,
            render: (value, record) => {
                const { id, chinese } = record;
                const items = [
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${chinese}"?`,
                            onConfirm: () => handleDelete(id),
                        },
                    },
                ];
                return <Operator items={items} />;
            },
        },
        { title: '注释', dataIndex: 'comment', width: 150 },
        { title: '列名', dataIndex: 'name', width: 150, isNewEdit: true, type: FIELD_EDIT_TYPES.input, required: true },
        { title: '数据类型', dataIndex: 'dataType', width: 130, type: FIELD_EDIT_TYPES.select, options: DATA_TYPE_OPTIONS },
        { title: '中文名', dataIndex: 'chinese', width: 190, type: FIELD_EDIT_TYPES.input, required: true },
        { title: '表单类型', dataIndex: 'formType', width: 150, type: FIELD_EDIT_TYPES.select, options: FORM_ELEMENT_OPTIONS },
        ...optionColumns,
    ];

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
        let dataSource;
        const moduleNames = await fetchModuleNames(tableName);
        setModuleNames(moduleNames);
        form.setFieldsValue({ moduleName: moduleNames['module-name'] });

        try {
            const dbUrl = form.getFieldValue('dbUrl');
            if (!dbUrl) return Modal.info({ title: '温馨提示', content: '请先输入正确的数据库连接！' });

            dataSource = await fetchColumns(dbUrl, tableName);
        } catch (e) {
            dataSource = [];
        }

        setDataSource(dataSource.map(item => {
            return {
                id: uuid(),
                ...item,
            };
        }));
    }, [fetchColumns, fetchModuleNames, form]);

    // 模块名改变事件
    const handleModuleNameBlur = useCallback(async (e) => {
        const moduleName = e.target.value;
        if (!moduleName) return;
        const moduleNames = await fetchModuleNames(moduleName);
        setModuleNames(moduleNames);
    }, [fetchModuleNames]);

    const getOptionColumns = useCallback((templateOptions) => {
        const files = form.getFieldValue('files');
        return files.filter(item => item.templateId)
            .map(({ templateId }) => {
                const record = templateOptions.find(item => item.value === templateId)?.record;
                const title = record?.name;
                const dataIndex = ['options', record?.id];
                const options = record?.fieldOptions || [];
                const type = FIELD_EDIT_TYPES.tags;
                return {
                    title,
                    dataIndex,
                    type,
                    options,
                };
            });
    }, [form]);

    // 文件列表改变事件
    const handleFilesChange = useCallback(() => {
        const optionColumns = getOptionColumns(templateOptions);
        setOptionColumns(optionColumns);
    }, [getOptionColumns, templateOptions]);

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
        // 强制刷新 targetPath
        setModuleNames({ ...moduleNames });
    }, [form, handleFilesChange, templateOptions, moduleNames]);

    // 表格新增一行事件
    const handleAdd = useCallback((append = false) => {
        const length = dataSource.length;

        const newRecord = {
            id: uuid(),
            comment: `新增列${length + 1}`,
            chinese: `新增列${length + 1}`,
            field: `field${length + 1}`,
            formType: 'input',
            dataType: 'String',
            __isNew: true,
        };

        append ? dataSource.push(newRecord) : dataSource.unshift(newRecord);
        setDataSource([...dataSource]);
    }, [dataSource]);

    // 代码预览按钮事件
    const handlePreviewCode = useCallback(() => {
        //TODO
    }, []);

    // 生成代码
    const handleGenerate = useCallback(async () => {
        try {
            const values = await form.validateFields();
            await editTableRef.current.form.validateFields();

            if (!dataSource?.length) return Modal.info({ title: '温馨提示', content: '表格的字段配置不能为空！' });

            console.log(values);
            console.log(dataSource);
            // TODO
        } catch (e) {
            if (e?.errorFields?.length) {
                return Modal.info({ title: '温馨提示', content: '表单填写有误，请检查后再提交！' });
            }
            console.error(e);
        }
    }, [form, dataSource]);

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
            const files = templates.map(item => ({
                templateId: item.id,
                targetPath: item.targetPath,
                options: [...(item.options || [])],
            }));
            form.setFieldsValue({ files });

            const optionColumns = getOptionColumns(templateOptions);
            setOptionColumns(optionColumns);
        })();
    }, [fetchTemplates, form, getOptionColumns]);

    // 从本地同步数据库链接
    useEffect(() => {
        (async () => {
            const dbUrl = storage.local.getItem('dbUrl');
            if (!dbUrl) return;

            form.setFieldsValue({ dbUrl });
            await handleDbUrlChange({ target: { value: dbUrl } });
        })();
    }, [form, handleDbUrlChange]);

    // 设置字段选项默认值，默认全选
    useEffect(() => {
        let changed;
        optionColumns.forEach(col => {
            const [, templateId] = col.dataIndex;
            const options = [...col.options];

            dataSource.forEach(item => {
                if (!item.options) item.options = {};

                if (!item.options[templateId]) {
                    item.options[templateId] = [...options];
                    changed = true;
                }
            });

        });

        // 防止死循环
        changed && setDataSource([...dataSource]);
    }, [dataSource, optionColumns]);

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

    console.log(123);
    return (
        <PageContent className={s.root} loading={loading}>
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
                                    const backgroundColor = index % 2 ? '#fff' : '#eee';
                                    const isLast = index === fields.length - 1;
                                    const isFirst = index === 0;
                                    const number = index + 1;
                                    let label = number;
                                    if (isFirst) label = `文件${number}`;

                                    return (
                                        <div
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                paddingTop: 7,
                                                paddingLeft: 30,
                                                backgroundColor,
                                            }}
                                        >
                                            <div style={{ width: 288, position: 'relative' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    position: 'absolute',
                                                    height: '100%',
                                                    zIndex: 10,
                                                    left: -20,
                                                }}>
                                                    {fields?.length > 1 && (
                                                        <MinusCircleOutlined
                                                            style={{ color: 'red', marginTop: -5, marginRight: 16 }}
                                                            onClick={() => {
                                                                remove(name);
                                                                handleFilesChange();
                                                            }}
                                                        />
                                                    )}
                                                    {isLast && (fields.length < templateOptions.length) && (
                                                        <PlusCircleOutlined
                                                            style={{ color: 'green', marginTop: -5 }}
                                                            onClick={() => {
                                                                add({});
                                                                handleFilesChange();
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <FormItem noStyle shouldUpdate>
                                                    {({ getFieldValue }) => {
                                                        const files = getFieldValue('files');
                                                        const templateId = getFieldValue(['files', name, 'templateId']);
                                                        const options = templateOptions.filter(item => {
                                                            if (templateId === item.value) return true;
                                                            return !files.find(f => f.templateId === item.value);
                                                        });
                                                        return (
                                                            <FormItem
                                                                {...formItemProps}
                                                                {...restField}
                                                                labelCol={{ flex: '70px', style: { userSelect: 'none' } }}
                                                                style={{ width: 200 }}
                                                                label={label}
                                                                name={[name, 'templateId']}
                                                                required
                                                                options={options}
                                                                placeholder="请选择模板"
                                                                onChange={(id) => handleTemplateChange(name, id)}
                                                            />
                                                        );
                                                    }}
                                                </FormItem>
                                            </div>
                                            <FormItem
                                                {...formItemProps}
                                                {...restField}
                                                style={{ width: 400 }}
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
            </Form>
            <Space style={{ marginBottom: 8 }}>
                <Button
                    icon={<PlusOutlined />}
                    ghost
                    type="primary"
                    onClick={() => handleAdd()}
                >
                    添加一行
                </Button>
                <Button
                    icon={<CodeOutlined />}
                    onClick={() => handlePreviewCode()}
                >
                    代码预览
                </Button>
                <Button
                    type="primary"
                    icon={<FileDoneOutlined />}
                    onClick={() => handleGenerate()}
                >
                    生成文件
                </Button>
                <span style={{ marginLeft: 24 }}>共<span style={{ fontSize: 16, margin: '0 8px' }}>{dataSource?.length || 0}</span>条数据</span>
            </Space>
            <EditTable
                ref={editTableRef}
                serialNumber={false}
                fitHeight={false}
                otherHeight={72}
                columns={columns}
                onAdd={handleAdd}
                dataSource={optionColumns?.length ? dataSource : []}
                onChange={setDataSource}
                footer={() => null}
            />
        </PageContent>
    );
});
