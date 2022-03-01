import React, { useCallback, useMemo, useState } from 'react';
import { Tabs, Table } from 'antd';
import { Operator } from '@ra-lib/admin';
// import rowDraggable from './row-draggable';
import virtualTable from './virtual-table';
import s from './style.less';

const MyTable = virtualTable((Table));

const { TabPane } = Tabs;

// TODO 可编辑、拖拽排序、固定高度、虚拟表格
export default function FieldTable(props) {
    console.log('FieldTable render');
    const [dataSource, setDataSource] = useState(Array.from({ length: 5000 }).map((item, index) => {
        const number = index + 1;
        return {
            id: `id-${number}`,
            comment: `comment-${number}`,
            name: `name-${number}`,
            type: `type-${number}`,
            length: number * 100,
            defaultValue: `value-${number}`,
            nullable: '是',
            chinese: `chinese-${number}`,
            validation: '如果很长的文字怎么办呢？，就是很长的，很长的呢',
        };
    }));

    const [activeKey, setActiveKey] = useState('type');
    const handleDelete = useCallback(async (id) => {
        // TODO
    }, []);

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
                columns: [
                    { title: 'controller', dataIndex: 'validation' },
                    { title: 'service', dataIndex: 'validation' },
                    { title: 'list-page', dataIndex: 'validation' },
                    { title: 'edit-modal', dataIndex: 'validation' },
                ],
            },
        ];
    }, []);

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
                    return <Operator items={items} />;
                },
            },
            { title: '字段', dataIndex: 'name', width: 150 },
            { title: '备注', dataIndex: 'comment', width: 150 },
            !isOption && { title: '类型', dataIndex: 'type', width: 80 },
            !isOption && { title: '长度', dataIndex: 'length', width: 50 },
            !isOption && { title: '默认值', dataIndex: 'defaultValue', width: 80 },
            !isOption && { title: '可为空', dataIndex: 'nullable', width: 60 },
            ...tabColumns,
        ].filter(Boolean);
    }, [activeKey, handleDelete, tabPotions]);

    const handleSortEnd = useCallback((sortProps) => {
        let { oldIndex, newIndex } = sortProps;
        console.log(oldIndex, newIndex);
        dataSource.splice(newIndex, 0, ...dataSource.splice(oldIndex, 1));
        setDataSource([...dataSource]);
    }, [dataSource]);

    return (
        <div className={s.root}>
            <Tabs activeKey={activeKey} onChange={setActiveKey}>
                {tabPotions.map(item => <TabPane key={item.key} tab={item.tab} />)}
            </Tabs>
            <MyTable
                onSortEnd={handleSortEnd}
                size="small"
                columns={columns}
                pagination={false}
                dataSource={dataSource}
                rowKey="id"
                scroll={{ y: 500 }}
            />
        </div>
    );
}
