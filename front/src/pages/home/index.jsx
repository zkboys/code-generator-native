import React, { useState, useEffect, useCallback } from 'react';
import { Form, Space, Row, Col, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined, FileAddOutlined, CodeOutlined, FormOutlined } from '@ant-design/icons';
import { PageContent, FormItem } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import { OptionsTag, FieldTable } from 'src/components';
import s from './style.less';
import { v4 as uuid } from 'uuid';

export default config({
    path: '/home',
    title: '首页',
})(function Home(props) {
    // 如果其他页面作为首页，直接重定向，config中不要设置title，否则tab页中会多个首页
    // return <Redirect to="/users"/>;
    const [value, setValue] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [fieldOptions, setFieldOptions] = useState(['条件', '表格']);
    const [tableOptions, setTableOptions] = useState([
        { value: 'user_center_adfafd_asdfadf', label: 'user_center_adfafd_asdfadf' },
    ]);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [form] = Form.useForm();

    const handleDbUrlChange = useCallback(() => {
        // TODO
    }, []);

    const handleTableNameChange = useCallback(() => {
        // TODO
    }, []);

    const handleModuleNameChange = useCallback(() => {
        // TODO
    }, []);
    const addRow = useCallback((append = false) => {
        const length = dataSource.length;
        const field = `field${length + 1}`;
        const id = uuid();

        const newRecord = {
            id,
            field,
            comment: '新增列',
            chinese: '新增列',
            name: field,

            type: 'string',
            formType: 'input',
            length: 0,
            isNullable: true,
            options: [...fieldOptions],
        };

        append ? dataSource.push(newRecord) : dataSource.unshift(newRecord);
        setDataSource([...dataSource]);
    }, [dataSource, fieldOptions]);

    const handlePreviewCode = useCallback(() => {
        //TODO
    }, []);

    const handleFastEdit = useCallback(() => {
        //TODO
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setFieldOptions(['表格选中', '表格序号', '分页', '导入', '导出', '添加', '批量删除', '弹框编辑']);
        }, 5000);
    }, []);

    const layout = {
        labelCol: { flex: '120px' },
    };

    const formItemProps = {
        // size: 'small',
    };

    return (
        <PageContent className={s.root}>
            <Form
                style={{ marginBottom: 8 }}
                form={form}
                layout="inline"
                initialValues={{ files: [{}] }}
            >
                <FormItem
                    {...formItemProps}
                    labelCol={{ flex: '120px' }}
                    style={{ width: 300 }}
                    label="数据库地址"
                    name="dbUrl"
                    placeholder="mysql://username:password@host:port/database"
                    onChange={handleDbUrlChange}
                    required
                    tooltip="支持mysql、oracle"
                />
                <FormItem
                    {...formItemProps}
                    style={{ width: 200 }}
                    type="select"
                    showSearch
                    label="数据库表"
                    name="tableName"
                    onChange={handleTableNameChange}
                    options={tableOptions}
                    required
                />
                <FormItem
                    {...formItemProps}
                    style={{ width: 200 }}
                    label="模块名"
                    name="moduleName"
                    placeholder="比如：user-center"
                    onChange={handleModuleNameChange}
                    required
                />
                <div style={{ width: '100%', marginTop: 8 }}>
                    <Form.List name="files">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <div style={{ width: 421 }}>
                                            <FormItem
                                                {...formItemProps}
                                                {...restField}
                                                labelCol={{ flex: '120px' }}
                                                style={{ width: 300 }}
                                                label={index === 0 ? '生成文件' : ' '}
                                                colon={index === 0}
                                                name={[name, 'template']}
                                                required
                                                options={templateOptions}
                                                placeholder="请选择模板"
                                            />
                                        </div>
                                        <FormItem
                                            {...formItemProps}
                                            {...restField}
                                            style={{ width: 200 }}
                                            label="目标文件"
                                            name={[name, 'targetPath']}
                                            required
                                        />
                                        <FormItem
                                            {...formItemProps}
                                            {...restField}
                                            name={[name, 'options']}
                                        >
                                            <OptionsTag
                                                options={['表格选中', '表格序号', '分页', '导入', '导出', '添加', '批量删除', '弹框编辑']}
                                            />
                                        </FormItem>
                                        {fields?.length > 1 && (
                                            <MinusCircleOutlined
                                                style={{ color: 'red' }}
                                                onClick={() => remove(name)}
                                            />
                                        )}
                                    </Space>
                                ))}
                                <Space>
                                    <Button
                                        icon={<FileAddOutlined />}
                                        type="primary"
                                        onClick={() => add()}
                                    >
                                        添加文件
                                    </Button>
                                    <Button
                                        icon={<PlusOutlined />}
                                        type="primary"
                                        ghost
                                        onClick={() => addRow()}
                                    >
                                        添加一行
                                    </Button>
                                    <Button
                                        icon={<CodeOutlined />}
                                        onClick={() => handlePreviewCode()}
                                    >
                                        代码预览
                                    </Button>
                                    <Button
                                        icon={<FormOutlined />}
                                        onClick={() => handleFastEdit()}
                                    >
                                        快速编辑
                                    </Button>
                                </Space>
                            </>
                        )}
                    </Form.List>
                </div>
            </Form>
            <FieldTable
                otherHeight={72}
                dataSource={dataSource}
                onChange={setDataSource}
                options={fieldOptions}
                footer={() => null}
            />
        </PageContent>
    );
});
