import {useCallback, useState, useRef} from 'react';
import {Content, confirm} from 'src/components';
import {Button, Input, Modal} from 'antd';
import {modalFunction} from 'src/hocs';
import {useHeight} from 'src/hooks';
import {isMac} from 'src/commons';
import {FORM_ELEMENT_OPTIONS} from 'src/pages/generator/constant';

export default modalFunction((props) => {
    const { onCancel, onOk, dataSource, getNewRecord, close, commonProps } = props;
    const [value, setValue] = useState('');
    const textAreaRef = useRef(null);
    const [height] = useHeight(textAreaRef, 100);

    const handleSubmit = useCallback(async (replace) => {
        if (!value?.trim()) return;

        const values = value.split('\n')
            .map(item => item.trim().replace(/\s+/g, ' '))
            .filter(Boolean);

        if (!values?.length) return;
        if (replace && dataSource.length) {
            await confirm('您确定要覆盖吗？');
        }
        const newDataSource = values.map(item => {
            const [chinese, ft = 'i'] = item.split(' ');
            const formType = FORM_ELEMENT_OPTIONS.find(it => it.short === ft)?.value || 'input';
            return getNewRecord({ chinese, formType });
        });
        if (replace) {
            await onOk(newDataSource);
        } else {
            await onOk([...dataSource, ...newDataSource]);
        }
        close();
    }, [value, dataSource, onOk, close, getNewRecord]);

    const handlePressEnter = useCallback(async (e) => {
        const { ctrlKey, metaKey } = e;
        if (!(ctrlKey || metaKey)) return;

        await handleSubmit(true);
    }, [handleSubmit]);

    // 用户粘贴事件
    const handlePaste = useCallback((e) => {
        // 等待数据
        setTimeout(() => {
            const { value } = e.target;
            if (!value?.trim()) return;
            const nextValue = value.split(/[\s、，,]/).filter(Boolean).join('\n');
            setValue(nextValue);
        });
    }, []);

    return (
        <Modal
            {...commonProps}
            title="快速编辑"
            width={600}
            footer={(
                <>
                    <Button onClick={onCancel}>关闭</Button>
                    {dataSource?.length ? (
                        <>
                            <Button type="primary" onClick={() => handleSubmit(false)}>追加</Button>
                            <Button type="primary" danger onClick={() => handleSubmit(true)}>覆盖</Button>
                        </>
                    ) : (
                        <Button type="primary" onClick={() => handleSubmit(false)}>确定</Button>
                    )}
                </>
            )}
        >
            <Content
                style={{ padding: 16 }}
                onCancel={onCancel}
            >
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {FORM_ELEMENT_OPTIONS.map(item => {
                        const { value, short } = item;
                        return (
                            <div
                                key={short}
                                style={{
                                    marginRight: 4,
                                    marginBottom: 4,
                                    padding: '0 4px',
                                    border: '1px solid #d9d9d9',
                                }}
                            >
                                <span style={{ color: 'orange' }}>{short}</span>
                                <span>-></span>
                                <span>{value}</span>
                            </div>
                        );
                    })}
                </div>
                <div ref={textAreaRef} style={{ marginTop: 8 }}>
                    <Input.TextArea
                        style={{ height }}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onPressEnter={handlePressEnter}
                        onPaste={handlePaste}
                        placeholder={[
                            `1. 中文名 + 空格 + 表单类型缩写，一行一组; `,
                            `2. 表单类型默认 input; `,
                            `3. ${isMac ? '⌘' : 'ctrl'} + enter 覆盖提交； `,
                            `4. 提交完成后会自动填充字段名； `,
                        ].join('\n')}
                    />
                </div>
            </Content>
        </Modal>
    );
});
