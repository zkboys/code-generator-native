import React, {useCallback, useState, useEffect} from 'react';
import {Button, Form, Space, } from 'antd';
import {PageContent, QueryBar, FormItem, Table, Pagination, Operator} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import EditModal from './EditModal';
import DetailModal from './DetailModal';

export default config({
    path: '/users',
})(function UserList(props) {
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [dataSource, setDataSource] = useState([]);
    const [total, setTotal] = useState(0);
    const [record, setRecord] = useState(null);
    const [visible, setVisible] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        { title: '账户', dataIndex: 'account' },
        { title: '阿凡达', dataIndex: 'avatar' },
        { title: '电子邮件', dataIndex: 'email' },
        { title: '使可能', dataIndex: 'enable' },
        { title: '性别', dataIndex: 'gender' },
        { title: '是管理员吗', dataIndex: 'isAdmin' },
        { title: '工作编号', dataIndex: 'jobNumber' },
        { title: '可移动的', dataIndex: 'mobile' },
        { title: '名称', dataIndex: 'name' },
        { title: '暗语', dataIndex: 'password' },
        { title: '位置', dataIndex: 'position' },
        { title: '二维码', dataIndex: 'qrCode' },
        { title: '状态', dataIndex: 'status' },
        {
            title: '操作',
            dataIndex: 'operator',
            width: 150,
            render: (value, record) => {
                const { id, name } = record;
                const items = [
                    {
                        label: '修改',
                        onClick: () => {
                            setRecord(record);
                            setVisible(true);   
                        },
                    },
                    {
                        label: '详情',
                        onClick: () => {
                            setRecord(record);
                            setDetailVisible(true);
                        },
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除「${name}」吗？`,
                            onConfirm: () => handleDelete(id),
                        },
                    },
                ];
                return <Operator items={items}/>;
            },
        },
    ];

    // 查询
    const handleSearch = useCallback(async (options = {}) => {
        const values = await form.validateFields();
        const params = {
            ...values,
            pageNum: options.pageNum || pageNum,
            pageSize: options.pageSize || pageSize,
        };
        const res = await props.ajax.get('/users', params, { setLoading });
        const dataSource = res?.content || [];
        const total = res?.totalElements || 0;
        setDataSource(dataSource);
        setTotal(total);
    }, [form, pageNum, pageSize, props.ajax]);

    // 添加
    const handleAdd = useCallback(() => {
        setRecord(null);
        setVisible(true);
    }, []);




    // 删除
    const handleDelete = useCallback(async (id) => {
        await props.ajax.del(`/users/${id}`, null, { setLoading, successTip: '删除成功！' });
        await handleSearch();
    }, [handleSearch, props.ajax]);

    // 初始化查询
    useEffect(() => {
        (async () => {
            await handleSearch({ pageNum: 1 });
        })();
        // eslint-disable-next-line
    }, []);

    const layout = {
        wrapperCol: { style: { width: 200 } },
    };

    return (
        <PageContent loading={loading}>
            <QueryBar>
                <Form
                    layout="inline"
                    form={form}
                    onFinish={async () => {
                        setPageNum(1);
                        await handleSearch({ pageNum: 1 });
                    }}
                >
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="账户" 
                        name="account"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="阿凡达" 
                        name="avatar"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="电子邮件" 
                        name="email"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="使可能" 
                        name="enable"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="性别" 
                        name="gender"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="是管理员吗" 
                        name="isAdmin"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="工作编号" 
                        name="jobNumber"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="可移动的" 
                        name="mobile"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="名称" 
                        name="name"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="暗语" 
                        name="password"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="位置" 
                        name="position"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="二维码" 
                        name="qrCode"
                    />
                    <FormItem 
                        {...layout} 
                        type="select" 
                        label="状态" 
                        name="status"
                    />
                    <FormItem>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button htmlType="reset">
                                重置
                            </Button>
                            <Button type="primary" onClick={handleAdd}>
                                添加
                            </Button>
                        </Space>
                    </FormItem>
                </Form>
            </QueryBar>
            <Table
                pageNum={pageNum}
                pageSize={pageSize}
                fitHeight
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
            />
            <Pagination
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onPageNumChange={async pageNum => {
                    setPageNum(pageNum);
                    await handleSearch({ pageNum });
                }}
                onPageSizeChange={async (pageSize) => {
                    setPageNum(1);
                    setPageSize(pageSize);
                    await handleSearch({ pageNum: 1, pageSize });
                }}
            />
            <EditModal
                visible={visible}
                isEdit={!!record}
                record={record}
                onOk={async () => {
                    setVisible(false);
                    await handleSearch();
                }}
                onCancel={() => setVisible(false)}
            />
            <DetailModal
                visible={detailVisible}
                record={record}
                onCancel={() => setDetailVisible(false)}
            />
        </PageContent>
    );
});