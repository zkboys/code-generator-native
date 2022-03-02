module.exports = {
    // name: '弹框编辑页',
    options: ['添加', '修改', '详情'],
    fieldOptions: ['表单'],
    targetPath: '/front/src/pages/{module-name}/EditModal.jsx',
    getContent: config => {
        const { moduleNames: mn, fields, NULL_LINE } = config;
        const ignore = ['id', 'updatedAt', 'createdAt', 'isDeleted'];
        const formFields = fields.filter(item => item.fieldOptions.includes('表单') && !ignore.includes(item.__names.moduleName));

        return `
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
})(function ${mn.ModuleName}EditModal(props) {
    const { record, isEdit, onOk } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = useCallback(async (values) => {
        const params = {
            ...values,
        };

        if (isEdit) {
            await props.ajax.put('/${mn.module_names}', params, { setLoading, successTip: '修改成功！' });
        } else {
            await props.ajax.post('/${mn.module_names}', params, { setLoading, successTip: '修改成功！' });
        }

        onOk();
    }, [isEdit, onOk, props.ajax]);

    // 初始化，查询详情数据
    useEffect(() => {
        (async () => {
            const res = await props.ajax.get('/${mn.module_names}', { id: record?.id }, [], { setLoading });
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
                    ${formFields.map(item => `<Col span={12}>
                        <FormItem
                            {...layout}
                            type="${item.formType}"
                            label="${item.chinese}"
                            name="${item.__names.moduleName}"
                            ${item.validation.includes('required') ? 'required' : NULL_LINE}
                            ${item.validation.includes('noSpace') ? 'noSpace' : NULL_LINE}
                            ${item.length ? `maxLength={${item.length}}` : NULL_LINE}
                        />        
                    </Col>`).join('\n                    ')}
                </Row>
            </ModalContent>
        </Form>
    );
});
        `;
    },
};
