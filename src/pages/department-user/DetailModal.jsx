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
})(function DepartmentUserEditModal(props) {
    const { record, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    // 初始化，查询详情数据
    useEffect(() => {
        (async () => {
            const res = await props.ajax.get('/department_users', { id: record?.id }, [], { setLoading });
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
                <Descriptions.Item label="部门">{data.departmentId ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="是领导者吗">{data.isLeader ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="顺序">{data.order ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="使用者">{data.userId ?? '-'}</Descriptions.Item>
            </Descriptions>
        </ModalContent>
    );
});