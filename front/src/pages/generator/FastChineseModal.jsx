import {useCallback, useState, useRef} from 'react';
import {ModalContent, confirm} from 'src/components';
import {Button, Input} from 'antd';
import {modal} from 'src/hocs';
import {useHeight} from 'src/hooks';
import {isMac} from 'src/commons';

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
        if (!values?.length) return;
        if (replace && dataSource.length) {
            await confirm('您确定要覆盖吗？');
        }
        onOk(values, replace);
    }, [value, dataSource.length, onOk]);

    const handlePressEnter = useCallback(async (e) => {
        const { ctrlKey, metaKey } = e;
        if (!(ctrlKey || metaKey)) return;

        await handleSubmit(true);
    }, [handleSubmit]);

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
                    onPressEnter={handlePressEnter}
                    placeholder={`一行一个！${isMac ? '⌘' : 'ctrl'} + enter 覆盖提交！`}
                />
            </div>
        </ModalContent>
    );
});
