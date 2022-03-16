import {useEffect, useState} from 'react';
import {Button, Modal} from 'antd';
import {ajax, modalFunction} from 'src/hocs';
import {compose, isMac} from 'src/commons';
import {Content} from 'src/components';
import ReactMarkdown from 'react-markdown';

export default compose(
    modalFunction, // 必须在第一个
    ajax,
)(function HelpModal(props) {
    const { onCancel, commonProps, ...others } = props;
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const content = await props.ajax.get('/help', null, { setLoading });

            setContent(content.replaceAll('`⌘`或`ctrl`', isMac ? '`⌘`' : '`ctrl`'));
        })();
    }, [props.ajax]);

    return (
        <Modal
            {...commonProps}
            title="帮助文档"
            footer={<Button onClick={onCancel}>关闭</Button>}
            {...others}
        >
            <Content
                style={{ padding: 16 }}
                fitHeight
                otherHeight={120}
                loading={loading}
            >
                <ReactMarkdown>
                    {content}
                </ReactMarkdown>
            </Content>
        </Modal>
    );
});
