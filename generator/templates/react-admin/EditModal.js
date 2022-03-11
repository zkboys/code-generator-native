module.exports = {
    // name: '弹框编辑页',
    options: ['修改'],
    fieldOptions: ['表单'],
    targetPath: '/src/pages/{module-name}/EditModal.jsx',
    getContent: config => {
        const { file, moduleNames: mn, fields, NULL_LINE } = config;
        const ignore = ['id', 'updatedAt', 'createdAt', 'isDeleted'];
        const formFields = fields.filter(item => item.fieldOptions.includes('表单') && !ignore.includes(item.__names.moduleName));
        const { options = [] } = file;
        const _edit = options.includes('修改');
        const _validateRules = fields.some(item => item.validation && item.validation.some(it => !['required', 'noSpace'].includes(it.value)));

        return `
import {useCallback, useState${_edit ? ', useEffect' : ''}} from 'react';
import {Form, Row, Col} from 'antd';
import {ModalContent, FormItem${_validateRules ? ', validateRules' : ''}} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';

export default config({
    modal: {
        ${_edit ? `title: (props) => {
            if(props.isEdit) return '修改';
            return '创建';
        },` : `title: '创建',`}
        width: '70%',
        top: 50,
    },
})(function ${mn.ModuleName}EditModal(props) {
    const {${_edit ? ' record, isEdit, ' : ''}onOk } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = useCallback(async (values) => {
        const params = {
            ...values,
        };
        ${_edit ? `if (isEdit) {
            await props.ajax.put('/${mn.module_names}', params, { setLoading, successTip: '修改成功！' });
        } else {
            await props.ajax.post('/${mn.module_names}', params, { setLoading, successTip: '创建成功！' });
        }` : `await props.ajax.post('/${mn.module_names}', params, { setLoading, successTip: '创建成功！' });`}

        onOk();
    }, [${_edit ? 'isEdit, ' : ''}onOk, props.ajax]);

    ${_edit ? `// 初始化，查询详情数据
    useEffect(() => {
        (async () => {
            const res = await props.ajax.get('/${mn.module_names}', { id: record?.id }, [], { setLoading });
            form.setFieldsValue(res || {});
        })();
    }, [form, props.ajax, record?.id]);` : NULL_LINE}

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
                ${_edit ? `{isEdit ? <FormItem hidden name="id"/> : null}` : NULL_LINE}
                <Row>
                    ${formFields.map(item => {
            const validation = item.validation.filter(item => !['required', 'noSpace'].includes(item.value));
            return `<Col span={12}>
                        <FormItem
                            {...layout}
                            type="${item.formType}"
                            label="${item.chinese}"
                            name="${item.__names.moduleName}"
                            ${item.validation.some(it => it.value === 'required') ? 'required' : NULL_LINE}
                            ${item.validation.some(it => it.value === 'noSpace') ? 'noSpace' : NULL_LINE}
                            ${item.length ? `maxLength={${item.length}}` : NULL_LINE}
                            ${item.options && item.options.length ? `options={[
                                ${item.options.map(it => `{value: '${it.value}', label: '${it.label}'},`).join('\n                                ')}
                            ]}` : NULL_LINE}
                            ${validation.length ? `rules={[
                                ${validation.map(item => {
                return `validateRules.${item.value}(),`;
            }).join('\n                                ')}
                            ]}` : NULL_LINE}
                        />        
                    </Col>`;
        }).join('\n                    ')}
                </Row>
            </ModalContent>
        </Form>
    );
});
        `;
    },
};
