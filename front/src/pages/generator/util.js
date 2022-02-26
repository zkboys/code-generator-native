import React from 'react';
import {Tag} from 'antd';
import s from './style.less';

export const DB_URL_STORE_KEY = 'GEN_DB_URL';
export const SWAGGER_URL_STORE_KEY = 'GEN_SWAGGER_URL';

export function getLabel(str) {
    if (!str) return '未定义';

    if ((str.endsWith('id') || str.endsWith('Id')) && str.length > 2) return str.slice(0, -2);

    return str;
}

export function getFormElementName({ label = '', fields = [] }) {
    const numbers = fields.map(item => {
        const str = item.replace('field', '') || '';
        return window.parseInt(str, 10) || 0;
    });

    const max = numbers?.length ? Math.max(...numbers) : 0;

    // FIXME 根据label 翻译，或者查库等手段 自动生成field

    return `field${max + 1}`;
}

export function getFormElementType({ oType = 'string', label = '' }) {
    let type = 'input';

    // FIXME 完善更多类型
    if (oType === 'array') type = 'select';

    if (label.startsWith('是否')) type = 'switch';

    if (label.startsWith('密码') || label.endsWith('密码')) type = 'password';

    if (label.includes('电话') || label.includes('手机')) type = 'mobile';

    if (label.includes('邮箱')) type = 'email';

    if (label.includes('时间') || label.includes('日期')) type = 'date';

    if (label.includes('描述') || label.includes('备注') || label.includes('详情')) type = 'textarea';

    return type;
}

export function getTables(res) {
    const tables = res.tables || {};
    const ignoreFields = res.ignoreFields || [];
    const selectedRowKeys = [];

    const dataSource = tables.map(({ name: tableName, comment, columns }) => {
        const id = tableName;
        selectedRowKeys.push(id);
        let queryCount = 0;
        return {
            id,
            isTable: true,
            tableName,
            comment,
            query: true,
            selectable: true,
            pagination: true,
            serialNumber: true,
            add: true,
            operatorEdit: true,
            operatorDelete: true,
            batchDelete: true,

            export: true,
            import: true,
            children: columns.map(it => {
                const { camelCaseName, name, type, isNullable, comment, chinese, length } = it;
                const id = `${tableName}-${name}`;
                selectedRowKeys.push(id);

                const isIgnore = ignoreFields.includes(name);

                // 初始化时 默认选中两个作为条件
                let isQuery = !isIgnore;
                if (isQuery) queryCount++;
                if (queryCount > 2) isQuery = false;

                const formType = getFormElementType({ oType: type, label: chinese });

                return {
                    id,
                    tableName,
                    field: camelCaseName,
                    comment: comment,
                    chinese: (chinese || camelCaseName).trim(),
                    name,
                    length,
                    type,
                    formType,
                    isNullable,
                    isColumn: !isIgnore,
                    isQuery,
                    isForm: !isIgnore,
                    isExport: true,
                    isImport: true,
                    isIgnore,
                };
            }),
        };
    });

    return { dataSource, selectedRowKeys };
}

export function renderTags(record, onClick = () => undefined) {
    if (!record) return;

    const configMap = {
        query: '查询条件 gold',
        selectable: '可选中 lime',
        pagination: '分页 green',
        serialNumber: '序号 cyan',
        add: '添加 blue',
        operatorEdit: '编辑 geekblue',
        operatorDelete: '删除 red',
        batchDelete: '批量删除 red',
        export: '导出 purple',
        import: '导入 magenta',
    };

    return Object.entries(configMap).map(([key, value]) => {
        const enabled = record[key];
        let [label, color] = value.split(' ');
        if (!enabled) color = '#ccc';

        return (
            <Tag
                key={label}
                color={color}
                className={s.tag}
                onClick={() => {
                    record[key] = !record[key];
                    onClick(key);
                }}
            >
                {label}
            </Tag>
        );
    });
}

export function renderFieldTags(record, onClick = () => undefined) {
    const labelMap = {
        isColumn: '表格 orange',
        isQuery: '条件 green',
        isForm: '表单 purple',
        isExport: '导出 purple',
        isImport: '导入 magenta',
    };
    return Object.entries(record).map(([key, val]) => {
        const labelRecord = labelMap[key];
        if (!labelRecord) return null;
        const [label, color] = labelRecord.split(' ');

        return (
            <Tag
                key={key}
                color={val ? color : '#ccc'}
                className={s.tag}
                onClick={() => {
                    record[key] = !record[key];
                    onClick(key);
                }}
            >
                {label}
            </Tag>
        );
    });
}
