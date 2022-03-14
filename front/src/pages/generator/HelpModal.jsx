import {useEffect, useState} from 'react';
import {Button} from 'antd';
import ReactMarkdown from 'react-markdown';
import {ModalContent} from 'src/components';
import {modal, ajax} from 'src/hocs';
import {isMac} from 'src/commons';

export default ajax()(modal({
    top: 50,
    title: '帮助文档',
    width: 1000,
    maskClosable: true,
})(function(props) {
    const { onCancel } = props;
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const content = await props.ajax.get('/help', null, { setLoading });

            setContent(content.replaceAll('`⌘`或`ctrl`', isMac ? '`⌘`' : '`ctrl`'));
        })();
    }, [props.ajax]);

    return (
        <ModalContent
            loading={loading}
            fitHeight
            onCancel={onCancel}
            footer={<Button onClick={onCancel}>关闭</Button>}
        >
            <ReactMarkdown>
                {content}
            </ReactMarkdown>
        </ModalContent>
    );
}));
