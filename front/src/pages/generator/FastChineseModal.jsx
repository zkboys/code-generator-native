import { useCallback, useState, useRef } from 'react';
import { ModalContent, confirm } from 'src/components';
import { Button, Input } from 'antd';
import { modal } from 'src/hocs';
import { useHeight } from 'src/hooks';

export const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

export default modal({
    top: 50,
    title: '快速编辑',
    width: 500,
    maskClosable: true,
})(function(props) {
    const { onCancel, onOk, dataSource } = props;
    const [value, setValue] = useState('');
    const textAreaRef = useRef(null);
    const [height] = useHeight(textAreaRef, 100);

    const handleSubmit = useCallback(async (replace) => {
        if (!value?.trim()) return;

        const values = value.split('\n')
            .map(item => item.trim())
            .filter(Boolean);
        console.log(values);
        if (!values?.length) return;
        if (replace) {
            await confirm('您确定要覆盖吗？');
        }
        onOk(values, replace);
    }, [value, onOk]);

    return (
        <ModalContent
            onCancel={onCancel}
            footer={(
                <>
                    {dataSource?.length ? (
                        <>
                            <Button type="primary" onClick={() => handleSubmit(false)}>追加</Button>
                            <Button type="primary" danger onClick={() => handleSubmit(true)}>覆盖</Button>
                        </>
                    ) : (
                        <Button type="primary" onClick={() => handleSubmit(false)}>确定</Button>
                    )}
                    <Button onClick={onCancel}>关闭</Button>
                </>
            )}
        >
            <div ref={textAreaRef}>
                <Input.TextArea
                    style={{ height }}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={'一行一个！'}
                />
            </div>
        </ModalContent>
    );
});
