import React, { useCallback, useState, useEffect } from 'react';
import { Tabs, Button } from 'antd';
import { ModalContent } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import { CodeEditor } from 'src/components';

const { TabPane } = Tabs;

export default config({
    modal: {
        title: null,
        width: '80%',
        top: 50,
        maskClosable: true,
    },
})(function PreviewModal(props) {
    const { params, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);

    const fetchGeneratePreview = useCallback(async (params) => {
        return await props.ajax.post('/generate/preview', params, { setLoading });
    }, [props.ajax]);

    useEffect(() => {
        (async () => {
            const res = await fetchGeneratePreview(params);
            setFiles(res);
        })();
    }, [fetchGeneratePreview, params]);

    return (
        <ModalContent
            bodyStyle={{ padding: 0 }}
            loading={loading}
            footer={<Button onClick={onCancel}>关闭</Button>}
        >
            <Tabs type="card" tabBarStyle={{ marginBottom: 0, marginTop: 13, marginLeft: 4 }}>
                {files.map(file => {
                    const { id, name, content, targetPath } = file;
                    let language = targetPath.split('.').pop();
                    if (['jsx', 'js', 'vue', 'vux'].includes(language)) language = 'javascript';
                    if (['tsx', 'ts'].includes(language)) language = 'typescript';
                    return (
                        <TabPane key={id} tab={name}>
                            <CodeEditor
                                otherHeight={80}
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
});
