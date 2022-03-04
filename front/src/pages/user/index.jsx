import {useCallback, useState, useEffect} from 'react';
import {Button, Form, Space, Modal, Upload, notification} from 'antd';
import {PageContent, QueryBar, FormItem, Table, Pagination, Operator} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import EditModal from './EditModal';
import DetailModal from './DetailModal';

export default config({
    path: '/users',
})(function DepartmentUserList(props) {
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [dataSource, setDataSource] = useState([]);
    const [total, setTotal] = useState(0);
    const [record, setRecord] = useState(null);
    const [visible, setVisible] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    let columns = [
        { title: '新增列1', dataIndex: 'field1' },
        {
            title: '操作',
            dataIndex: 'operator',
            width: 150,
            render: (value, record) => {
                const { id, name } = record;
                const items = [
                    {
                        label: '编辑',
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

    // 批量删除
    const handleBatchDelete = useCallback(async () => {
        if (!selectedRowKeys?.length) return Modal.info({ title: '温馨提示', content: '请选择要删除的数据！' });
        await props.ajax.del('/users', { ids: selectedRowKeys }, { setLoading, successTip: '删除成功！' });
        await handleSearch();
    }, [handleSearch, props.ajax, selectedRowKeys]);

    // 导入
    const handleImport = useCallback(async (info) => {
        if (info.file.status === 'uploading') setUploading(true);
        if (info.file.status === 'done') {
            setUploading(false);
            notification.success({
                message: '导入成功！',
                duration: 2,
            });
            await handleSearch();
        }
        if (info.file.status === 'error') {
            setUploading(false);
            notification.error({
                message: '导入失败！',
                duration: 2,
            });
        }
    }, [handleSearch]);

    // 导出
    const handleExport = useCallback(async () => {
        const values = await form.validateFields();
        await props.ajax.download('/users/export', values);
    }, [form, props.ajax]);

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
        <PageContent loading={loading || uploading}>
            <QueryBar>
                <Form
                    layout="inline"
                    form={form}
                    onFinish={async () => {
                        setPageNum(1);
                        await handleSearch({ pageNum: 1 });
                    }}
                >
                    <FormItem {...layout} type="input" label="新增列1" name="field1"/>
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
                            <Button type="primary" danger onClick={handleBatchDelete}>
                                批量删除
                            </Button>
                            <Upload
                                name="file"
                                accept=".xlsx,.xls"
                                action="/api/users/import"
                                showUploadList={false}
                                headers={{}}
                                onChange={handleImport}
                            >
                                <Button type="primary" ghost>
                                    导入
                                </Button>
                            </Upload>
                            <Button onClick={handleExport}>
                                导出
                            </Button>
                        </Space>
                    </FormItem>
                </Form>
            </QueryBar>
            <Table
                serialNumber
                pageNum={pageNum}
                pageSize={pageSize}
                fitHeight
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
                rowSelection={{
                    selectedRowKeys,
                    onChange: selectedRowKeys => setSelectedRowKeys(selectedRowKeys),
                }}
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