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
})(function SubAppEditModal(props) {
    const { record, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    // 初始化，查询详情数据
    useEffect(() => {
        (async () => {
            const res = await props.ajax.get('/sub_apps', { id: record?.id }, [], { setLoading });
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
                <Descriptions.Item label="主动规则">{data.activeRule ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="备注信息">{data.description ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="进入">{data.entry ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="名称">{data.name ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="一边">{data.side ?? '-'}</Descriptions.Item>
            </Descriptions>
        </ModalContent>
    );
});