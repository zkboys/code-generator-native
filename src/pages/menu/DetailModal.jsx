import React, {useState, useEffect} from 'react';
import {Button, Descriptions} from 'antd';
import {ModalContent} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';

export default config({
    modal: {
        title: '详情',
        width: '70%',
        top: 50,
    },
})(function MenuEditModal(props) {
    const { record, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    // 初始化，查询详情数据
    useEffect(() => {
        (async () => {
            const res = await props.ajax.get('/menus', { id: record?.id }, [], { setLoading });
            setData(res || {});
        })();
    }, [props.ajax, record?.id]);

    return (
        <ModalContent
            bodyStyle={{ padding: 0 }}
            loading={loading}
            footer={<Button onClick={onCancel}>关闭</Button>}
        >
            <Descriptions bordered size="small" labelStyle={{ width: 150 }}>
                <Descriptions.Item label="基本路径">{data.basePath ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="偶像">{data.icon ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="顺序">{data.order ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="父母亲">{data.parentId ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="路径">{data.path ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="目标">{data.target ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="文本">{data.text ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="菜单类型">{data.type ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="网址">{data.url ?? '-'}</Descriptions.Item>
            </Descriptions>
        </ModalContent>
    );
});