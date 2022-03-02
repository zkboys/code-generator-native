import {useCallback, useState, useEffect} from 'react';
import {Form} from 'antd';
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
                <FormItem
                    {...layout}
                    label="角色名称"
                    name="name"
                    required
                    noSpace
                    maxLength={50}
                />
                <FormItem
                    {...layout}
                    type={'switch'}
                    label="启用"
                    name="enabled"
                    checkedChildren="启"
                    unCheckedChildren="禁"
                    required
                />
                <FormItem
                    {...layout}
                    type="textarea"
                    label="备注"
                    name="remark"
                    maxLength={250}
                />
            </ModalContent>
        </Form>
    );
});