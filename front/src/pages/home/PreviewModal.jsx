import {useCallback, useState, useEffect} from 'react';
import {Tabs, Button} from 'antd';
import {ModalContent} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';

const { TabPane } = Tabs;

export default config({
    modal: {
        title: null,
        width: '80%',
        top: 50,
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
            fitHeight
            loading={loading}
            footer={<Button onClick={onCancel}>关闭</Button>}
        >
            <Tabs
                type="card"
            >
                {files.map(file => {
                    const { id, name, content } = file;

                    return (
                        <TabPane key={id} tab={name}>
                            {content}
                        </TabPane>
                    );
                })}
            </Tabs>

        </ModalContent>
    );
});
