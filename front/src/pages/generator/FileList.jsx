import React from 'react';
import stringToColor from 'string-to-color';
import { Button, Form, Select, Space, Tag } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import TargetPathInput from 'src/pages/generator/TargetPathInput';
import { OptionsTag } from 'src/components';
import s from './style.module.less';

function FileList(props) {
    console.log('FileList render');
    const {
        form,
        templateOptions,
        filesVisible, // 是否展示完整的文件列表
        moduleNames,
        checkExist,
        onAdd = () => undefined,
        onRemove = () => undefined,
        onTemplateChange = () => undefined,
        onTargetPathChange = () => undefined,
        onOptionsChange = () => undefined,
    } = props;

    return (
        <Form.List name="files">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, isListField, ...restField }, index) => {
                        const isFirst = index === 0;
                        const number = index + 1;
                        const label = `文件${number}`;

                        const templateId = form.getFieldValue(['files', name, 'templateId']);
                        const record = templateOptions.find(item => item.value === templateId)?.record;
                        const color = stringToColor(record?.name);
                        const options = record?.options || [];

                        const addButton = (
                            <Button
                                className={s.filePlus}
                                type="link"
                                icon={<PlusCircleOutlined />}
                                onClick={() => {
                                    const files = form.getFieldValue('files');
                                    const record = templateOptions.find(item => !files.find(it => it.templateId === item.value))?.record;
                                    const { id: templateId, targetPath, options } = record || {};
                                    add({ templateId, targetPath, options: [...options] });
                                    onAdd();
                                }}
                            />
                        );

                        return (
                            <div key={key} style={{ display: !filesVisible ? 'inline-block' : 'block' }}>
                                <div className={s.fileName} style={{ display: !filesVisible ? 'inline-block' : 'none' }}>
                                    {isFirst ? (
                                        <div>
                                            {(fields.length < templateOptions.length) && addButton}
                                            <span style={{ marginLeft: 8 }}>所选文件：</span>
                                        </div>
                                    ) : null}
                                    <Tag
                                        color={color}
                                        closable={fields.length !== 1}
                                        onClose={() => {
                                            remove(name);
                                            onRemove();
                                        }}
                                    >
                                        {record?.name}
                                    </Tag>
                                </div>
                                <div className={s.fileRow} style={{ display: filesVisible ? 'flex' : 'none' }}>
                                    <Space className={s.fileOperator}>
                                        <Button
                                            className={s.fileMinus}
                                            danger
                                            icon={<MinusCircleOutlined />}
                                            type="link"
                                            disabled={fields.length === 1}
                                            onClick={() => {
                                                remove(name);
                                                onRemove();
                                            }}
                                        />
                                        {isFirst && (fields.length < templateOptions.length) && addButton}
                                    </Space>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(p, c) => p?.files?.length !== c?.files?.length}
                                    >
                                        {({ getFieldValue }) => {
                                            const files = getFieldValue('files');
                                            const options = templateOptions.filter(item => {
                                                if (templateId === item.value) return true;
                                                return !files.find(f => f.templateId === item.value);
                                            });
                                            return (
                                                <div>
                                                    <Form.Item
                                                        {...restField}
                                                        label={label}
                                                        name={[name, 'templateId']}
                                                        rules={[{ required: true, message: '请选择模板文件！' }]}
                                                    >
                                                        <Select
                                                            style={{ width: 211 }}
                                                            options={options}
                                                            placeholder="请选择模板"
                                                            onChange={(id) => onTemplateChange(name, id)}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            );
                                        }}
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        label="目标位置"
                                        name={[name, 'targetPath']}
                                        rules={[
                                            { required: true, message: '请输入目标文件位置！' },
                                            {
                                                validator(_, value) {
                                                    if (!value) return Promise.resolve();
                                                    const files = form.getFieldValue('files');
                                                    const records = files.filter(item => item.targetPath === value);
                                                    if (records.length > 1) return Promise.reject('不能使用相同的目标文件！请修改');
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                        onChange={onTargetPathChange}
                                    >
                                        <TargetPathInput
                                            style={{ width: 400 }}
                                            moduleNames={moduleNames}
                                            templateId={form.getFieldValue(['files', name, 'templateId'])}
                                            templateOptions={templateOptions}
                                            placeholder="请输入目标文件位置"
                                            name={['files', name, 'targetPath']}
                                            form={form}
                                            checkExist={checkExist}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'options']}
                                        onChange={onOptionsChange}
                                    >
                                        <OptionsTag options={options} />
                                    </Form.Item>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </Form.List>
    );
}

export default React.memo(FileList);
