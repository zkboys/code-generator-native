import React, {useState, useEffect} from 'react';
import {Button, Descriptions, Modal} from 'antd';
import {ModalContent} from '@ra-lib/adm';
import config from 'src/commons/config-hoc';

export default config({
    modalFunction: true,
})(function AccountEditModal(props) {
    const { record, onCancel, commonProps } = props;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    // 初始化，查询详情数据
    useEffect(() => {
        (async () => {
            const res = await props.ajax.get('/accounts', { id: record?.id }, { setLoading });
            setData(res || {});
        })();
    }, [props.ajax, record?.id]);

    return (
        <Modal
            {...commonProps}
            title="详情"
        >
            <ModalContent
                loading={loading}
                footer={<Button onClick={onCancel}>关闭</Button>}
            >
                <Descriptions bordered size="small" labelStyle={{ width: 150 }}>
                    <Descriptions.Item label="密码">{data.password ?? '-'}</Descriptions.Item>
                    <Descriptions.Item label="关联的用户id">{data.userId ?? '-'}</Descriptions.Item>
                    <Descriptions.Item label="用户名">{data.username ?? '-'}</Descriptions.Item>
                </Descriptions>
            </ModalContent>
        </Modal>
    );
});