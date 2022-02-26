import React, {Component} from 'react';
import {Button, Form, Modal, Input, Space} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {v4 as uuid} from 'uuid';
import config from 'src/commons/config-hoc';
import {
    // isInputLikeElement,
    PageContent,
    QueryBar,
    FormItem,
    Table,
    tableEditable,
    tableRowDraggable,
    Operator,
} from '@ra-lib/admin';
import {
    DB_URL_STORE_KEY,
    SWAGGER_URL_STORE_KEY,
    renderTags,
    renderFieldTags,
    getTables,
    getLabel,
    getFormElementType,
    getFormElementName,
} from './util';
import PreviewModal from './PreviewModal';

const EditTable = tableEditable(tableRowDraggable(Table));

@config({
    ajax: true,
})
export default class UserCenter extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        total: 0,           // 分页中条数
        pageNum: 1,         // 分页当前页
        pageSize: 20,       // 分页每页显示条数
        deleting: false,    // 删除中loading
        table: {},          // 当前编辑table
        tables: [],         // 数据库表
        ignoreFields: [],   // 忽略字段
        previewVisible: false,
        previewCode: '',
        fastEdit: false,   // test area 快速编辑
    };

    columns = [
        { title: '注释', dataIndex: 'comment' },
        {
            title: '中文名', dataIndex: 'chinese', width: 240,
            formProps: (record, index) => {
                const tabIndex = index + 1; // index * 2 + 1
                return {
                    label: ' ',
                    colon: false,
                    style: { width: 200 },
                    required: true,
                    tabIndex,
                    onFocus: this.handleFocus,
                    onBlur: (e) => {
                        record.chinese = e.target.value;
                    },
                    onKeyDown: (e) => this.handleKeyDown(e, tabIndex),
                };
            },
        },
        {
            title: '列名', dataIndex: 'field', width: 240,
            formProps: (record, index) => {
                if (record.isTable) return null;
                const { table: { children } } = this.state;
                const length = children?.length || 0;

                const tabIndex = index + length + 1; // index * 2 + 2;
                return {
                    label: ' ',
                    colon: false,
                    style: { width: 200 },
                    required: true,
                    tabIndex,
                    onFocus: this.handleFocus,
                    onBlur: (e) => {
                        record.field = e.target.value;
                    },
                    onKeyDown: (e) => this.handleKeyDown(e, tabIndex),
                };
            },
        },
        {
            title: '表单类型', dataIndex: 'formType', width: 240,
            formProps: (record) => {
                if (record.isTable) return null;

                return {
                    label: ' ',
                    colon: false,
                    style: { width: 200 },
                    type: 'select',
                    showSearch: true,
                    options: [
                        { value: 'input', label: '输入框' },
                        { value: 'hidden', label: '隐藏框' },
                        { value: 'number', label: '数字框' },
                        { value: 'textarea', label: '文本框' },
                        { value: 'password', label: '密码框' },
                        { value: 'mobile', label: '手机输入框' },
                        { value: 'email', label: '邮箱输入框' },
                        { value: 'select', label: '下拉框' },
                        { value: 'select-tree', label: '下拉树' },
                        { value: 'checkbox', label: '复选框' },
                        { value: 'checkbox-group', label: '复选框组' },
                        { value: 'radio', label: '单选框' },
                        { value: 'radio-group', label: '单选框组' },
                        { value: 'radio-button', label: '单选按钮组' },
                        { value: 'switch', label: '切换按钮' },
                        { value: 'date', label: '日期选择框' },
                        { value: 'time', label: '时间选择框' },
                        { value: 'moth', label: '月份选择框' },
                        { value: 'date-time', label: '日期+时间选择框' },
                        { value: 'date-range', label: '日期区间选择框' },
                        { value: 'cascader', label: '级联下拉框' },
                        { value: 'transfer', label: '穿梭框' },
                    ],
                    onChange: (formType) => {
                        record.formType = formType;
                    },
                };
            },
        },
        {
            title: '选项', dataIndex: 'operator', width: 270,
            render: (value, record) => {
                return renderFieldTags(record, () => this.setState({ table: { ...this.state.table } }));
            },
        },
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
                            onConfirm: () => this.handleDelete(id),
                        },
                    },
                ];

                return <Operator items={items}/>;
            },
        },
    ];

    componentDidMount() {
        const dbUrl = window.localStorage.getItem(DB_URL_STORE_KEY) || '';
        const swaggerUrl = window.localStorage.getItem(SWAGGER_URL_STORE_KEY) || '';
        this.form.setFieldsValue({ swaggerUrl });

        if (dbUrl) {
            this.form.setFieldsValue({ dbUrl });
            // 初始化查询
            this.handleDbUrlChange();
        }
    }

    handleFocus = (e) => {
        e.target.select();
    };

    handleKeyDown = (e, tabIndex) => {
        const { keyCode, ctrlKey, shiftKey, altKey, metaKey } = e;

        if (ctrlKey || shiftKey || altKey || metaKey) return;

        const { table: { children } } = this.state;
        const length = children?.length || 0;

        const isUp = keyCode === 38;
        const isRight = keyCode === 39;
        const isDown = keyCode === 40;
        const isLeft = keyCode === 37;
        const isEnter = keyCode === 13;

        let nextTabIndex;

        if (isDown || isEnter) {
            if (tabIndex === length || tabIndex === length * 2) {
                nextTabIndex = undefined;
            } else {
                nextTabIndex = tabIndex + 1;
            }
        }

        if (isUp) nextTabIndex = tabIndex - 1;

        if (isLeft) {
            if (tabIndex <= length) {
                nextTabIndex = tabIndex - 1 <= 0 ? undefined : tabIndex - 1 + length;
            } else {
                nextTabIndex = tabIndex - length;
            }
        }

        if (isRight) {
            if (tabIndex <= length) {
                nextTabIndex = tabIndex + length;
            } else {
                nextTabIndex = tabIndex - length === length ? undefined : tabIndex - length + 1;
            }
        }

        const nextInput = document.querySelector(`input[tabindex='${nextTabIndex}']`);

        if (nextInput) {
            // 确保方向键也可以选中
            setTimeout(() => {
                nextInput.focus();
                nextInput.select();
            });
        } else if (isEnter || isDown || isRight) {
            // 新增一行
            this.handleAdd(true);

            // 等待新增行渲染完成，新增行 input 获取焦点
            setTimeout(() => {
                let ti = tabIndex;

                if (isRight) ti = tabIndex - length;

                if ((isDown || isEnter) && tabIndex === length * 2) ti = tabIndex + 1;

                this.handleKeyDown({ keyCode: 13 }, ti);
            });
        }
    };

    handleTypeChange = (e) => {
        const type = e.target.value;
        if (type === 'mysql') {
            this.handleDbUrlChange();
        }
        if (type === 'customer') {
            this.handleModuleNameChange();
        }
        if (type === 'swagger') {
            this.handleSwaggerChange();
        }
    };

    handleDbUrlChange = (e) => {
        const dbUrl = this.form.getFieldValue('dbUrl');
        window.localStorage.setItem(DB_URL_STORE_KEY, dbUrl || '');

        // 清空数据
        this.setState({ tables: [], table: {} });
        this.form.setFieldsValue({ tableName: undefined });

        if (!dbUrl) return;

        this.setState({ loading: true });
        this.props.ajax.get('/ra-gen/tables', { dbUrl })
            .then(res => {
                const { dataSource } = getTables(res);
                this.setState({ tables: dataSource }, () => {

                    // 默认选中第一个表
                    const tableName = dataSource[0]?.tableName;

                    this.form.setFieldsValue({ tableName });
                    this.handleTableNameChange(tableName);
                });
            })
            .finally(() => this.setState({ loading: false }));
    };

    handleSwaggerChange = () => {
        const swaggerUrl = this.form.getFieldValue('swaggerUrl');
        window.localStorage.setItem(SWAGGER_URL_STORE_KEY, swaggerUrl);

        // 清空数据
        this.setState({ tables: [], table: {} });
        this.form.setFieldsValue({ tableName: undefined });

        if (!swaggerUrl) return;


        const method = this.form.getFieldValue('method');
        const userName = this.form.getFieldValue('userName');
        const password = this.form.getFieldValue('password');
        const params = {
            swaggerUrl,
            method,
            userName,
            password,
        };

        this.setState({ loading: true });
        this.props.ajax.get('/ra-gen/swagger', params)
            .then(res => {
                const { moduleName: tableName, queries, columns, forms } = res;

                const children = [];
                (queries || []).forEach(item => {
                    const { type, field, label, required } = item;
                    const chinese = getLabel(label);
                    const formType = getFormElementType({ oType: type, label: chinese });

                    children.push({
                        id: uuid(),
                        tableName,
                        field,
                        comment: label,
                        chinese,
                        name: field,

                        type,
                        formType,
                        length: 0,
                        isNullable: !required,

                        isColumn: true,
                        isQuery: true,
                        isForm: true,
                        isExport: true,
                        isImport: true,
                        isIgnore: false,
                    });
                });

                (columns || []).forEach(item => {
                    const { title, dataIndex } = item;
                    if (!children.find(it => it.field === dataIndex)) {
                        const formType = getFormElementType({ oType: 'input', label: title });
                        children.push(
                            {
                                id: uuid(),
                                tableName,
                                field: dataIndex,
                                comment: title,
                                chinese: getLabel(title),
                                name: dataIndex,

                                type: 'string',
                                formType,
                                length: 0,
                                isNullable: true,

                                isColumn: true,
                                isQuery: false,
                                isForm: true,
                                isExport: true,
                                isImport: true,
                                isIgnore: false,
                            },
                        );
                    }
                });

                (forms || []).forEach(item => {
                    const { type, field, label } = item;
                    if (!children.find(it => it.field === field)) {
                        const formType = getFormElementType({ oType: type, label: label });

                        children.push({
                            id: uuid(),
                            tableName,
                            field,
                            comment: label,
                            chinese: getLabel(label),
                            name: field,

                            type,
                            formType,
                            length: 0,
                            isNullable: true,

                            isColumn: true,
                            isQuery: false,
                            isForm: true,
                            isExport: true,
                            isImport: true,
                            isIgnore: false,
                        });
                    }
                });

                const table = {
                    id: tableName,
                    isTable: true,
                    tableName,
                    comment: '',
                    query: true,
                    selectable: true,
                    pagination: true,
                    serialNumber: true,
                    add: true,
                    operatorEdit: true,
                    operatorDelete: true,
                    batchDelete: true,
                    export: true,
                    import: false,
                    children,
                };

                this.setState({ table });
            })
            .finally(() => this.setState({ loading: false }));
    };

    handleModuleNameChange = () => {
        // 清空数据
        this.setState({ tables: [], table: {} });

        const moduleName = this.form.getFieldValue('moduleName');
        if (!moduleName) return;

        const tableName = moduleName;
        const field = 'name';
        this.setState({
            table: {
                id: tableName,
                isTable: true,
                tableName,
                comment: '',
                query: true,
                selectable: true,
                pagination: true,
                serialNumber: true,
                add: true,
                operatorEdit: true,
                operatorDelete: true,
                batchDelete: true,

                import: true,
                export: true,
                children: [
                    {
                        id: uuid(),
                        tableName,
                        field,
                        comment: '用户名',
                        chinese: '用户名',
                        name: field,

                        type: 'string',
                        formType: 'input',
                        length: 0,
                        isNullable: true,

                        isColumn: true,
                        isQuery: true,
                        isForm: true,
                        isExport: true,
                        isImport: true,
                        isIgnore: false,
                    },
                ],
            },
        });

    };

    handleDelete = (id) => {
        const { table } = this.state;
        const { children } = table;
        table.children = children.filter(item => item.id !== id);
        this.setState({ table: { ...table } });
    };

    handleTableNameChange = (tableName) => {
        const { tables } = this.state;
        const table = tables.find(item => item.tableName === tableName);
        this.setState({ table });
    };

    handleAdd = (append) => {
        const { table } = this.state;
        if (!table.children) table.children = [];
        const length = table.children.length;
        const { tableName, children } = table;
        const field = `field${length + 1}`;
        const id = uuid();

        const newRecord = {
            id,
            tableName,
            field,
            comment: '新增列',
            chinese: '新增列',
            name: field,

            type: 'string',
            formType: 'input',
            length: 0,
            isNullable: true,

            isColumn: true,
            isQuery: false,
            isExport: true,
            isImport: true,
            isIgnore: false,
        };

        append ? children.push(newRecord) : children.unshift(newRecord);
        table.children = [...children];
        this.setState({ table: { ...table } });
    };

    /** 获取参数 */
    getParams = async (showTip) => {
        await this.form.validateFields();

        if (!this.state.table?.children?.length) {
            Modal.error({
                icon: <ExclamationCircleOutlined/>,
                title: '温馨提示',
                content: '字段配置为空，无法生成，请添加字段信息！',
            });

            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            const getParams = () => {
                const { table } = this.state;
                const children = table.children
                    .map(it => ({
                        field: it.field,
                        chinese: getLabel(it.chinese),
                        name: it.name,
                        type: it.type,
                        formType: it.formType || 'input',
                        // length: isInputLikeElement(it.formType || 'input') ? it.length : 0,
                        isNullable: it.isNullable,
                        isForm: it.isForm,
                        isColumn: it.isColumn,
                        isQuery: it.isQuery,
                    }));

                const params = {
                    tables: [{
                        ...table,
                        children,
                    }],
                };

                resolve(params);
            };

            if (!showTip) {
                getParams();
                return;
            }

            Modal.confirm({
                icon: <ExclamationCircleOutlined/>,
                title: '同名文件将被覆盖，是否继续？',
                content: '代码文件直接生成到项目目录中，会引起webpack的热更新，当前页面有可能会重新加载。',
                onOk: () => {
                    getParams();
                },
                onCancel: () => {
                    reject();
                },
            });
        });
    };

    handleGen = async () => {
        const params = await this.getParams(true);

        this.setState({ loading: true });
        this.props.ajax.post('/ra-gen/tables', params, { successTip: '生成成功！' })
            .finally(() => this.setState({ loading: false }));
    };

    handlePreview = async () => {
        const params = await this.getParams();

        this.setState({ loading: true });
        this.props.ajax.post('/ra-gen/preview', params)
            .then(res => {
                this.setState({ previewVisible: true, previewCode: res });
            })
            .finally(() => this.setState({ loading: false }));
    };

    handleSortEnd = ({ newIndex, oldIndex }) => {
        const { table = {} } = this.state;
        const { children = [] } = table;

        children.splice(newIndex, 0, ...children.splice(oldIndex, 1));
        table.children = [...children];

        this.setState({ table: { ...table } });
    };

    handleFastEdit = () => {
        const { fastEdit, table } = this.state;
        const nextVisible = !fastEdit;
        this.setState({ fastEdit: nextVisible });

        if (!nextVisible) {
            const value = document.getElementById('fastTextArea').value;
            if (!value) {
                this.setState({ table: { ...table, children: [] } });
                return;
            }

            const rows = value.split('\n');
            const children = [];
            rows.forEach((item, index) => {
                let str = item.trim();
                // 多个空格 替换成一个
                str = str.replace(/\s+/g, ' ');

                if (!str) return;
                let isColumn = str.includes('isColumn');
                let isForm = str.includes('isForm');
                let isQuery = str.includes('isQuery');

                str = str.replace('isColumn', '');
                str = str.replace('isForm', '');
                str = str.replace('isQuery', '');

                str = str.replace(/\s+/g, ' ');

                if (!str) return;

                let [chinese, field, formType] = str.split(' ');
                if (!formType) formType = getFormElementType({ label: chinese });
                if (!field) field = getFormElementName({ label: chinese, fields: children.map(item => item.field) });


                if (!isColumn && !isForm && !isQuery) {
                    isColumn = true;
                    isForm = true;
                }

                children.push({
                    id: field,
                    comment: chinese,
                    chinese,
                    field,
                    formType,
                    isColumn,
                    isForm,
                    isQuery,
                });

            });

            this.setState({ table: { ...table, children } });
        }
    };

    render() {
        const {
            loading,
            deleting,
            tables,
            table,
            previewVisible,
            previewCode,
            fastEdit,
        } = this.state;

        const formProps = {};

        return (
            <PageContent loading={loading || deleting} style={{ padding: 0, margin: 0 }}>
                <QueryBar style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0 }}>
                    <Form
                        ref={form => this.form = form}
                        initialValues={{ type: 'mysql', method: 'get', userName: 'admin', password: '123456' }}
                    >
                        <Space>
                            <FormItem
                                {...formProps}
                                type="radio-button"
                                name="type"
                                options={[
                                    { value: 'swagger', label: 'Swagger' },
                                    { value: 'mysql', label: 'MySql' },
                                    { value: 'customer', label: '自定义' },
                                ]}
                                onChange={this.handleTypeChange}
                            />
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currValues) => prevValues.type !== currValues.type}
                            >
                                {({ getFieldValue }) => {
                                    const type = getFieldValue('type');
                                    if (type === 'mysql') {
                                        return (
                                            <Space>
                                                <FormItem
                                                    {...formProps}
                                                    style={{ width: 500 }}
                                                    label="数据库地址"
                                                    name="dbUrl"
                                                    placeholder="mysql://username:password@host:port/database"
                                                    onChange={this.handleDbUrlChange}
                                                    required={true}
                                                    rules={[{ required: true, message: '请输入数据库地址！' }]}
                                                />
                                                <FormItem
                                                    {...formProps}
                                                    style={{ width: 200 }}
                                                    type="select"
                                                    showSearch
                                                    label="数据库表"
                                                    name="tableName"
                                                    onChange={this.handleTableNameChange}
                                                    options={tables.map(item => ({ value: item.tableName, label: `${item.tableName} ${item.comment}` }))}
                                                    required={true}
                                                    rules={[{ required: true, message: '请选择数据库表!' }]}
                                                />
                                            </Space>
                                        );
                                    }
                                    if (type === 'swagger') {
                                        return (
                                            <Space>
                                                <FormItem
                                                    {...formProps}
                                                    style={{ width: 400 }}
                                                    label="接口地址"
                                                    name="swaggerUrl"
                                                    placeholder="http(s)://host:port/path"
                                                    onChange={this.handleSwaggerChange}
                                                    required={true}
                                                    rules={[{ required: true, message: '请输入接口地址！' }]}
                                                />
                                                <FormItem
                                                    {...formProps}
                                                    type="select"
                                                    style={{ width: 100 }}
                                                    placeholder="接口方法"
                                                    name="method"
                                                    options={[
                                                        { value: 'get', label: 'GET' },
                                                        { value: 'post', label: 'POST' },
                                                        { value: 'put', label: 'PUT' },
                                                    ]}
                                                    onChange={this.handleSwaggerChange}
                                                    rules={[{ required: true, message: '请选择接口方法！' }]}
                                                />
                                                <FormItem
                                                    {...formProps}
                                                    style={{ width: 120 }}
                                                    placeholder="Swagger用户"
                                                    name="userName"
                                                />
                                                <FormItem
                                                    {...formProps}
                                                    style={{ width: 120 }}
                                                    placeholder="Swagger密码"
                                                    name="password"
                                                />
                                            </Space>
                                        );
                                    }

                                    if (type === 'customer') {
                                        return (
                                            <FormItem
                                                {...formProps}
                                                style={{ width: 300 }}
                                                label="模块名"
                                                name="moduleName"
                                                placeholder="比如：user-center"
                                                onChange={this.handleModuleNameChange}
                                                required={true}
                                                rules={[{ required: true, message: '请输入模块名！' }]}
                                            />
                                        );
                                    }
                                }}
                            </Form.Item>
                        </Space>
                    </Form>
                </QueryBar>
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Button disabled={fastEdit} type="primary" onClick={() => this.handleAdd()}>添加</Button>
                        <Button disabled={fastEdit} style={{ margin: '0 8px' }} type="primary" onClick={this.handleGen}>生成文件</Button>
                        <Button disabled={fastEdit} onClick={this.handlePreview}>代码预览</Button>
                        <Button type="primary" style={{ margin: '0 8px' }} onClick={this.handleFastEdit}>{fastEdit ? '表格编辑' : '快速编辑'}</Button>
                    </div>
                    <div style={{ paddingRight: 23, paddingTop: 3 }}>
                        {renderTags(table, () => this.setState({ table: { ...table } }))}
                    </div>
                </div>
                <div style={{ position: 'relative', height: 'calc(100vh - 230px)' }}>

                    {this.state.fastEdit ? (
                        <Input.TextArea
                            id="fastTextArea"
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                            }}
                            defaultValue={table?.children?.map(item => `${item.chinese || ''} ${item.field || ''} ${item.formType || ''} ${['isColumn', 'isForm', 'isQuery'].map(key => item[key] ? key : '').join(' ')}`).join('\n')}
                        />
                    ) : (
                        <EditTable
                            fitHeight
                            onSortEnd={this.handleSortEnd}
                            serialNumber
                            columns={this.columns}
                            dataSource={table?.children}
                            rowKey="id"
                            size="small"
                        />
                    )}
                </div>
                <PreviewModal
                    visible={previewVisible}
                    previewCode={previewCode}
                    onOk={() => this.setState({ previewVisible: false })}
                    onCancel={() => this.setState({ previewVisible: false })}
                />
            </PageContent>
        );
    }
}
