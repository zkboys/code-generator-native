import React, {useState, useEffect} from 'react';
import {Tabs, Button, Modal} from 'antd';
import {modalFunction, ajax} from 'src/hocs';
import {CodeEditor, Content} from 'src/components';
import {compose} from 'src/commons';

const { TabPane } = Tabs;

export default compose(
    modalFunction,
    ajax,
)(function PreviewModal(props) {
    const { params, onCancel, commonProps } = props;
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        (async () => {
            if (!params) return;

            const res = await props.ajax.post('/generate/preview', params, { setLoading });
            setFiles(res);
        })();
    }, [props.ajax, params]);

    return (
        <Modal
            {...commonProps}
            width="80%"
            footer={<Button onClick={onCancel}>关闭</Button>}
        >
            <Content
                fitHeight
                otherHeight={105}
                style={{ padding: 0, overflow: 'hidden' }}
                loading={loading}
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
            </Content>
        </Modal>
    );
});

