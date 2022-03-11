import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import {
    Table,
    Button,
    Space,
    Input,
    Form,
    Switch,
    Select,
    InputNumber,
} from 'antd';
import c from 'classnames';
import { OptionsTag, Content, Operator, virtualTable } from 'src/components';
import { useHeight } from 'src/hooks';
import { ajax } from 'src/hocs';
import { getNextTabIndex } from 'src/commons';
import { DATA_TYPE_OPTIONS, FORM_ELEMENT_OPTIONS, VALIDATE_OPTIONS } from './constant';
import FastChineseModal from './FastChineseModal';

import s from './style.module.less';

const MyTable = React.memo(virtualTable((Table)));

export default React.memo(ajax()(function FieldTable(props) {
    console.log('FieldTable render');
    const {
        templateOptions,
        form,
        activeKey,
        dbInfoVisible,
        dbTypeOptions,
        onDataSourceChange,
        dataSource,
        onAdd,
        getNewRecord,
        files,
        filesVisible,
    } = props;

    const rootRef = useRef(null);
    const [height] = useHeight(rootRef, 50, [files, filesVisible]);
    const [fastVisible, setFastVisible] = useState(false);

    // 拖拽排序结束
    const handleSortEnd = useCallback((sortProps) => {
        let { oldIndex, newIndex } = sortProps;
        dataSource.splice(newIndex, 0, ...dataSource.splice(oldIndex, 1));
        onDataSourceChange([...dataSource]);
    }, [dataSource, onDataSourceChange]);

    // 删除行
    const handleDelete = useCallback((id) => {
        const nextDataSource = dataSource.filter(item => item.id !== id);
        onDataSourceChange(nextDataSource);
    }, [dataSource, onDataSourceChange]);

    // 自动填充中文或字段名
    const handleAutoName = useCallback(async (e) => {
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
        // 获取鼠标焦点所在input，数据更新后会失去焦点，要再次选中
        const currentTabIndex = e?.target?.getAttribute('tabindex');

        // 更新数据
        form.setFieldsValue({ dataSource });
        onDataSourceChange([...dataSource]);

        // 等待页面刷新之后，重新使输入框获取焦点
        if (currentTabIndex !== undefined) {
            setTimeout(() => {
                const input = document.querySelector(`input[tabindex='${currentTabIndex}']`);
                if (input) input.focus();
            });
        }

    }, [dataSource, form, props.ajax, onDataSourceChange]);

    // 键盘时间，使输入框获取焦点，上、下、左、右、回车
    const handleKeyDown = useCallback((e, options) => {
        const { record } = options;
        const { keyCode, ctrlKey, metaKey, shiftKey } = e;
        const enterKey = keyCode === 13;

        if ((ctrlKey || metaKey) && enterKey && !shiftKey) return handleAutoName(e);

        const result = getNextTabIndex(e, options);
        if (!result) return;
        const { isAdd, isDelete, nextTabIndex } = result;

        if (isDelete) {
            handleDelete(record.id);
        }

        if (isAdd) {
            onAdd(true);
        }

        // 等待新增行渲染
        setTimeout(() => {
            const nextInput = document.querySelector(`input[tabindex='${nextTabIndex}']`);
            if (!nextInput) return;
            nextInput.focus();
            nextInput.select();
        });
    }, [onAdd, handleDelete, handleAutoName]);

    // 选项列
    const optionColumns = useMemo(() => {
        return files
            .map(item => item.templateId)
            .filter(Boolean)
            .map((templateId) => {
                const template = templateOptions.find(item => item.value === templateId)?.record;
                const title = template?.shortName;
                const dataIndex = ['fileOptions', template?.id];
                const options = template?.fieldOptions || [];
                if (!options.length) return null;
                return {
                    title,
                    dataIndex,
                    formProps: {
                        type: 'tags',
                        options,
                    },
                };
            }).filter(Boolean);
    }, [files, templateOptions]);

    // 一共多少行
    const totalRow = dataSource.length;

    // 渲染表格中的表单项
    const formColumn = useCallback((column, totalInputColumn) => {
        if (!column?.formProps?.type) return column;

        // 只有新增一行之后才可以编辑的列
        const isNewEditFields = [
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

        const { type = 'input', required = false, options = [], placeholder: ph, ...otherFormProps } = formProps;

        const placeholder = ph || (type === 'select' ? `请选择${title}` : `请输入${title}`);
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
                                                record.fileOptions = options;
                                                form.setFields([{
                                                    name: ['dataSource', index, 'fileOptions'],
                                                    value: options,
                                                }]);
                                                onDataSourceChange([...dataSource]);
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
    }, [handleKeyDown, onDataSourceChange, totalRow, form, optionColumns, templateOptions, dataSource]);

    // Tab 页配置
    const tabColumns = useMemo(() => {
        const showDataType = (files || []).some(item => {
            const fileType = item?.targetPath?.split('.').pop();

            return !['jsx', 'js', 'vue', 'vux'].includes(fileType);
        });
        if (activeKey === 'files') {
            return [
                showDataType && { title: '数据类型', dataIndex: 'dataType', width: 150, formProps: { type: 'select', options: DATA_TYPE_OPTIONS } },
                { title: '表单类型', dataIndex: 'formType', width: 150, formProps: { type: 'select', options: FORM_ELEMENT_OPTIONS } },
                { title: '校验规则', dataIndex: 'validation', width: 250, formProps: { type: 'select', mode: 'multiple', options: VALIDATE_OPTIONS } },
                ...optionColumns,
            ].filter(Boolean);
        }
        if (activeKey === 'items') {
            return [
                { title: '描述', dataIndex: 'description', formProps: { type: 'input', placeholder: '请输入描述' } },
            ];
        }

        return [];
    }, [files, optionColumns, activeKey]);

    // 表格列
    const columns = useMemo(() => {
        let totalInputColumn = 0;
        const isItems = activeKey === 'items';
        return [
            {
                title: '操作', dataIndex: 'operator', width: 60,
                render: (value, record) => {
                    const { id } = record;
                    const items = [
                        {
                            label: '删除',
                            color: 'red',
                            confirm: {
                                title: '您确定删除吗？',
                                onConfirm: () => handleDelete(id),
                            },
                        },
                    ];
                    return <Operator items={items} />;
                },
            },
            { title: isItems ? '码值（value）' : '字段', dataIndex: 'name', width: isItems ? 300 : 150, formProps: { type: 'input', required: true } },
            {
                title: (
                    <Space>
                        <span>{isItems ? '展示（label）' : '中文名'}</span>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => setFastVisible(true)}
                        >
                            快速添加
                        </Button>
                    </Space>
                ),
                dataIndex: 'chinese', width: isItems ? 300 : 150, formProps: { type: 'input', required: true, placeholder: '请输入中文名' },
            },
            dbInfoVisible && { title: '注释', dataIndex: 'comment', width: 150 },
            dbInfoVisible && { title: '类型', dataIndex: 'type', width: 100, formProps: { type: 'select', required: true, options: dbTypeOptions } },
            dbInfoVisible && { title: '长度', dataIndex: 'length', width: 85, formProps: { type: 'number', min: 0, step: 1 } },
            dbInfoVisible && { title: '默认值', dataIndex: 'defaultValue', width: 100, formProps: { type: 'input' } },
            dbInfoVisible && { title: '可为空', dataIndex: 'isNullable', width: 60, formProps: { type: 'switch', options: [{ value: true, label: '是' }, { value: false, label: '否' }] } },
            ...tabColumns,
        ].filter(Boolean).map(column => {
            const { type } = column.formProps || {};
            if (type === 'input') {
                column.inputColumnIndex = totalInputColumn;
                totalInputColumn++;
            }
            return column;
        }).map(column => formColumn(column, totalInputColumn));
    }, [tabColumns, activeKey, dbInfoVisible, dbTypeOptions, handleDelete, formColumn]);

    // dataSource改变，将数据同步到form中
    useEffect(() => form.setFieldsValue({ dataSource }), [form, dataSource]);

    return (
        <Content ref={rootRef} className={s.fieldTableRoot}>
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
            <MyTable
                onSortEnd={handleSortEnd}
                size="small"
                columns={columns}
                pagination={false}
                dataSource={dataSource}
                rowKey="id"
                scroll={{ y: height }}
            />
            <FastChineseModal
                dataSource={dataSource}
                visible={fastVisible}
                onCancel={() => setFastVisible(false)}
                onOk={(values, replace) => {
                    const records = values.map((chinese, index) => {
                        const number = index + 1;
                        let name = number < 10 ? `0${number}` : `${number}`;
                        const isItems = activeKey === 'items';
                        name = isItems ? name : '';

                        return getNewRecord({ chinese, name });
                    });
                    const nextDataSource = replace ? records : [...dataSource, ...records];

                    onDataSourceChange(nextDataSource);

                    form.setFieldsValue({ dataSource: nextDataSource });
                    setFastVisible(false);
                }}
            />
        </Content>
    );
}));
