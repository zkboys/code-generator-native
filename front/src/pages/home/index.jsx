import React, {useState, useEffect, useCallback} from 'react';
import {Form, Space, Button} from 'antd';
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
    path: '/home',
    title: '首页',
})(function Home(props) {
    const [dataSource, setDataSource] = useState(storage.local.getItem(DATA_SOURCE_STORAGE_KEY) || []);
    const [fieldOptions, setFieldOptions] = useState([]);
    const [tableOptions, setTableOptions] = useState([]);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [form] = Form.useForm();

    // DataSource 改变
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
        { title: '列名', dataIndex: 'field', width: 190, type: FIELD_EDIT_TYPES.input, required: true },
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

    const handleDbUrlChange = useCallback(() => {
        // TODO
    }, []);

    const handleTableNameChange = useCallback(() => {
        // TODO
    }, []);

    const handleModuleNameChange = useCallback(() => {
        // TODO
    }, []);
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
    useEffect(() => form.setFieldsValue(storage.local.getItem(FORM_STORAGE_KEY) || {}), [form]);

    // 测试数据
    useEffect(() => {
        setTemplateOptions([
            { value: 'listPage', label: '列表页' },
            { value: 'editModal', label: '编辑弹框' },
        ]);
        setTableOptions([
            { value: 'user_center_adfafd_asdfadf', label: 'user_center_adfafd_asdfadf' },
        ]);
        setFieldOptions(['条件', '表格']);
    }, []);

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
                                                        onClick={() => add({})}
                                                    />
                                                )}
                                                <FormItem
                                                    {...formItemProps}
                                                    {...restField}
                                                    labelCol={{ flex: '90px' }}
                                                    style={{ width: 300 }}
                                                    label={label}
                                                    name={[name, 'template']}
                                                    required
                                                    options={templateOptions}
                                                    placeholder="请选择模板"
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
                                            <FormItem
                                                {...formItemProps}
                                                {...restField}
                                                name={[name, 'options']}
                                            >
                                                <OptionsTag
                                                    options={['表格选中', '表格序号', '分页', '导入', '导出', '添加', '批量删除', '弹框编辑']}
                                                />
                                            </FormItem>
                                            {fields?.length > 1 && (
                                                <MinusCircleOutlined
                                                    style={{ color: 'red' }}
                                                    onClick={() => remove(name)}
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
