import {useCallback, useState, useEffect} from 'react';
import {Form, Row, Col} from 'antd';
import {ModalContent, FormItem} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';

export default config({
    modal: {
        title: (props) => (props.isEdit ? '编辑' : '创建'),
        width: '70%',
        top: 50,
    },
})(function DepartmentUserEditModal(props) {
    const { record, isEdit, onOk } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = useCallback(async (values) => {
        const params = {
            ...values,
        };

        if (isEdit) {
            await props.ajax.put('/department_users', params, { setLoading, successTip: '修改成功！' });
        } else {
            await props.ajax.post('/department_users', params, { setLoading, successTip: '修改成功！' });
        }

        onOk();
    }, [isEdit, onOk, props.ajax]);

    // 初始化，查询详情数据
    useEffect(() => {
        (async () => {
            const res = await props.ajax.get('/department_users', { id: record?.id }, [], { setLoading });
            form.setFieldsValue(res || {});
        })();
    }, [form, props.ajax, record?.id]);

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
                            label="用户"
                            name="userId"
                            required
                            noSpace
                            maxLength={36}
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="部门"
                            name="departmentId"
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="是否是领导"
                            name="isLeader"
                        />        
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="number"
                            label="排序"
                            name="order"
                        />        
                    </Col>
                </Row>
            </ModalContent>
        </Form>
    );
});