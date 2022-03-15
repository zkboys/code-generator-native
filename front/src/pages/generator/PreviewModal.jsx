import React, {useState, useEffect} from 'react';
import {Tabs, Button} from 'antd';
import {modal, ajax} from 'src/hocs';
import {CodeEditor, ModalContent} from 'src/components';

const { TabPane } = Tabs;

export default ajax()(modal({
    title: null,
    width: '80%',
    top: 50,
    maskClosable: true,
})(props => {
    const { params, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await props.ajax.post('/generate/preview', params, { setLoading });
            setFiles(res);
        })();
    }, [props.ajax, params]);

    return (
        <ModalContent
            fitHeight
            bodyStyle={{ padding: 0, overflow: 'hidden' }}
            loading={loading}
            footer={<Button onClick={onCancel}>关闭</Button>}
        >
            <Tabs type="card" tabBarStyle={{ marginBottom: 0, marginTop: 13, marginLeft: 4 }}>
                {files.map(file => {
                    const { id, content, targetPath } = file;
                    let language = targetPath.split('.').pop();
                    if (['jsx', 'js', 'vue', 'vux'].includes(language)) language = 'javascript';
                    if (['tsx', 'ts'].includes(language)) language = 'typescript';
                    return (
                        <TabPane key={id} tab={targetPath}>
                            <CodeEditor
                                otherHeight={60}
                                language={language}
                                value={content}
                                readOnly
                            />
                        </TabPane>
                    );
                })}
            </Tabs>
        </ModalContent>
    );
}));

