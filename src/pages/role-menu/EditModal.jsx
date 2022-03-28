import React, {useCallback, useState, useEffect} from 'react';
import {Form, Row, Col} from 'antd';
import {ModalContent, FormItem} from '@ra-lib/admin';
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
})(function RoleMenuEditModal(props) {
    const { record, isEdit, onOk } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    
    

    const handleSubmit = useCallback(async (values) => {
        const params = {
            ...values,
        };
        if (isEdit) {
            await props.ajax.put('/role_menus', params, { setLoading, successTip: '修改成功！' });
        } else {
            await props.ajax.post('/role_menus', params, { setLoading, successTip: '创建成功！' });
        }

        onOk();
    }, [isEdit, onOk, props.ajax]);

    // 初始化，查询详情数据
    useEffect(() => {
        if (!isEdit) return;
        (async () => {
            const res = await props.ajax.get('/role_menus', { id: record?.id }, [], { setLoading });
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
                            label="菜单"
                            name="menuId"
                            maxLength={36}
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="角色"
                            name="roleId"
                            maxLength={36}
                        />        
                    </Col>
                </Row>
            </ModalContent>
        </Form>
    );
});