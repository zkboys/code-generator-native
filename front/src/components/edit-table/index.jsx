import React, { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { Table, tableRowDraggable } from '@ra-lib/admin';
import { Button, Form } from 'antd';
import { OptionsTag } from 'src/components';
import CellFormItem from './CellFormItem';
import { getCursorPosition } from 'src/commons';

const RowDraggableTable = tableRowDraggable(Table);

const FIELD_NAME = 'dataSource';

export default function EditTable(props) {
    const {
        dataSource,
        onChange,
        fitHeight = true,
        otherHeight = 0,
        columns,
        onAdd,
        ...others
    } = props;

    const [form] = Form.useForm();
    const [showFormIndex, setShowFormIndex] = useState([0]);
    // 失去焦点延迟句柄
    const blurStRef = useRef(0);

    // dataSource改变，同步到form中
    useEffect(() => form.setFieldsValue({ [FIELD_NAME]: dataSource }), [form, dataSource]);

    // 拖拽排序结束，交换位置
    const handleSortEnd = useCallback(({ oldIndex, newIndex }) => {
        dataSource.splice(newIndex - 1, 0, ...dataSource.splice(oldIndex - 1, 1));
        onChange && onChange([...dataSource]);
    }, [dataSource, onChange]);

    // 键盘时间，使输入框获取焦点，上、下、左、右、回车
    const handleKeyDown = useCallback((e, tabIndex, columnIndex, totalColumn, totalRow) => {
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

        const columnStartTabIndex = columnIndex * totalRow + 1;
        const columnEndTabIndex = (columnIndex + 1) * totalRow;

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
                    nextTabIndex = totalRow + 1;
                } else {
                    // 选中下一行第一个
                    nextTabIndex = tabIndex - totalRow * columnIndex + 1;
                }
            } else {
                // 选择右侧一个
                nextTabIndex = tabIndex + totalRow;
            }
        }

        if (isDown) {
            if (tabIndex === columnEndTabIndex) {
                isAdd = true;
                nextTabIndex = tabIndex + columnIndex + 1;
            } else {
                nextTabIndex = tabIndex + 1;
            }
        }

        if (isLeft) {
            // 左上角
            if (tabIndex === columnStartTabIndex && columnIndex === 0) return;

            // 左侧第一列继续左移动，选中上一行最后一个
            if (columnIndex === 0) nextTabIndex = (tabIndex - 1) + totalRow * (totalColumn - 1);

            // 选择前一个
            if (columnIndex !== 0) nextTabIndex = tabIndex - totalRow;
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
    }, [onAdd]);

    // 输入框获取焦点，选中内容
    const handleFocus = useCallback((e, index) => {
        clearTimeout(blurStRef.current);
        e.target.select();
        setShowFormIndex([index - 1, index, index + 1]);
    }, []);

    // 输入框失去焦点，延迟切换为展示内容
    const handleBlur = useCallback((e, index) => {
        blurStRef.current = setTimeout(() => {
            setShowFormIndex([]);
        });
    }, []);

    // 表格渲染表单组件
    const _columns = useMemo(() => {
        // 标记当前未第几列
        let columnIndex = 0;
        // 一共多少行
        const totalRow = dataSource.length;

        const inputColumn = (colOptions) => {
            const { title, dataIndex, required } = colOptions;
            const _columnIndex = columnIndex++;

            return {
                ...colOptions,
                render: (value, record, index) => {
                    const tabIndex = totalRow * _columnIndex + index + 1;
                    const showForm = showFormIndex.includes(index);

                    return (
                        <CellFormItem
                            form={form}
                            showForm={showForm}
                            value={value}
                            type="input"
                            name={[FIELD_NAME, index, dataIndex]}
                            required={required}
                            tabIndex={tabIndex}
                            onKeyDown={e => handleKeyDown(e, tabIndex, _columnIndex, columnIndex, totalRow)}
                            onFocus={e => handleFocus(e, index)}
                            onBlur={e => handleBlur(e, index)}
                            placeholder={`请输入${title}`}
                        />
                    );
                },
            };
        };

        const selectColumn = (colOptions) => {
            const { options, title, dataIndex, required } = colOptions;

            return {
                ...colOptions,
                render: (value, record, index) => {
                    return (
                        <CellFormItem
                            form={form}
                            name={[FIELD_NAME, index, dataIndex]}
                            renderCell={value => options.find(item => item.value === value)?.label}
                            type="select"
                            options={options}
                            required={required}
                            placeholder={`请选择${title}`}
                        />
                    );
                },
            };
        };


        const tagsColumn = (colOptions) => {
            const { options, required } = colOptions;

            return {
                ...colOptions,
                render: (value, record, index) => {
                    return (
                        <CellFormItem
                            form={form}
                            type="tags"
                            name={[FIELD_NAME, index, 'options']}
                            options={options}
                            renderCell={value => <OptionsTag value={value} options={options} />}
                            required={required}
                        >
                            <OptionsTag options={options} />
                        </CellFormItem>
                    );
                },
            };
        };

        return columns.map(item => {
            const { type, ...others } = item;
            if (type === 'input') return inputColumn(others);
            if (type === 'select') return selectColumn(others);
            if (type === 'tags') return tagsColumn(others);

            return others;
        });
    }, [columns, dataSource.length, form, handleBlur, handleFocus, handleKeyDown, showFormIndex]);

    return (
        <Form
            layout={'inline'}
            form={form}
            onValuesChange={() => {
                // 不改变DataSource引用方式，同步数据，否则输入框会失去焦点
                const newDataSource = form.getFieldValue(FIELD_NAME);
                newDataSource.forEach((item, index) => {
                    Object.entries(item).forEach(([key, value]) => {
                        dataSource[index][key] = value;
                    });
                });
                onChange && onChange(dataSource);
            }}
        >
            <RowDraggableTable
                fitHeight={fitHeight}
                otherHeight={otherHeight}
                onSortEnd={handleSortEnd}
                serialNumber
                columns={_columns}
                dataSource={dataSource}
                rowKey="id"
                size="small"
                footer={() => {
                    return (
                        <Button
                            type={'dashed'}
                            block
                            onClick={() => onAdd(true)}
                        >
                            添加一行
                        </Button>
                    );
                }}
                {...others}
            />
        </Form>
    );
}
