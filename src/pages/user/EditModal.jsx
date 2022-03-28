import React, {useCallback, useState, useEffect} from 'react';
import {Form, Row, Col} from 'antd';
import {ModalContent, FormItem, validateRules} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';

export default config({
    modal: {
        title: (props) => {
            if(props.isEdit) return '修改';
            return '创建';
        },
        width: '70%',
        top: 50,
    },
})(function UserEditModal(props) {
    const { record, isEdit, onOk } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    
    

    const handleSubmit = useCallback(async (values) => {
        const params = {
            ...values,
        };
        if (isEdit) {
            await props.ajax.put('/users', params, { setLoading, successTip: '修改成功！' });
        } else {
            await props.ajax.post('/users', params, { setLoading, successTip: '创建成功！' });
        }

        onOk();
    }, [isEdit, onOk, props.ajax]);

    // 初始化，查询详情数据
    useEffect(() => {
        if (!isEdit) return;
        (async () => {
            const res = await props.ajax.get('/users', { id: record?.id }, [], { setLoading });
            form.setFieldsValue(res || {});
        })();
    }, [isEdit, form, props.ajax, record?.id]);

    const layout = { labelCol: { flex: '100px' } };
    return (
        <Form
            form={form}
            onFinish={handleSubmit}
        >
            <ModalContent
                loading={loading}
                okText="保存"
                okHtmlType="submit"
                cancelText="重置"
                onCancel={() => form.resetFields()}
            >
                {isEdit ? <FormItem hidden name="id"/> : null}
                <Row>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="账户"
                            name="account"
                            maxLength={20}
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="阿凡达"
                            name="avatar"
                            maxLength={200}
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="电子邮件"
                            name="email"
                            maxLength={100}
                            rules={[
                                validateRules.email(),
                            ]}
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="使可能"
                            name="enable"
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="性别"
                            name="gender"
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="是管理员吗"
                            name="isAdmin"
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="工作编号"
                            name="jobNumber"
                            maxLength={20}
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="可移动的"
                            name="mobile"
                            maxLength={20}
                            rules={[
                                validateRules.mobile(),
                            ]}
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="名称"
                            name="name"
                            maxLength={20}
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="暗语"
                            name="password"
                            maxLength={100}
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="位置"
                            name="position"
                            maxLength={50}
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="二维码"
                            name="qrCode"
                            maxLength={200}
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="select"
                            label="状态"
                            name="status"
                            required
                        />        
                    </Col>
                </Row>
            </ModalContent>
        </Form>
    );
});