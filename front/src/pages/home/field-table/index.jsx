import React, {useCallback, useMemo, useState, useRef, useEffect} from 'react';
import {Tabs, Table, Button, Space, Modal} from 'antd';
import {v4 as uuid} from 'uuid';
import {CodeOutlined, FileDoneOutlined, PlusOutlined} from '@ant-design/icons';
import {Content, Operator, useHeight, confirm, FormItem} from '@ra-lib/admin';
import {FIELD_EDIT_TYPES} from '../constant';
import PreviewModal from '../PreviewModal';
import config from 'src/commons/config-hoc';
import s from './style.less';
import virtualTable from './virtual-table';

const MyTable = virtualTable((Table));

const { TabPane } = Tabs;

export default config()(function FieldTable(props) {
    console.log('FieldTable render');
    const {
        dbUrl,
        tableName,
        files,
        templateOptions,
        form,
    } = props;

    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const rootRef = useRef(null);
    const [height] = useHeight(rootRef, 125, [files]);
    const [previewParams, setPreviewParams] = useState(null);
    const [activeKey, setActiveKey] = useState('type');

    const fetchGenerateFiles = useCallback(async (params) => {
        return await props.ajax.post('/generate/files', params, { setLoading });
    }, [props.ajax]);

    const fetchCheckFilesExist = useCallback(async (params) => {
        return await props.ajax.post('/generate/files/exist', params, { setLoading });
    }, [props.ajax]);

    // 拖拽排序结束
    const handleSortEnd = useCallback((sortProps) => {
        let { oldIndex, newIndex } = sortProps;
        dataSource.splice(newIndex, 0, ...dataSource.splice(oldIndex, 1));
        setDataSource([...dataSource]);
    }, [dataSource]);

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

    // 删除行
    const handleDelete = useCallback((id) => {
        const nextDataSource = dataSource.filter(item => item.id !== id);
        setDataSource(nextDataSource);
    }, [dataSource]);


    // 选项列
    const optionColumns = useMemo(() => {
        return (files || []).filter(item => item.templateId)
            .map(({ templateId }) => {
                const record = templateOptions.find(item => item.value === templateId)?.record;
                const title = record?.shortName;
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
    }, [files, templateOptions]);

    // Tab 页配置
    const tabPotions = useMemo(() => {
        return [
            {
                key: 'type', tab: '类型&验证',
                columns: [
                    { title: '数据类型', dataIndex: 'dataType', width: 150 },
                    { title: '表单类型', dataIndex: 'formType', width: 150 },
                    { title: '校验规则', dataIndex: 'validation' },
                ],
            },
            {
                key: 'options', tab: '模板选项',
                columns: [...optionColumns],
            },
        ];
    }, [optionColumns]);

    const renderElement = useCallback((column) => {
        const { title, dataIndex, type, options, required, ...others } = column;

        return {
            ...others,
            title, dataIndex,
            render: (value, record, index) => {
                return (
                    <FormItem
                        name={['dataSource', index, dataIndex]}
                        type="input"
                        required={required}
                        placeholder={`请输入${title}`}
                    />
                );
            },
        };

    }, []);

    // 表格列
    const columns = useMemo(() => {
        const isOption = activeKey === 'options';
        const tabColumns = tabPotions
            .find(item => item.key === activeKey)
            .columns
            .map(item => ({ ...item, className: s.tabColumn }));
        return [
            {
                title: '操作', dataIndex: 'operator', width: 60,
                render: (value, record) => {
                    const { id, name } = record;
                    const items = [
                        {
                            label: '删除',
                            color: 'red',
                            confirm: {
                                title: `您确定删除"${name}"?`,
                                onConfirm: () => handleDelete(id),
                                // placement: 'right',
                            },
                        },
                    ];
                    return <Operator items={items}/>;
                },
            },
            renderElement({ title: '字段', dataIndex: 'name', width: 150, type: 'input', required: true }),
            renderElement({ title: '备注', dataIndex: 'comment', width: 150, type: 'input', required: true }),
            !isOption && { title: '类型', dataIndex: 'type', width: 80 },
            !isOption && { title: '长度', dataIndex: 'length', width: 50 },
            !isOption && { title: '默认值', dataIndex: 'defaultValue', width: 80 },
            !isOption && { title: '可为空', dataIndex: 'nullable', width: 60 },
            ...tabColumns,
        ].filter(Boolean);
    }, [activeKey, handleDelete, renderElement, tabPotions]);

    // 生成代码、代码预览
    const handleGenerate = useCallback(async (preview = false) => {
        try {
            if (!dataSource?.length) return Modal.info({ title: '温馨提示', content: '表格的字段配置不能为空！' });

            const values = await form.validateFields();
            const { files } = values;
            const params = {
                files,
                config: dataSource,
            };

            if (preview) {
                setPreviewParams(params);
            } else {
                // 检测文件是否存在
                const res = await fetchCheckFilesExist({ files }) || [];

                // 用户选择是否覆盖
                for (let targetPath of res) {
                    const file = files.find(it => it.targetPath === targetPath);

                    try {
                        await confirm({
                            width: 600,
                            title: '文件已存在',
                            content: targetPath,
                            okText: '覆盖',
                            okButtonProps: {
                                danger: true,
                            },
                        });
                        file.rewrite = true;
                    } catch (e) {
                        file.rewrite = false;
                    }
                }

                const paths = await fetchGenerateFiles(params);
                if (!paths?.length) return Modal.info({ title: '温馨提示', content: '未生成任何文件！' });

                Modal.info({
                    width: 600,
                    title: '生成文件如下',
                    content: (
                        <div>
                            {paths.map(p => <div key={p}>{p}</div>)}
                        </div>
                    ),
                });
            }
        } catch (e) {
            if (e?.errorFields?.length) {
                return Modal.info({ title: '温馨提示', content: '表单填写有误，请检查后再提交！' });
            }
            console.error(e);
        }
    }, [form, dataSource, fetchCheckFilesExist, fetchGenerateFiles]);

    // 查询表格数据
    useEffect(() => {
        (async () => {
            // 相关参数不存在，清空数据
            if (!dbUrl || !tableName || !files?.length) {
                setDataSource([]);
                return;
            }

            const dataSource = await props.ajax.get(`/db/tables/${tableName}`, { dbUrl }, { errorTip: false, setLoading });
            // 默认文件选项全选
            optionColumns.forEach(col => {
                const [, templateId] = col.dataIndex;
                const options = [...col.options];

                dataSource.forEach(item => {
                    if (!item.options) item.options = {};

                    if (!item.options[templateId]) {
                        item.options[templateId] = [...options];
                    }
                });
            });

            setDataSource(dataSource);
        })();
    }, [dbUrl, files, optionColumns, props.ajax, tableName, templateOptions]);

    return (
        <Content loading={loading} ref={rootRef} className={s.root}>
            <Tabs
                tabBarExtraContent={{
                    left: (
                        <Space style={{ marginRight: 16 }}>
                            <Button
                                icon={<PlusOutlined/>}
                                type="primary"
                                ghost
                                onClick={() => handleAdd()}
                            >
                                添加一行
                            </Button>
                            <Button
                                icon={<CodeOutlined/>}
                                onClick={() => handleGenerate(true)}
                            >
                                代码预览
                            </Button>
                            <Button
                                type="primary"
                                danger
                                icon={<FileDoneOutlined/>}
                                onClick={() => handleGenerate()}
                            >
                                生成文件
                            </Button>
                        </Space>
                    ),
                }}
                activeKey={activeKey}
                onChange={setActiveKey}
            >
                {tabPotions.map(item => <TabPane key={item.key} tab={item.tab}/>)}
            </Tabs>
            <MyTable
                onSortEnd={handleSortEnd}
                size="small"
                columns={columns}
                pagination={false}
                dataSource={dataSource}
                rowKey="id"
                scroll={{ y: height }}
            />
            <PreviewModal
                visible={!!previewParams}
                params={previewParams}
                onOk={() => setPreviewParams(null)}
                onCancel={() => setPreviewParams(null)}
            />
        </Content>
    );
});
