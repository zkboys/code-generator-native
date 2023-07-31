import React, {useCallback, useState, useEffect} from 'react';
import {Form, Row, Col, Modal} from 'antd';
import {ModalContent, FormItem} from '@ra-lib/adm';
import config from 'src/commons/config-hoc';

export default config({
    modalFunction: true,
})(function AccountEditModal(props) {
    const { record, isEdit,  close, onOk, onCancel, commonProps } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    
    const handleSubmit = useCallback(async (values) => {
        const params = {
            ...values,
        };
        if (isEdit) {
            await props.ajax.put('/accounts', params, { setLoading, successTip: '修改成功！' });
        } else {
            await props.ajax.post('/accounts', params, { setLoading, successTip: '创建成功！' });
        }
        
        onOk && onOk();
        close();
    }, [isEdit, close, onOk, props.ajax]);

    // 初始化，查询详情数据
    useEffect(() => {
        if (!isEdit) return;
        (async () => {
            const res = await props.ajax.get('/accounts', { id: record?.id }, { setLoading });
            form.setFieldsValue(res || {});
        })();
    }, [isEdit, form, props.ajax, record?.id]);

    const layout = { labelCol: { flex: '100px' } };
    return (
        <Modal
            {...commonProps}
            title={record ? '修改' : '添加'}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                {...layout}
            >
                <ModalContent
                    loading={loading}
                    okText="保存"
                    okHtmlType="submit"
                    onCancel={onCancel}
                >
                    {isEdit ? <FormItem hidden name="id"/> : null}
                    <Row>
                        <Col span={12}>
                            <FormItem
                                type="input"
                                label="密码"
                                name="password"
                                maxLength={100}
                            />        
                        </Col>
                        <Col span={12}>
                            <FormItem
                                type="input"
                                label="关联的用户id"
                                name="userId"
                                maxLength={36}
                            />        
                        </Col>
                        <Col span={12}>
                            <FormItem
                                type="input"
                                label="用户名"
                                name="username"
                                maxLength={30}
                            />        
                        </Col>
                    </Row>
                </ModalContent>
            </Form>
        </Modal>
    );
});