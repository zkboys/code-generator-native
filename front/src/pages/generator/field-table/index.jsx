import React, {useCallback, useMemo, useState, useRef, useEffect} from 'react';
import {Tabs, Table, Button, Space, Modal, Input, Form, Switch, Select, InputNumber} from 'antd';
import {
    CodeOutlined,
    FileDoneOutlined,
    PlusOutlined,
    DownloadOutlined,
    QuestionCircleOutlined,
    CopyOutlined,
} from '@ant-design/icons';
import {useDebounceEffect} from 'ahooks';
import c from 'classnames';
import {v4 as uuid} from 'uuid';
import {OptionsTag, Content, confirm, Operator} from 'src/components';
import {useHeight} from 'src/hooks';
import {ajax} from 'src/hocs';
import {getNextTabIndex} from 'src/commons';
import {DATA_TYPE_OPTIONS, FORM_ELEMENT_OPTIONS, VALIDATE_OPTIONS} from '../constant';
import virtualTable from './virtual-table';
import PreviewModal from '../PreviewModal';
import HelpModal from '../HelpModal';
import BatchModal from '../BatchModal';

import s from './style.module.less';

const MyTable = virtualTable((Table));

const { TabPane } = Tabs;

export default ajax()(function FieldTable(props) {
    const {
        templateOptions,
        tableOptions,
        form,
    } = props;

    const {
        dbUrl,
        tableName,
        files,
    } = form.getFieldsValue();

    const templateIds = (files || []).map(item => item.templateId);

    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const rootRef = useRef(null);
    const [height] = useHeight(rootRef, 104, [templateIds]);
    const [previewParams, setPreviewParams] = useState(null);
    const [activeKey, setActiveKey] = useState('type');
    const [dbTypeOptions, setDbTypeOptions] = useState([]);
    const [helpVisible, setHelpVisible] = useState(false);
    const [batchVisible, setBatchVisible] = useState(false);

    const fetchGenerateFiles = useCallback(async (params) => {
        return await props.ajax.post('/generate/files', params, { setLoading });
    }, [props.ajax]);

    const fetchCheckFilesExist = useCallback(async (params) => {
        return await props.ajax.post('/generate/files/exist', params, { setLoading });
    }, [props.ajax]);

    const fetchDbTypeOptions = useCallback(async (params) => {
        return await props.ajax.get('/db/types', params);
    }, [props.ajax]);

    // 拖拽排序结束
    const handleSortEnd = useCallback((sortProps) => {
        let { oldIndex, newIndex } = sortProps;
        dataSource.splice(newIndex, 0, ...dataSource.splice(oldIndex, 1));
        setDataSource([...dataSource]);
    }, [dataSource]);

    // 表格新增一行事件
    const handleAdd = useCallback((append = false) => {
        // const length = dataSource.length;

        const newRecord = {
            id: uuid(),
            // comment: `新增列${length + 1}`,
            // chinese: `新增列${length + 1}`,
            // name: `field${length + 1}`,
            type: 'VARCHAR',
            formType: 'input',
            dataType: 'String',
            isNullable: true,
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

    const handleAutoName = useCallback(async () => {
        const names = dataSource.map(item => {
            const { id, name, chinese } = item;
            return {
                id,
                name: name?.trim(),
                chinese: chinese?.trim(),
            };
        });
        const res = await props.ajax.post('/autoNames', { names });
        if (!res?.length) return;
        dataSource.forEach(item => {
            const record = res.find(it => it.id === item.id);
            if (record) {
                item.name = record.name;
                item.chinese = record.chinese;
            }
        });
        form.setFieldsValue({ dataSource });
        // setDataSource([...dataSource]);
    }, [dataSource, form, props.ajax]);

    // 键盘时间，使输入框获取焦点，上、下、左、右、回车
    const handleKeyDown = useCallback((e, options) => {
        const { record } = options;
        const { keyCode, ctrlKey, metaKey, shiftKey } = e;
        const enterKey = keyCode === 13;

        if ((ctrlKey || metaKey) && enterKey && !shiftKey) return handleAutoName();

        const result = getNextTabIndex(e, options);
        if (!result) return;
        const { isAdd, isDelete, nextTabIndex } = result;

        if (isDelete) {
            handleDelete(record.id);
        }

        if (isAdd) {
            handleAdd(true);
        }

        // 等待新增行渲染
        setTimeout(() => {
            const nextInput = document.querySelector(`input[tabindex='${nextTabIndex}']`);
            if (!nextInput) return;
            nextInput.focus();
            nextInput.select();
        });
    }, [handleAdd, handleDelete, handleAutoName]);

    // 选项列
    const optionColumns = useMemo(() => {
        return templateIds.filter(Boolean)
            .map((templateId) => {
                const template = templateOptions.find(item => item.value === templateId)?.record;
                const title = template?.shortName;
                const dataIndex = ['options', template?.id];
                const options = template?.fieldOptions || [];
                return {
                    title,
                    dataIndex,
                    formProps: {
                        type: 'tags',
                        options,
                    },
                };
            });
    }, [templateIds, templateOptions]);


    // 渲染表格中的表单项
    // 一共多少行
    const totalRow = dataSource.length;

    const formColumn = useCallback((column, totalInputColumn) => {
        if (!column?.formProps?.type) return column;

        // 只有新增一行之后才可以编辑的列
        const isNewEditFields = [
            'name',
            'type',
            'length',
            'defaultValue',
            'isNullable',
        ];
        const {
            title,
            dataIndex,
            width,
            formProps,
            ...others
        } = column;

        const { type = 'input', required = false, options = [], ...otherFormProps } = formProps;

        const placeholder = type === 'select' ? `请选择${title}` : `请输入${title}`;
        let elementWidth = required ? width - 18 : width - 8;
        if (type === 'switch') elementWidth = 'auto';
        if (!elementWidth) elementWidth = '100%';

        return {
            title,
            dataIndex,
            width,
            ...others,
            render: (value, record, index) => {
                const { __isNew } = record;
                if (isNewEditFields.includes(dataIndex) && !__isNew) {
                    if (['select', 'switch'].includes(type)) return options?.find(it => it.value === value)?.label || value;
                    return value;
                }

                const name = ['dataSource', index, Array.isArray(dataIndex) ? dataIndex : [dataIndex]].flat();

                return (
                    <div className={c(s.element, required && s.required)}>
                        <Form.Item
                            {...formProps}
                            name={name}
                            rules={[{ required, message: `${placeholder}!` }]}
                            valuePropName={type === 'switch' ? 'checked' : 'value'}
                        >
                            {(() => {
                                if (type === 'input') {
                                    const { inputColumnIndex: columnIndex } = column;
                                    const tabIndex = totalRow * columnIndex + index;
                                    const options = {
                                        tabIndex,
                                        columnIndex,
                                        totalColumn: totalInputColumn,
                                        totalRow,
                                        rowIndex: index,
                                        record,
                                    };

                                    return (
                                        <Input
                                            style={{ width: elementWidth }}
                                            placeholder={placeholder}
                                            tabIndex={tabIndex}
                                            onKeyDown={e => handleKeyDown(e, options)}
                                            autoComplete="off"
                                            {...otherFormProps}
                                        />
                                    );
                                }
                                if (type === 'select') {
                                    return (
                                        <Select
                                            style={{ width: elementWidth }}
                                            placeholder={placeholder}
                                            options={options}
                                            {...otherFormProps}
                                        />
                                    );
                                }
                                if (type === 'number') {
                                    return (
                                        <InputNumber
                                            style={{ width: elementWidth }}
                                            placeholder={placeholder}
                                            {...otherFormProps}
                                        />
                                    );
                                }
                                if (type === 'switch') {
                                    return (
                                        <Switch
                                            {...otherFormProps}
                                        />
                                    );
                                }

                                if (type === 'tags') {
                                    return (
                                        <OptionsTag
                                            options={options}
                                            {...otherFormProps}
                                            onClick={(e, ctrlKeyOrMetaKey, values) => {
                                                if (!ctrlKeyOrMetaKey) return;
                                                const isSelectAll = !!values?.length;
                                                const options = optionColumns.map(item => {
                                                    return item.dataIndex[1];
                                                }).reduce((prev, templateId) => {
                                                    const fieldOptions = templateOptions.find(it => it.value === templateId)?.record?.fieldOptions;
                                                    return {
                                                        ...prev,
                                                        [templateId]: isSelectAll ? [...fieldOptions] : [],
                                                    };
                                                }, {});
                                                record.options = options;
                                                form.setFields([{
                                                    name: ['dataSource', index, 'options'],
                                                    value: options,
                                                }]);
                                                setDataSource([...dataSource]);
                                            }}
                                        />
                                    );
                                }
                                throw Error(`no such form type ${type}`);
                            })()}
                        </Form.Item>
                    </div>
                );
            },
        };
    }, [handleKeyDown, totalRow, form, optionColumns, templateOptions, dataSource]);

    // Tab 页配置
    const tabPotions = useMemo(() => {
        return [
            {
                key: 'type', tab: '类型&验证',
                columns: [
                    { title: '数据类型', dataIndex: 'dataType', width: 150, formProps: { type: 'select', options: DATA_TYPE_OPTIONS } },
                    { title: '表单类型', dataIndex: 'formType', width: 150, formProps: { type: 'select', options: FORM_ELEMENT_OPTIONS } },
                    { title: '校验规则', dataIndex: 'validation', formProps: { type: 'select', mode: 'multiple', options: VALIDATE_OPTIONS } },
                ],
            },
            {
                key: 'options', tab: '模板选项',
                columns: [...optionColumns],
            },
        ];
    }, [optionColumns]);

    // 表格列
    const columns = useMemo(() => {
        const isOption = activeKey === 'options';
        const tabColumns = tabPotions
            .find(item => item.key === activeKey)
            .columns
            .map(item => ({ ...item, className: s.tabColumn }));
        let totalInputColumn = 0;
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
            { title: '字段', dataIndex: 'name', width: 150, formProps: { type: 'input', required: true } },
            { title: '注释', dataIndex: 'comment', width: 150 },
            { title: '中文名', dataIndex: 'chinese', width: 150, formProps: { type: 'input', required: true } },
            !isOption && { title: '类型', dataIndex: 'type', width: 150, formProps: { type: 'select', required: true, options: dbTypeOptions } },
            !isOption && { title: '长度', dataIndex: 'length', width: 85, formProps: { type: 'number', min: 0, step: 1 } },
            !isOption && { title: '默认值', dataIndex: 'defaultValue', width: 150, formProps: { type: 'input' } },
            !isOption && { title: '可为空', dataIndex: 'isNullable', width: 60, formProps: { type: 'switch', options: [{ value: true, label: '是' }, { value: false, label: '否' }] } },
            ...tabColumns,
        ].filter(Boolean).map(column => {
            const { type } = column.formProps || {};
            if (type === 'input') {
                column.inputColumnIndex = totalInputColumn;
                totalInputColumn++;
            }
            return column;
        }).map(column => formColumn(column, totalInputColumn));
    }, [activeKey, dbTypeOptions, handleDelete, formColumn, tabPotions]);

    // 生成代码、代码预览
    const handleGenerate = useCallback(async (preview = false) => {
        try {
            if (!dataSource?.length) return Modal.info({ title: '温馨提示', content: '表格的字段配置不能为空！' });

            const values = await form.validateFields();
            const { files, moduleName } = values;
            const config = dataSource.map(item => {
                const validation = item.validation?.map(value => {
                    const record = VALIDATE_OPTIONS.find(it => it.value === value);
                    return {
                        ...record,
                        pattern: record.pattern?.toString(),
                    };
                });
                return {
                    ...item,
                    validation,
                };
            });
            const params = {
                moduleName,
                files,
                config,
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

                Modal.success({
                    width: 600,
                    title: '生成文件如下',
                    content: (
                        <div style={{ maxHeight: 200, overflow: 'auto' }}>
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

    // 更新本地模版
    const handleUpdateLocalTemplates = useCallback(async () => {
        await confirm('本地同名模版将被覆盖，是否继续？');
        await props.ajax.get('/templates/local/download', null, { successTip: '更新成功！' });
    }, [props.ajax]);

    useDebounceEffect(() => {
        (async () => {
            const dbTypeOptions = await fetchDbTypeOptions({ dbUrl });
            setDbTypeOptions(dbTypeOptions);
        })();
    }, [dbUrl, fetchDbTypeOptions], { wait: 500 });

    // 查询表格数据
    useDebounceEffect(() => {
        (async () => {
            // 相关参数不存在，清空数据
            if (!dbUrl || !tableName) return setDataSource([]);

            const dataSource = await props.ajax.get(`/db/tables/${tableName}`, { dbUrl }, { setLoading });
            setDataSource(dataSource);
        })();
    }, [dbUrl, tableName, props.ajax], { wait: 500 });

    // 默认文件选项全选
    useEffect(() => {
        (async () => {
            let changed;
            optionColumns.forEach(col => {
                const [, templateId] = col.dataIndex;
                const options = [...col.formProps.options];

                dataSource.forEach(item => {
                    if (!item.options) item.options = {};

                    if (!item.options[templateId]) {
                        item.options[templateId] = [...options];
                        changed = true;
                    }
                });
            });

            setDataSource(changed ? [...dataSource] : dataSource);
        })();
    }, [dataSource, optionColumns]);

    // dataSource改变，将数据同步到form中
    useEffect(() => form.setFieldsValue({ dataSource }), [form, dataSource]);

    return (
        <Content loading={loading} ref={rootRef} className={s.root}>
            {/* 表单改变，将数据同步到dataSource中 */}
            <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                    const formDataSource = getFieldValue('dataSource') || [];
                    formDataSource.forEach(item => {
                        const record = dataSource.find(it => it.id === item.id);
                        if (!record) return;
                        Object.entries(item).forEach(([key, value]) => {
                            record[key] = value;
                        });
                    });
                }}
            </Form.Item>
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
                    right: (
                        <Space>
                            <Button
                                type={'primary'}
                                ghost
                                icon={<CopyOutlined/>}
                                disabled={!tableOptions?.length}
                                onClick={() => setBatchVisible(true)}
                            >
                                批量生成
                            </Button>
                            <Button
                                icon={<DownloadOutlined/>}
                                onClick={handleUpdateLocalTemplates}
                            >
                                更新本地模版
                            </Button>
                            <Button
                                icon={<QuestionCircleOutlined/>}
                                onClick={() => setHelpVisible(true)}
                            >
                                帮助
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
            <HelpModal
                visible={helpVisible}
                onCancel={() => setHelpVisible(false)}
            />
            <BatchModal
                visible={batchVisible}
                onCancel={() => setBatchVisible(false)}
                dbUrl={dbUrl}
                files={files}
                tableOptions={tableOptions}
            />
        </Content>
    );
});
