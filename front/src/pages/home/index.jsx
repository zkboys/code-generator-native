import React, {useState, useEffect, useCallback} from 'react';
import {Form, Space, Button, Modal} from 'antd';
import {MinusCircleOutlined, PlusOutlined, CodeOutlined, FormOutlined} from '@ant-design/icons';
import {PageContent, FormItem, storage, Operator} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import {OptionsTag, EditTable} from 'src/components';
import s from './style.less';
import {v4 as uuid} from 'uuid';
import {FORM_ELEMENT_OPTIONS, FIELD_EDIT_TYPES} from './constant';
import {triggerWindowResize} from 'src/commons';

const FORM_STORAGE_KEY = 'single_form_values';
const DATA_SOURCE_STORAGE_KEY = 'single_data_source';

export default config({
    path: '/',
    title: '首页',
})(function Home(props) {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [fieldOptions, setFieldOptions] = useState([]);
    const [tableOptions, setTableOptions] = useState([]);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [form] = Form.useForm();

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

    // dataSource 改变
    const handleDataSourceChange = useCallback(values => {
        setDataSource(values);
        storage.local.setItem(DATA_SOURCE_STORAGE_KEY, values);
    }, []);

    // 删除行
    const handleDelete = useCallback((id) => {
        const nextDataSource = dataSource.filter(item => item.id !== id);
        handleDataSourceChange(nextDataSource);
    }, [dataSource, handleDataSourceChange]);

    const columns = [
        { title: '注释', dataIndex: 'comment', width: 150 },
        { title: '中文名', dataIndex: 'chinese', width: 190, type: FIELD_EDIT_TYPES.input, required: true },
        { title: '列名', dataIndex: 'name', width: 190, type: FIELD_EDIT_TYPES.input, required: true },
        { title: '表单类型', dataIndex: 'formType', width: 190, type: FIELD_EDIT_TYPES.select, options: FORM_ELEMENT_OPTIONS },
        { title: '选项', dataIndex: 'options', type: FIELD_EDIT_TYPES.tags, options: fieldOptions },
        {
            title: '操作', dataIndex: 'operator', width: 100,
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

                return <Operator items={items}/>;
            },
        },

    ];

    // 数据库连接改变事件
    const handleDbUrlChange = useCallback(async (e) => {
        let tableOptions;
        try {
            const dbUrl = e.target.value;
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
        form.setFieldsValue({ moduleName: moduleNames['module-name'] });

        try {
            const dbUrl = form.getFieldValue('dbUrl');
            if (!dbUrl) return Modal.info({ title: '温馨提示', content: '请先输入正确的数据库连接！' });

            dataSource = await fetchColumns(dbUrl, tableName);
        } catch (e) {
            dataSource = [];
        }

        handleDataSourceChange(dataSource.map(item => {
            return {
                id: uuid(),
                formType: item?.types?.form,
                javaType: item?.types?.java,
                ...item,
            };
        }));
    }, [fetchColumns, fetchModuleNames, form, handleDataSourceChange]);

    // 模块名改变事件
    const handleModuleNameChange = useCallback(() => {
        // TODO
    }, []);


    // 文件列表改变事件
    const handleFilesChange = useCallback(() => {
        const files = form.getFieldValue('files');

        const fieldOptions = files.reduce((prev, curr) => {
            const { templateId } = curr;
            const record = templateOptions.find(item => item.value === templateId)?.record;
            return Array.from(new Set([
                ...prev,
                ...(record?.fieldOptions || []),
            ]));
        }, []);

        setFieldOptions(fieldOptions);
    }, [form, templateOptions]);

    // 模版改变事件
    const handleTemplateChange = useCallback((name, templateId) => {
        const record = templateOptions.find(item => item.value === templateId).record;
        const { targetPath, options, fieldOptions } = record;

        const files = form.getFieldValue('files');
        const file = form.getFieldValue(['files', name]);
        file.targetPath = targetPath;
        file.options = [...options];
        files[name] = file;

        form.setFieldsValue({ files: [...files] });

        handleFilesChange();

        const nextDataSource = dataSource.map(item => {
            const options = Array.from(new Set([...item.options, ...fieldOptions]));
            return {
                ...item,
                options,
            };
        });
        handleDataSourceChange(nextDataSource);
    }, [form, handleFilesChange, templateOptions, dataSource, handleDataSourceChange]);

    const handleAdd = useCallback((append = false) => {
        const length = dataSource.length;

        const newRecord = {
            id: uuid(),
            comment: `新增列${length + 1}`,
            chinese: `新增列${length + 1}`,
            field: `field${length + 1}`,
            formType: 'input',
            options: [...fieldOptions],
        };

        append ? dataSource.push(newRecord) : dataSource.unshift(newRecord);
        handleDataSourceChange([...dataSource]);
    }, [dataSource, fieldOptions, handleDataSourceChange]);

    const handlePreviewCode = useCallback(() => {
        //TODO
    }, []);

    const handleFastEdit = useCallback(() => {
        //TODO
    }, []);

    const handleFormChange = useCallback(() => {
        // 解决删除一行文件，获取不到最新数据问题
        setTimeout(() => {
            // 表单同步localStorage
            storage.local.setItem(FORM_STORAGE_KEY, form.getFieldsValue());
            // 触发窗口事件，表格高度重新计算
            triggerWindowResize();
        });
    }, [form]);

    // 从localStorage中恢复表单
    useEffect(() => {
        (async () => {
            const localDataSource = storage.local.getItem(DATA_SOURCE_STORAGE_KEY);
            const values = storage.local.getItem(FORM_STORAGE_KEY) || {};
            form.setFieldsValue(values);
            const { dbUrl, tableName } = values;
            if (dbUrl) {
                await handleDbUrlChange({ target: { value: dbUrl } });
            }
            if (tableName) {
                await handleTableNameChange(tableName);
            }

            handleFilesChange();

            localDataSource && handleDataSourceChange(localDataSource);
        })();
    }, [form, handleDbUrlChange, handleDataSourceChange, handleTableNameChange, handleFilesChange]);

    useEffect(() => {
        (async () => {
            const templates = await fetchTemplates();
            const templateOptions = templates.map(item => ({ record: item, value: item.id, label: item.name }));
            setTemplateOptions(templateOptions);
        })();
    }, [fetchTemplates]);

    useEffect(() => {
        const noOptionsRecord = dataSource.filter(item => !item.options);
        if (!noOptionsRecord?.length) return;
        noOptionsRecord.forEach(item => item.options = [...fieldOptions]);

        handleDataSourceChange([...dataSource]);
    }, [fieldOptions, dataSource, handleDataSourceChange]);

    const formItemProps = {
        // size: 'small',
    };

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
                    labelCol={{ flex: '120px' }}
                    style={{ width: 300 }}
                    align="right"
                    label="数据库连接"
                    name="dbUrl"
                    placeholder="mysql://username:password@host:port/database"
                    onChange={handleDbUrlChange}
                    tooltip="支持mysql、oracle"
                />
                <FormItem
                    {...formItemProps}
                    labelCol={{ flex: '100px' }}
                    style={{ width: 300 }}
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
                    onChange={handleModuleNameChange}
                    required
                />
                <div style={{ width: '100%', marginTop: 8 }}>
                    <Form.List name="files">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, isListField, ...restField }, index) => {
                                    const backgroundColor = index % 2 ? '#fff' : '#eee';
                                    // const isLast = index === fields.length - 1;
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
                                            <div style={{ width: 408, position: 'relative' }}>
                                                {isFirst && (
                                                    <Button
                                                        type="primary"
                                                        ghost
                                                        shape="circle"
                                                        size="small"
                                                        style={{ position: 'absolute', top: 4, zIndex: 1 }}
                                                        icon={<PlusOutlined/>}
                                                        onClick={() => {
                                                            add({});
                                                            handleFilesChange();
                                                        }}
                                                    />
                                                )}
                                                <FormItem
                                                    {...formItemProps}
                                                    {...restField}
                                                    labelCol={{ flex: '90px' }}
                                                    style={{ width: 300 }}
                                                    label={label}
                                                    name={[name, 'templateId']}
                                                    required
                                                    options={templateOptions}
                                                    placeholder="请选择模板"
                                                    onChange={(id) => handleTemplateChange(name, id)}
                                                />
                                            </div>
                                            <FormItem
                                                {...formItemProps}
                                                {...restField}
                                                style={{ width: 300 }}
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
                                                            <OptionsTag options={options}/>
                                                        </FormItem>
                                                    );
                                                }}
                                            </FormItem>
                                            {fields?.length > 1 && (
                                                <MinusCircleOutlined
                                                    style={{ color: 'red' }}
                                                    onClick={() => {
                                                        remove(name);
                                                        handleFilesChange();
                                                    }}
                                                />
                                            )}
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
                    icon={<PlusOutlined/>}
                    type="primary"
                    onClick={() => handleAdd()}
                >
                    添加一行
                </Button>
                <Button
                    icon={<CodeOutlined/>}
                    type="primary"
                    ghost
                    onClick={() => handlePreviewCode()}
                >
                    代码预览
                </Button>
                <Button
                    icon={<FormOutlined/>}
                    onClick={() => handleFastEdit()}
                >
                    快速编辑
                </Button>
            </Space>
            <EditTable
                otherHeight={72}
                columns={columns}
                onAdd={handleAdd}
                dataSource={dataSource}
                onChange={handleDataSourceChange}
                footer={() => null}
            />
        </PageContent>
    );
});
