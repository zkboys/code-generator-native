module.exports = {
    filePath: __filename, // 用于读取当前文件内容
    name: 'EditModal',
    targetPath: '{parentPath}/editModal.jsx',
    getContent: config => {
        const { file, moduleNames: mn, fields, NULL_LINE, ignoreFields } = config;
        const { options = [] } = file;

        // 返回false不生成文件
        if (!options.includes('添加') && !options.includes('修改')) return false;

        const ignoreRules = ['required', 'noSpace', 'unique'];
        const formFields = fields.filter(item => item.fieldOptions.includes('表单') && !ignoreFields.includes(item.__names.moduleName));
        const _edit = options.includes('修改');
        const _validateRules = fields.some(item => item.validation && item.validation.some(it => !ignoreRules.includes(it)));
        const uniqueFields = fields.filter(item => item.validation && item.validation.includes('unique'));


        return `
import {useState${_edit ? ', useEffect' : ''}} from 'react';
import {Form, Row, Col} from 'antd';
import {config, Modal, ModalFooter, Content, useFunction, FormItem${uniqueFields.length ? ', useDebounceValidator' : ''}} from '@rc-lib/pc';
${_validateRules ? "import * as validateRules from '@/validate-rules';" : ''}

export default config({
    modalFunction: true,
})(function ${mn.ModuleName}EditModal(props) {
    const {${_edit ? ' record, ' : ''} close, onOk, onCancel, commonProps } = props;
    ${_edit ? 'const isEdit = !!record;' : ''}
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    ${uniqueFields.map(field => {
            return `const check${field.__names.ModuleName} = useDebounceValidator(async (rule, value) => {
        if (!value) return;

        const res = await props.ajax.get(\`/${mn.module_names}/${field.__names.moduleNames}/\${value}\`);
        if (!res) return;

        const id = form.getFieldValue('id');
        if (isEdit && res.id !== id && res.${field.name} === value) throw Error('${field.chinese}不能重复！');
        if (!isEdit && res.${field.name} === value) throw Error('${field.chinese}不能重复！');
    });`;
        })}
    const handleSubmit = useFunction(async (values) => {
        if(loading) return;
        
        const params = {
            ...values,
        };
        ${_edit ? `if (isEdit) {
            await props.ajax.put(\`/${mn.module_names}/\${record?.id}\`, params, { setLoading, successTip: '修改成功！' });
        } else {
            await props.ajax.post('/${mn.module_names}', params, { setLoading, successTip: '创建成功！' });
        }` : `await props.ajax.post('/${mn.module_names}', params, { setLoading, successTip: '创建成功！' });`}

        onOk && onOk();
        close();
    });

    ${_edit ? `// 初始化，查询详情数据
    useEffect(() => {
        if (!isEdit) return;
        (async () => {
            const res = await props.ajax.get(\`/${mn.module_names}/\${record?.id}\`, null, { setLoading });
            form.setFieldsValue(res || {});
        })();
    }, [isEdit, form, props.ajax, record?.id]);` : NULL_LINE}

    return (
        <Modal
            {...commonProps}
            title={record ? '修改${mn.chineseName}' : '添加${mn.chineseName}'}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                labelCol={{flex: '100px'}}
            >
                <Content loading={loading}>
                    ${_edit ? `{isEdit ? <FormItem hidden name="id"/> : null}` : NULL_LINE}
                    <Row>
                        ${formFields.map(item => {
            const validation = item.validation.filter(item => !ignoreRules.includes(item));
            const uniqueValidation = item.validation.some(it => it === 'unique');
            return `<Col span={12}>
                            <FormItem
                                type="${item.formType}"
                                label="${item.chinese}"
                                name="${item.__names.moduleName}"
                                ${item.validation.includes('required') ? 'required' : NULL_LINE}
                                ${item.validation.includes('noSpace') ? 'noSpace' : NULL_LINE}
                                ${item.length ? `maxLength={${item.length}}` : NULL_LINE}
                                ${item.options && item.options.length ? `options={[
                                    ${item.options.map(it => `{value: '${it.value}', label: '${it.label}'},`).join('\n                                    ')}
                                ]}` : NULL_LINE}
                                ${validation.length || uniqueValidation ? `rules={[
                                    ${uniqueValidation ? `{ validator: check${item.__names.ModuleName} },` : NULL_LINE}
                                    ${validation.map(item => {
                return `validateRules.${item}(),`;
            }).join('\n                                ')}
                                ]}` : NULL_LINE}
                            />
                        </Col>`;
        }).join('\n                        ')}
                    </Row>
                    <ModalFooter
                        okText="保存"
                        okButtonProps={{ htmlType: 'submit' }}
                        onCancel={onCancel}
                    />
                </Content>
            </Form>
        </Modal>
    );
});
        `;
    },
};
