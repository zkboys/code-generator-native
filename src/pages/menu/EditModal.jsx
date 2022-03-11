import {useCallback, useState, useEffect} from 'react';
import {Form, Row, Col} from 'antd';
import {ModalContent, FormItem, useDebounceValidator} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';

export default config({
    modal: {
        title: (props) => {
            if (props.isEdit) return '修改';
            return '创建';
        },
        width: '70%',
        top: 50,
    },
})(function MenuEditModal(props) {
    const { record, isEdit, onOk } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const checkText = useDebounceValidator(async (rule, value) => {
        if (!value) return;

        const res = await props.ajax.get('/menus/texts/${value}');
        if (!res) return;

        const id = form.getFieldValue('id');
        if (isEdit && res.id !== id && res.text === value) throw Error('文本不能重复！');
        if (!isEdit && res.text === value) throw Error('文本不能重复！');
    });

    const handleSubmit = useCallback(async (values) => {
        const params = {
            ...values,
        };
        if (isEdit) {
            await props.ajax.put('/menus', params, { setLoading, successTip: '修改成功！' });
        } else {
            await props.ajax.post('/menus', params, { setLoading, successTip: '创建成功！' });
        }

        onOk();
    }, [isEdit, onOk, props.ajax]);

    // 初始化，查询详情数据
    useEffect(() => {
        (async () => {
            const res = await props.ajax.get('/menus', { id: record?.id }, [], { setLoading });
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
                            label="父级id"
                            name="parentId"
                            maxLength={36}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="文本"
                            name="text"
                            maxLength={200}
                            rules={[
                                { validator: checkText },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="select"
                            label="菜单类型"
                            name="type"
                            maxLength={10}
                            options={[
                                { value: '01', label: '菜单' },
                                { value: '02', label: '功能' },
                                { value: '03', label: 'iframe' },
                                { value: '04', label: '未知' },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="偶像"
                            name="icon"
                            maxLength={200}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="基本路径"
                            name="basePath"
                            maxLength={200}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="路径"
                            name="path"
                            maxLength={200}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="网址"
                            name="url"
                            maxLength={200}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="目标"
                            name="target"
                            maxLength={200}
                        />
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...layout}
                            type="input"
                            label="排序"
                            name="order"
                        />
                    </Col>
                </Row>
            </ModalContent>
        </Form>
    );
});
