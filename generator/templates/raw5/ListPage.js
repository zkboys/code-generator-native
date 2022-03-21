const detailModalTemplate = require('./_detailModal.js');
const editModalTemplate = require('./_editModal.js');
module.exports = {
    // 模版名称
    // name: '列表页',
    // 文件级别选项
    options: ['列表', '选中', '序号', '分页', '添加', '修改', '详情', '删除', '批量删除', '导入', '导出'],
    defaultOptions: ['列表', '分页', '添加', '修改', '详情', '删除'],
    // 字段级别选项
    fieldOptions: ['条件', '列表', '表单', '详情'],
    defaultFieldOptions: ['列表', '表单', '详情'],
    // 生成文件的默认目标路径
    targetPath: '/src/pages/{module-name}/index.jsx',
    extraFiles: [
        detailModalTemplate,
        editModalTemplate,
    ],
    // 获取文件内容
    getContent: config => {
        const { NULL_LINE, file, moduleNames: mn, fields } = config;

        const ignore = ['id', 'updatedAt', 'createdAt', 'isDeleted'];
        const queryFields = fields.filter(item => item.fieldOptions.includes('条件') && !ignore.includes(item.__names.moduleName));
        const tableFields = fields.filter(item => item.fieldOptions.includes('列表') && !ignore.includes(item.__names.moduleName));

        const { options = [] } = file;
        if (!options.includes('列表')) return false;

        let _select = options.includes('选中');
        let _number = options.includes('序号');
        const _page = options.includes('分页');
        const _import = options.includes('导入');
        const _export = options.includes('导出');
        const _add = options.includes('添加');
        const _edit = options.includes('修改');
        const _detail = options.includes('详情');
        const _delete = options.includes('删除');
        const _batchDelete = options.includes('批量删除');

        // 批量删除必须要选中
        if (_batchDelete) _select = true;

        if (!_page) _number = false;

        const has = (flag, str, nullLine = true) => flag ? str : (nullLine ? NULL_LINE : '');

        return `
import {useCallback, useState, useEffect} from 'react';
import {Button, Form, Space, ${has(_batchDelete, 'Modal, ', false)}${has(_import, 'Upload, notification', false)}} from 'antd';
import {PageContent, QueryBar, FormItem, Table, ${has(_page, 'Pagination, ', false)}${has(_edit || _detail || _delete, 'Operator', false)}} from '@ra-lib/adm';
import config from 'src/commons/config-hoc';
${has(_add || _edit, 'import editModal from \'./editModal\';')}
${has(_detail, 'import detailModal from \'./detailModal\';')}

export default config({
    title: '${mn.chineseName}',
})(function ${mn.ModuleName}List(props) {
    const [loading, setLoading] = useState(false);
    ${has(_page, 'const [pageNum, setPageNum] = useState(1);')}
    ${has(_page, 'const [pageSize, setPageSize] = useState(20);')}
    const [dataSource, setDataSource] = useState([]);
    ${has(_page, 'const [total, setTotal] = useState(0);')}
    ${has(_select, 'const [selectedRowKeys, setSelectedRowKeys] = useState([]);')}
    ${has(_import, 'const [uploading, setUploading] = useState(false);')}
    const [form] = Form.useForm();

    let columns = [
        ${tableFields.map(item => `{ title: '${item.chinese}', dataIndex: '${item.__names.moduleName}' },`).join('\n        ')}
        ${has(_edit || _detail || _delete, `{
            title: '操作',
            dataIndex: 'operator',
            width: ${[_edit, _detail, _delete].filter(Boolean).length * 50},
            render: (value, record) => {
                ${has(_delete, 'const { id, name } = record')};
                const items = [
                    ${has(_edit, `{
                        label: '修改',
                        onClick: () => editModal({ record }),
                    },`)}
                    ${has(_detail, `{
                        label: '详情',
                        onClick: () => detailModal({ record }),
                    },`)}
                    ${has(_delete, `{
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: \`您确定删除「\${name}」吗？\`,
                            onConfirm: () => handleDelete(id),
                        },
                    },`)}
                ];
                return <Operator items={items}/>;
            },
        },`)}
    ];

    // 查询
    const handleSearch = useCallback(async (${has(_page, 'options = {}', false)}) => {
        const values = await form.validateFields();
        const params = {
            ...values,
            ${has(_page, 'pageNum: options.pageNum || pageNum,')}
            ${has(_page, 'pageSize: options.pageSize || pageSize,')}
        };
        const res = await props.ajax.get('/${mn.module_names}', params, { setLoading });
        const dataSource = res?.content || [];
        ${has(_page, 'const total = res?.totalElements || 0;')}
        setDataSource(dataSource);
        ${has(_page, 'setTotal(total);')}
    }, [form,${has(_page, ' pageNum, pageSize,', false)} props.ajax]);

    ${has(_batchDelete, `// 批量删除
    const handleBatchDelete = useCallback(async () => {
        if (!selectedRowKeys?.length) return Modal.info({ title: '温馨提示', content: '请选择要删除的数据！' });
        await props.ajax.del('/${mn.module_names}', { ids: selectedRowKeys }, { setLoading, successTip: '删除成功！' });
        await handleSearch();
    }, [handleSearch, props.ajax, selectedRowKeys]);`)}

    ${has(_import, `// 导入
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
    }, [handleSearch]);`)}

    ${has(_export, `// 导出
    const handleExport = useCallback(async () => {
        const values = await form.validateFields();
        await props.ajax.download('/${mn.module_names}/export', values);
    }, [form, props.ajax]);`)}

    ${has(_delete, `// 删除
    const handleDelete = useCallback(async (id) => {
        await props.ajax.del(\`/${mn.module_names}/\${id}\`, null, { setLoading, successTip: '删除成功！' });
        await handleSearch();
    }, [handleSearch, props.ajax]);`)}

    // 初始化查询
    useEffect(() => {
        (async () => {
            await handleSearch(${has(_page, '{ pageNum: 1 }', false)});
        })();
        // eslint-disable-next-line
    }, []);

    const layout = {
        wrapperCol: { style: { width: 200 } },
    };

    return (
        <PageContent loading={loading${has(_import, ' || uploading', false)}}>
            <QueryBar>
                <Form
                    layout="inline"
                    form={form}
                    onFinish={async () => {
                        ${has(_page, 'setPageNum(1);')}
                        await handleSearch(${has(_page, '{ pageNum: 1 }', false)});
                    }}
                >
                    ${queryFields.map(item => `<FormItem 
                        {...layout} 
                        type="${item.formType}" 
                        label="${item.chinese}" 
                        name="${item.__names.moduleName}"
                        ${item.options && item.options.length ? `options={[
                            ${item.options.map(it => `{value: '${it.value}', label: '${it.label}'},`).join('\n                            ')}
                        ]}` : NULL_LINE}
                    />`).join('\n                    ')}
                    <FormItem>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button htmlType="reset">
                                重置
                            </Button>
                            ${has(_add, `<Button type="primary" onClick={() => editModal()}>
                                添加
                            </Button>`)}
                            ${has(_batchDelete, `<Button type="primary" danger onClick={handleBatchDelete}>
                                批量删除
                            </Button>`)}
                            ${has(_import, `<Upload
                                name="file"
                                accept=".xlsx,.xls"
                                action="/api/${mn.module_names}/import"
                                showUploadList={false}
                                headers={{}}
                                onChange={handleImport}
                            >
                                <Button type="primary" ghost>
                                    导入
                                </Button>
                            </Upload>`)}
                            ${has(_export, `<Button onClick={handleExport}>
                                导出
                            </Button>`)}
                        </Space>
                    </FormItem>
                </Form>
            </QueryBar>
            <Table
                ${has(_number, 'serialNumber')}
                ${has(_page, 'pageNum={pageNum}')}
                ${has(_page, 'pageSize={pageSize}')}
                fitHeight
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
                ${has(_select, `rowSelection={{
                    selectedRowKeys,
                    onChange: selectedRowKeys => setSelectedRowKeys(selectedRowKeys),
                }}`)}
            />
            ${has(_page, `<Pagination
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
            />`)}
        </PageContent>
    );
});
        `;
    },
};
