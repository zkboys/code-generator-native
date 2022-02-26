import React, { Component } from 'react';
import { Form, Button, Modal, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FormItem, Table, tableEditable, QueryBar } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import { PageContent } from '@ra-lib/admin';
import {
    DB_URL_STORE_KEY,
    renderTags,
    renderFieldTags,
    getTables,
    getLabel,
} from './util';

const EditTable = tableEditable(Table);

const renderContent = (value, record) => {
    const obj = {
        children: value,
        props: {},
    };
    if (record.isTable) {
        obj.props.colSpan = 0;
    }
    return obj;
};


@config({ ajax: true })
export default class Fast extends Component {
    state = {
        loading: false,
        selectedRowKeys: [],
        dataSource: [],
    };

    columns = [
        { title: '表名', dataIndex: 'tableName', width: 200 },
        { title: '数据库注释', dataIndex: 'comment', width: 200 },
        {
            title: <span style={{ paddingLeft: 10 }}>中文名</span>, dataIndex: 'chinese', width: 250,
            formProps: (record, index) => {
                return {
                    label: ' ',
                    colon: false,
                    style: { width: 200 },
                    required: true,
                    tabIndex: index + 1, // index * 2 + 1
                    onBlur: (e) => {
                        record.chinese = e.target.value;
                    },
                };
            },
            render: renderContent,
        },
        {
            title: <span style={{ paddingLeft: 10 }}>列名</span>, dataIndex: 'field', width: 250,
            formProps: (record, index) => {
                if (record.isTable) return null;

                return {
                    label: ' ',
                    colon: false,
                    style: { width: 200 },
                    required: true,
                    tabIndex: index + 100, // index * 2 + 2
                    onBlur: (e) => {
                        record.field = e.target.value;
                    },
                };
            },
            render: (value, record) => {
                if (record.isTable) {
                    const tags = renderTags(record, () => this.setState({ dataSource: [...this.state.dataSource] }));
                    return {
                        children: <div style={{ textAlign: 'right' }}>{tags}</div>,
                        props: {
                            colSpan: 3,
                        },
                    };
                }
                return value;
            },
        },
        {
            title: '选项', dataIndex: 'options',
            render: (value, record) => {
                const children = renderFieldTags(record, () => this.setState({ dataSource: [...this.state.dataSource] }));
                return {
                    children,
                    props: { colSpan: record.isTable ? 0 : 1 },
                };
            },
        },
        // {title: '是否为空', dataIndex: 'nullable'},
    ];

    componentDidMount() {
        const dbUrl = window.localStorage.getItem(DB_URL_STORE_KEY) || '';
        if (dbUrl) {
            this.form.setFieldsValue({ dbUrl });
            // 初始化查询
            this.form.submit();
        }
    }

    handleSubmit = (values) => {
        this.setState({ loading: true });
        this.props.ajax.get('/ra-gen/tables', values)
            .then(res => {
                const { dataSource, selectedRowKeys } = getTables(res);

                this.setState({ dataSource, selectedRowKeys });
            })
            .finally(() => this.setState({ loading: false }));
    };

    handleDbUrlChange = (e) => {
        const dbUrl = e.target.value;

        // 进行本地存储，记录数据库地址，使用原生存储，不区分用户
        window.localStorage.setItem(DB_URL_STORE_KEY, dbUrl || '');
    };

    handleGen = () => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: '同名文件将被覆盖，是否继续？',
            content: '代码文件直接生成到项目目录中，会引起webpack的热更新，当前页面有可能会重新加载。',
            onOk: () => {
                const { selectedRowKeys, dataSource } = this.state;
                const tables = dataSource.filter(item => selectedRowKeys.includes(item.id));
                const result = tables.map(item => {
                    const children = item.children
                        .map(it => ({
                            field: it.field,
                            chinese: getLabel(it.chinese),
                            name: it.name,
                            type: it.type,
                            length: it.length,
                            isNullable: it.isNullable,
                            isForm: it.isForm,
                            isColumn: it.isColumn,
                            isQuery: it.isQuery,
                        }));

                    return {
                        ...item,
                        children,
                    };
                });
                const params = {
                    tables: result,
                };
                this.setState({ loading: true });
                this.props.ajax.post('/ra-gen/tables', params, { successTip: '生成成功！' })
                    .then(res => {
                        console.log(res);
                    })
                    .finally(() => this.setState({ loading: false }));
            },
        });
    };

    render() {
        const { dataSource, selectedRowKeys, loading } = this.state;

        return (
            <PageContent style={{ padding: 0, margin: 0 }} loading={loading}>
                <QueryBar style={{ marginLeft: 0, marginRight: 0 }}>
                    <Form
                        ref={form => this.form = form}
                        onFinish={this.handleSubmit}
                    >
                        <Space>
                            <FormItem
                                label="数据库地址"
                                name="dbUrl"
                                placeholder="mysql://username:password@host:port/database"
                                required
                                onChange={this.handleDbUrlChange}
                                style={{ width: 400 }}
                                rules={[{ required: true, message: '请输入数据库地址！' }]}
                            />
                            <FormItem>
                                <Space>
                                    <Button type="primary" htmlType="submit">获取数据库表</Button>
                                    <Button disabled={!selectedRowKeys?.length} onClick={this.handleGen}>生成选中表</Button>
                                </Space>
                            </FormItem>
                        </Space>
                    </Form>
                </QueryBar>

                <EditTable
                    fitHeight
                    rowSelection={{
                        selectedRowKeys,
                        onChange: selectedRowKeys => this.setState({ selectedRowKeys }),
                        renderCell: (checked, record, index, originNode) => record.isTable ? originNode : null,
                    }}
                    dataSource={dataSource}
                    columns={this.columns}
                    rowKey="id"
                />
            </PageContent>
        );
    }
}
