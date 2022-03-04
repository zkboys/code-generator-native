import React, {useCallback, useMemo, useState, useRef, useEffect} from 'react';
import {Tabs, Table, Button, Space, Modal} from 'antd';
import {CodeOutlined, FileDoneOutlined, PlusOutlined, DownloadOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {useDebounceEffect} from 'ahooks';
import c from 'classnames';
import {v4 as uuid} from 'uuid';
import {Content, Operator, useHeight, confirm, FormItem} from '@ra-lib/admin';
import {OptionsTag} from 'src/components';
import config from 'src/commons/config-hoc';
import {getCursorPosition} from 'src/commons';
import {DATA_TYPE_OPTIONS, FORM_ELEMENT_OPTIONS, VALIDATE_OPTIONS} from '../constant';
import virtualTable from './virtual-table';
import PreviewModal from '../PreviewModal';
import HelpModal from '../HelpModal';

import s from './style.less';

const MyTable = virtualTable((Table));

const { TabPane } = Tabs;

export default config()(function FieldTable(props) {
    const {
        templateOptions,
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
    const [height] = useHeight(rootRef, 110, [templateIds]);
    const [previewParams, setPreviewParams] = useState(null);
    const [activeKey, setActiveKey] = useState('type');
    const [dbTypeOptions, setDbTypeOptions] = useState([]);
    const [helpVisible, setHelpVisible] = useState(true);

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
        const length = dataSource.length;

        const newRecord = {
            id: uuid(),
            comment: `新增列${length + 1}`,
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

    // 键盘时间，使输入框获取焦点，上、下、左、右、回车
    const handleKeyDown = useCallback((e, options) => {
        const { tabIndex, columnIndex, totalColumn, totalRow, record, rowIndex } = options;
        const { keyCode, ctrlKey, shiftKey, altKey, metaKey } = e;
        const enterKey = keyCode === 13;

        const isDelete = (ctrlKey || metaKey) && shiftKey && enterKey;

        if ((ctrlKey || shiftKey || altKey || metaKey) && !isDelete) return;

        const isUp = keyCode === 38;
        const isRight = keyCode === 39;
        const isDown = keyCode === 40 || keyCode === 13;
        const isLeft = keyCode === 37;

        // 移动光标
        const cursorPosition = getCursorPosition(e.target);
        if (isLeft && !cursorPosition.start) return;
        if (isRight && !cursorPosition.end) return;

        const columnStartTabIndex = columnIndex * totalRow;
        const columnEndTabIndex = (columnIndex + 1) * totalRow - 1;

        let nextTabIndex;
        let isAdd;

        if (isUp) {
            // 到顶了
            if (tabIndex === columnStartTabIndex) return;

            nextTabIndex = tabIndex - 1;
        }

        if (isRight) {
            // 右侧
            if (columnIndex === totalColumn - 1) {
                // 右下角
                if (tabIndex === columnEndTabIndex) {
                    isAdd = true;
                    nextTabIndex = totalRow;
                } else {
                    // 选中下一行第一个
                    nextTabIndex = rowIndex + 1;
                }
            } else {
                // 选择右侧一个
                nextTabIndex = tabIndex + totalRow;
            }
        }

        if (isDown) {
            if (tabIndex === columnEndTabIndex) {
                isAdd = true;
                nextTabIndex = tabIndex + columnIndex;
            } else {
                nextTabIndex = tabIndex + 1;
            }
        }

        if (isLeft) {
            // 左上角
            if (tabIndex === columnStartTabIndex && columnIndex === 0) return;

            // 左侧第一列继续左移动，选中上一行最后一个
            if (columnIndex === 0) nextTabIndex = totalRow * (totalColumn - 1) + (rowIndex - 1);

            // 选择前一个
            if (columnIndex !== 0) nextTabIndex = tabIndex - totalRow;
        }

        if (isDelete) {
            handleDelete(record.id);
            isAdd = false;

            if (tabIndex === columnEndTabIndex) {
                nextTabIndex = (totalRow - 1) * columnIndex + (rowIndex - 1);
            } else {
                nextTabIndex = (totalRow - 1) * columnIndex + (rowIndex + 1) - 1;
            }
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
    }, [handleAdd, handleDelete]);

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

        const { type = 'input', required = false, options = [] } = formProps;

        const placeholder = type === 'select' ? `请选择${title}` : `请输入${title}`;
        let elementWidth = required ? width - 18 : width - 8;
        if (type === 'switch') elementWidth = 'auto';
        if (!elementWidth) elementWidth = '100%';
        const isInput = ['input'].includes(type);

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

                if (type === 'tags') {
                    return (
                        <div className={c(s.element, required && s.required)}>
                            <FormItem
                                {...formProps}
                                name={name}
                                style={{ width: elementWidth }}
                                rules={[{ required, message: `${placeholder}!` }]}
                            >
                                <OptionsTag
                                    options={options}
                                />
                            </FormItem>
                        </div>
                    );
                }

                const extraProps = {};
                if (isInput) {
                    const { inputColumnIndex: columnIndex } = column;
                    extraProps.tabIndex = totalRow * columnIndex + index;
                    const options = {
                        tabIndex: extraProps.tabIndex,
                        columnIndex,
                        totalColumn: totalInputColumn,
                        totalRow,
                        rowIndex: index,
                        record,
                    };
                    extraProps.onKeyDown = e => handleKeyDown(e, options);
                }

                return (
                    <div className={c(s.element, required && s.required)}>
                        <FormItem
                            {...formProps}
                            {...extraProps}
                            name={name}
                            style={{ width: elementWidth }}
                            rules={[{ required, message: `${placeholder}!` }]}
                            placeholder={placeholder}
                        />
                    </div>
                );
            },
        };
    }, [handleKeyDown, totalRow]);

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
            <FormItem noStyle shouldUpdate>
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
            </FormItem>
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
        </Content>
    );
});
