import React, { useCallback } from 'react';
import { Operator, Table, tableEditable, tableRowDraggable } from '@ra-lib/admin';
import { Button } from 'antd';
import { v4 as uuid } from 'uuid';
import { OptionsTag } from 'src/components';

const EditTable = tableEditable(tableRowDraggable(Table));

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
        options = [],
        fitHeight = true,
    } = props;

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

    const handleKeyDown = useCallback((e, tabIndex) => {
        const { keyCode, ctrlKey, shiftKey, altKey, metaKey } = e;

        if (ctrlKey || shiftKey || altKey || metaKey) return;

        const length = dataSource?.length || 0;

        const isUp = keyCode === 38;
        const isRight = keyCode === 39;
        const isDown = keyCode === 40;
        const isLeft = keyCode === 37;
        const isEnter = keyCode === 13;

        let nextTabIndex;

        if (isDown || isEnter) {
            if (tabIndex === length || tabIndex === length * 2) {
                nextTabIndex = undefined;
            } else {
                nextTabIndex = tabIndex + 1;
            }
        }

        if (isUp) nextTabIndex = tabIndex - 1;

        if (isLeft) {
            if (tabIndex <= length) {
                nextTabIndex = tabIndex - 1 <= 0 ? undefined : tabIndex - 1 + length;
            } else {
                nextTabIndex = tabIndex - length;
            }
        }

        if (isRight) {
            if (tabIndex <= length) {
                nextTabIndex = tabIndex + length;
            } else {
                nextTabIndex = tabIndex - length === length ? undefined : tabIndex - length + 1;
            }
        }

        const nextInput = document.querySelector(`input[tabindex='${nextTabIndex}']`);

        if (nextInput) {
            // 确保方向键也可以选中
            setTimeout(() => {
                nextInput.focus();
                nextInput.select();
            });
        } else if (isEnter || isDown || isRight) {
            // 新增一行
            handleAdd(true);

            // 等待新增行渲染完成，新增行 input 获取焦点
            setTimeout(() => {
                let ti = tabIndex;

                if (isRight) ti = tabIndex - length;

                if ((isDown || isEnter) && tabIndex === length * 2) ti = tabIndex + 1;

                handleKeyDown({ keyCode: 13 }, ti);
            });
        }
    }, [dataSource, handleAdd]);

    const handleDelete = useCallback((id) => {
        const nextDataSource = dataSource.filter(item => item.id !== id);
        onChange && onChange(nextDataSource);
    }, [dataSource, onChange]);

    const handleRecordChange = useCallback((record, key, value) => {
        record[key] = value;

        onChange && onChange([...dataSource]);
    }, [dataSource, onChange]);

    const columns = [
        { title: '注释', dataIndex: 'comment', width: 150 },
        {
            title: '中文名', dataIndex: 'chinese', width: 190,
            formProps: (record, index) => {
                const tabIndex = index + 1; // index * 2 + 1
                return {
                    label: ' ',
                    colon: false,
                    style: { width: 150 },
                    required: true,
                    tabIndex,
                    onFocus: e => e.target.select(),
                    onBlur: (e) => handleRecordChange(record, 'chinese', e.target.value),
                    onKeyDown: (e) => handleKeyDown(e, tabIndex),
                };
            },
        },
        {
            title: '列名', dataIndex: 'field', width: 190,
            formProps: (record, index) => {
                if (record.isTable) return null;
                const length = dataSource?.length || 0;

                const tabIndex = index + length + 1; // index * 2 + 2;
                return {
                    label: ' ',
                    colon: false,
                    style: { width: 150 },
                    required: true,
                    tabIndex,
                    onFocus: e => e.target.select(),
                    onBlur: (e) => handleRecordChange(record, 'field', e.target.value),
                    onKeyDown: (e) => handleKeyDown(e, tabIndex),
                };
            },
        },
        {
            title: '表单类型', dataIndex: 'formType', width: 190,
            formProps: (record) => {
                if (record.isTable) return null;

                return {
                    label: ' ',
                    colon: false,
                    style: { width: 150 },
                    type: 'select',
                    showSearch: true,
                    required: true,
                    options: FORM_ELEMENT_OPTIONS,
                    onChange: (formType) => handleRecordChange(record, 'formType', formType),
                };
            },
        },
        {
            title: '选项', dataIndex: 'operator',
            render: (value, record) => {
                return (
                    <OptionsTag
                        options={options}
                        value={record.options || []}
                        onChange={value => handleRecordChange(record, 'options', value)}
                    />
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

    const handleSortEnd = useCallback(({ newIndex, oldIndex }) => {
        dataSource.splice(newIndex - 1, 0, ...dataSource.splice(oldIndex - 1, 1));
        onChange && onChange([...dataSource]);
    }, [dataSource, onChange]);

    return (
        <EditTable
            fitHeight={fitHeight}
            otherHeight={80}
            onSortEnd={handleSortEnd}
            serialNumber
            columns={columns}
            dataSource={dataSource}
            rowKey="id"
            size="small"
            footer={() => {
                return (
                    <Button
                        type={'dashed'}
                        block
                        onClick={() => handleAdd(true)}
                    >
                        添加一行
                    </Button>
                );
            }}
        />
    );
}
