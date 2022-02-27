import React, { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { Operator, Table, tableRowDraggable } from '@ra-lib/admin';
import { Button, Form } from 'antd';
import { v4 as uuid } from 'uuid';
import { OptionsTag } from 'src/components';
import CellFormItem from './CellFormItem';
import { getCursorPosition } from 'src/commons';

const EditTable = tableRowDraggable(Table);

const FORM_ELEMENT_OPTIONS = [
    { value: 'input', label: '输入框' },
    { value: 'hidden', label: '隐藏框' },
    { value: 'number', label: '数字框' },
    { value: 'textarea', label: '文本框' },
    { value: 'password', label: '密码框' },
    { value: 'mobile', label: '手机输入框' },
    { value: 'email', label: '邮箱输入框' },
    { value: 'select', label: '下拉框' },
    { value: 'select-tree', label: '下拉树' },
    { value: 'checkbox', label: '复选框' },
    { value: 'checkbox-group', label: '复选框组' },
    { value: 'radio', label: '单选框' },
    { value: 'radio-group', label: '单选框组' },
    { value: 'radio-button', label: '单选按钮组' },
    { value: 'switch', label: '切换按钮' },
    { value: 'date', label: '日期选择框' },
    { value: 'time', label: '时间选择框' },
    { value: 'moth', label: '月份选择框' },
    { value: 'date-time', label: '日期+时间选择框' },
    { value: 'date-range', label: '日期区间选择框' },
    { value: 'cascader', label: '级联下拉框' },
    { value: 'transfer', label: '穿梭框' },
];

export default function FieldTable(props) {
    const {
        dataSource,
        onChange,
        onRecordChange,
        options = [],
        fitHeight = true,
        otherHeight = 0,
        footer,
    } = props;

    const [form] = Form.useForm();

    const [showFormIndex, setShowFormIndex] = useState([0]);

    const handleAdd = useCallback((append) => {
        const length = dataSource.length;
        const field = `field${length + 1}`;
        const id = uuid();

        const newRecord = {
            id,
            field,
            comment: '新增列',
            chinese: '新增列',
            name: field,

            type: 'string',
            formType: 'input',
            length: 0,
            isNullable: true,
            options: [...options],
        };

        append ? dataSource.push(newRecord) : dataSource.unshift(newRecord);
        onChange && onChange([...dataSource]);
    }, [dataSource, onChange, options]);

    const handleKeyDown = useCallback((e, tabIndex, columnNumber, totalColumn) => {
        const { keyCode, ctrlKey, shiftKey, altKey, metaKey } = e;

        if (ctrlKey || shiftKey || altKey || metaKey) return;

        const isUp = keyCode === 38;
        const isRight = keyCode === 39;
        const isDown = keyCode === 40 || keyCode === 13;
        const isLeft = keyCode === 37;

        // 移动光标
        const cursorPosition = getCursorPosition(e.target);
        if (isLeft && !cursorPosition.start) return;
        if (isRight && !cursorPosition.end) return;

        const totalRow = dataSource.length;
        const columnStartTabIndex = columnNumber * totalRow + 1;
        const columnEndTabIndex = (columnNumber + 1) * totalRow;

        let nextTabIndex;
        let isAdd;


        if (isUp) {
            // 到顶了
            if (tabIndex === columnStartTabIndex) return;

            nextTabIndex = tabIndex - 1;
        }

        if (isRight) {
            // 右侧
            if (columnNumber === totalColumn - 1) {
                // 右下角
                if (tabIndex === columnEndTabIndex) {
                    isAdd = true;
                    nextTabIndex = totalRow + 1;
                } else {
                    // 选中下一行第一个
                    nextTabIndex = tabIndex - totalRow * columnNumber + 1;
                }
            } else {
                // 选择右侧一个
                nextTabIndex = tabIndex + totalRow;
            }
        }

        if (isDown) {
            if (tabIndex === columnEndTabIndex) {
                isAdd = true;
                nextTabIndex = tabIndex + columnNumber + 1;
            } else {
                nextTabIndex = tabIndex + 1;
            }
        }

        if (isLeft) {
            // 左上角
            if (tabIndex === columnStartTabIndex && columnNumber === 0) return;

            // 左侧第一列继续左移动，选中上一行最后一个
            if (columnNumber === 0) nextTabIndex = (tabIndex - 1) + totalRow * (totalColumn - 1);

            // 选择前一个
            if (columnNumber !== 0) nextTabIndex = tabIndex - totalRow;
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

    }, [dataSource, handleAdd]);

    const handleDelete = useCallback((id) => {
        const nextDataSource = dataSource.filter(item => item.id !== id);
        onChange && onChange(nextDataSource);
    }, [dataSource, onChange]);

    useEffect(() => {
        form.setFieldsValue({ dataSource });
    }, [form, dataSource]);

    const blurStRef = useRef(0);

    const handleFocus = useCallback((e, index) => {
        clearTimeout(blurStRef.current);
        e.target.select();
        setShowFormIndex([index - 1, index, index + 1]);
    }, []);

    const handleBlur = useCallback((e, index) => {
        blurStRef.current = setTimeout(() => {
            setShowFormIndex([]);
        });
    }, []);

    const columns = useMemo(() => {
        let columnIndex = 0;
        const rowCount = dataSource.length;

        const inputColumn = (colOptions) => {
            const { title, dataIndex } = colOptions;
            const _columnIndex = columnIndex++;

            return {
                ...colOptions,
                render: (value, record, index) => {
                    const tabIndex = rowCount * _columnIndex + index + 1;
                    const showForm = showFormIndex.includes(index);

                    return (
                        <CellFormItem
                            form={form}
                            showForm={showForm}
                            value={value}
                            type="input"
                            name={['dataSource', index, dataIndex]}
                            required
                            tabIndex={tabIndex}
                            onKeyDown={e => handleKeyDown(e, tabIndex, _columnIndex, columnIndex)}
                            onFocus={e => handleFocus(e, index)}
                            onBlur={e => handleBlur(e, index)}
                            placeholder={`请输入${title}`}
                        />
                    );
                },
            };
        };

        const selectColumn = (colOptions) => {
            const { options, title, dataIndex } = colOptions;

            return {
                ...colOptions,
                render: (value, record, index) => {
                    return (
                        <CellFormItem
                            form={form}
                            name={['dataSource', index, dataIndex]}
                            renderCell={value => options.find(item => item.value === value)?.label}
                            type="select"
                            options={options}
                            required
                            placeholder={`请选择${title}`}
                        />
                    );
                },
            };
        };
        return [
            { title: '注释', dataIndex: 'comment', width: 150 },
            inputColumn({ title: '中文名', dataIndex: 'chinese', width: 190 }),
            inputColumn({ title: '列名', dataIndex: 'field', width: 190 }),
            selectColumn({ title: '表单类型', dataIndex: 'formType', width: 190, options: FORM_ELEMENT_OPTIONS }),
            inputColumn({ title: '列名2', dataIndex: 'field2', width: 190 }),
            {
                title: '选项', dataIndex: 'options',
                render: (value, record, index) => {
                    return (
                        <CellFormItem
                            form={form}
                            type="tags"
                            name={['dataSource', index, 'options']}
                            options={options}
                            renderCell={value => <OptionsTag value={value} options={options} />}
                        >
                            <OptionsTag options={options} />
                        </CellFormItem>
                    );
                },
            },
            {
                title: '操作', dataIndex: 'operator', width: 100,
                render: (value, record) => {
                    const { id, chinese } = record;
                    const items = [
                        {
                            label: '删除',
                            color: 'red',
                            confirm: {
                                title: `您确定删除"${chinese}"?`,
                                onConfirm: () => handleDelete(id),
                            },
                        },
                    ];

                    return <Operator items={items} />;
                },
            },
        ];
    }, [dataSource?.length, form, handleBlur, handleDelete, handleFocus, handleKeyDown, options, showFormIndex]);

    const handleSortEnd = useCallback(({ oldIndex, newIndex }) => {
        dataSource.splice(newIndex - 1, 0, ...dataSource.splice(oldIndex - 1, 1));
        onChange && onChange([...dataSource]);
    }, [dataSource, onChange]);

    return (
        <Form layout={'inline'} form={form} onValuesChange={onRecordChange}>
            <EditTable
                fitHeight={fitHeight}
                otherHeight={otherHeight}
                onSortEnd={handleSortEnd}
                serialNumber
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                size="small"
                footer={footer || (() => {
                    return (
                        <Button
                            type={'dashed'}
                            block
                            onClick={() => handleAdd(true)}
                        >
                            添加一行
                        </Button>
                    );
                })}
            />
        </Form>
    );
}
