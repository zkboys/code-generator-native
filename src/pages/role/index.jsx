import React, {useCallback, useState, useEffect} from 'react';
import {Button, Form, Space, } from 'antd';
import {PageContent, QueryBar, FormItem, Table, Pagination, Operator} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import EditModal from './EditModal';
import DetailModal from './DetailModal';

export default config({
    path: '/roles',
})(function RoleList(props) {
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
        { title: '备注信息', dataIndex: 'description' },
        { title: '名称', dataIndex: 'name' },
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
        const res = await props.ajax.get('/roles', params, { setLoading });
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
        await props.ajax.del(`/roles/${id}`, null, { setLoading, successTip: '删除成功！' });
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
                        label="备注信息" 
                        name="description"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="名称" 
                        name="name"
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