import React, {useCallback, useState, useEffect} from 'react';
import {Button, Form, Space, } from 'antd';
import {PageContent, QueryBar, FormItem, Table, Pagination, Operator} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import EditModal from './EditModal';
import DetailModal from './DetailModal';

export default config({
    path: '/menus',
})(function MenuList(props) {
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
        { title: '基本路径', dataIndex: 'basePath' },
        { title: '偶像', dataIndex: 'icon' },
        { title: '顺序', dataIndex: 'order' },
        { title: '父母亲', dataIndex: 'parentId' },
        { title: '路径', dataIndex: 'path' },
        { title: '目标', dataIndex: 'target' },
        { title: '文本', dataIndex: 'text' },
        { title: '菜单类型', dataIndex: 'type' },
        { title: '网址', dataIndex: 'url' },
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
        const res = await props.ajax.get('/menus', params, { setLoading });
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
        await props.ajax.del(`/menus/${id}`, null, { setLoading, successTip: '删除成功！' });
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
                        label="基本路径" 
                        name="basePath"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="偶像" 
                        name="icon"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="顺序" 
                        name="order"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="父母亲" 
                        name="parentId"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="路径" 
                        name="path"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="目标" 
                        name="target"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="文本" 
                        name="text"
                    />
                    <FormItem 
                        {...layout} 
                        type="select" 
                        label="菜单类型" 
                        name="type"
                    />
                    <FormItem 
                        {...layout} 
                        type="input" 
                        label="网址" 
                        name="url"
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