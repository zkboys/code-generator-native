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
})(function UserEditModal(props) {
    const { record, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    // 初始化，查询详情数据
    useEffect(() => {
        (async () => {
            const res = await props.ajax.get('/users', { id: record?.id }, [], { setLoading });
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
                <Descriptions.Item label="账户">{data.account ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="阿凡达">{data.avatar ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="电子邮件">{data.email ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="使可能">{data.enable ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="性别">{data.gender ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="是管理员吗">{data.isAdmin ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="工作编号">{data.jobNumber ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="可移动的">{data.mobile ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="名称">{data.name ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="暗语">{data.password ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="位置">{data.position ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="二维码">{data.qrCode ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="状态">{data.status ?? '-'}</Descriptions.Item>
            </Descriptions>
        </ModalContent>
    );
});