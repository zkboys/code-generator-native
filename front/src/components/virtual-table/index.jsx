import React, {useCallback, useState, useRef} from 'react';
import {ConfigProvider} from 'antd';
import {FixedSizeList as List} from 'react-window';
import ResizeObserver from 'rc-resize-observer';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import classNames from 'classnames';
import {getScrollBarWidth} from 'src/commons';
import s from './style.module.less';

const SCROLL_BAR_WIDTH = getScrollBarWidth();
const ROW_HEIGHT = 65;

const RowElement = SortableElement((props) => props.children);
const BodyContainer = SortableContainer(props => props.children);

export default Table => {
    return props => {
        const { columns, scroll, className, onSortEnd } = props;
        const [tableWidth, setTableWidth] = useState(0);
        const listRef = useRef(null);

        // 没有设置宽度的列数量
        const noWidthColumnCount = columns.filter(({ width }) => !width).length;
        // 已知设置所有宽度总和
        const totalWidth = columns.reduce((prev, { width = 0 }) => prev + width, 0);

        // 计算未指定宽度列的宽度
        const mergedColumns = columns.map((column) => {
            if (column.width) return column;

            // 平均分配表格的剩余宽度
            let width = (tableWidth - totalWidth) / noWidthColumnCount;

            return { ...column, width };
        });

        const handleSortEnd = useCallback((sortProps) => {
            let { oldIndex, newIndex } = sortProps;

            if (oldIndex === newIndex) return;

            onSortEnd && onSortEnd(sortProps);
        }, [onSortEnd]);

        const renderVirtualList = (dataSource) => {
            return (
                <BodyContainer
                    onSortEnd={handleSortEnd}
                    shouldCancelStart={(e) => {
                        const { tagName, classList } = e.target;
                        if (['A', 'INPUT', 'SELECT', 'BUTTON', 'TEXTAREA', 'OPTION'].includes(tagName)) return true;
                        return String(classList).includes('select-selection');
                    }}
                    helperClass={s.row}
                >
                    <ConfigProvider getPopupContainer={() => listRef.current?._outerRef}>
                        <List
                            ref={listRef}
                            height={scroll.y}
                            itemCount={dataSource.length}
                            itemSize={ROW_HEIGHT}
                            width={tableWidth}
                        >
                            {({ index: rowIndex, style }) => {
                                return (
                                    <RowElement index={rowIndex}>
                                        <div className={s.row} style={style}>
                                            {mergedColumns.map((column, columnIndex) => {
                                                const record = dataSource[rowIndex];
                                                const value = Array.isArray(column.dataIndex)
                                                    ? column.dataIndex.reduce((prev, key) => (prev[key] || {}), record)
                                                    : record[column.dataIndex];
                                                const render = column.render || ((value) => value);
                                                const width = columnIndex === columns.length - 1 ? column.width - SCROLL_BAR_WIDTH : column.width;

                                                const val = render(value, record, rowIndex);

                                                return (
                                                    <div key={column.key || column.dataIndex} className={s.cell} style={{ width }}>
                                                        {typeof val === 'string' ? (
                                                            <div className={s.text} title={val}>
                                                                {render(value, record, rowIndex)}
                                                            </div>
                                                        ) : val}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </RowElement>
                                );
                            }}
                        </List>
                    </ConfigProvider>
                </BodyContainer>
            );
        };

        return (
            <ResizeObserver onResize={({ width }) => setTableWidth(width)}>
                <Table
                    {...props}
                    className={classNames(s.root, className)}
                    columns={mergedColumns}
                    components={{ body: renderVirtualList }}
                />
            </ResizeObserver>
        );
    };
}
