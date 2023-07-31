import React, {useState, useEffect, useCallback} from 'react';
import {Tabs, Button, Modal} from 'antd';
import {modalFunction, ajax} from 'src/hocs';
import {CodeEditor, Content} from 'src/components';
import {compose} from 'src/commons';
import {EditOutlined} from '@ant-design/icons'
import {useDebounceFn} from 'ahooks'
import s from './previewModal.module.less';

const {TabPane} = Tabs;

export default compose(
    modalFunction,
    ajax,
)(function PreviewModal(props) {
    const {params, onCancel, commonProps} = props;
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [files, setFiles] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    // 用户强制CodeEditor重新布局
    const [refreshKey, setRefreshKey] = useState();

    const handleSearch = useCallback(async () => {
        if (!params) return;

        const res = await props.ajax.post('/generate/preview', params, {setLoading});
        setFiles(res);
    }, [params, props.ajax]);

    const {run: handleTemplateChange} = useDebounceFn(async (value, template) => {
        const {filePath} = template;
        if (!filePath) return;
        const params = {
            content: value,
            filePath,
        }
        await props.ajax.put('/template', params, {setLoading: setSaving});
        await handleSearch();
    }, {wait: 300})

    useEffect(() => {
        (async () => {
            await handleSearch();
        })();
    }, [handleSearch]);

    useEffect(() => {
        setRefreshKey(Date.now)
    }, [showEdit]);

    return (
        <Modal
            {...commonProps}
            width="100%"
            footer={<Button onClick={onCancel}>关闭</Button>}
        >
            <Content
                fitHeight
                otherHeight={105}
                style={{overflow: 'hidden'}}
                loading={loading || saving}
            >
                <Tabs
                    type="card"
                    tabBarStyle={{marginBottom: 0, marginTop: 13, marginLeft: 4}}
                    tabBarExtraContent={{
                        left: (
                            <Button
                                type="link"
                                icon={<EditOutlined/>}
                                onClick={() => setShowEdit(showEdit => !showEdit)}
                            />
                        )
                    }}
                >
                    {files.map(file => {
                        const {id, content, targetPath, templateContent} = file;
                        let language = targetPath.split('.').pop();
                        if (['jsx', 'js', 'vue', 'vux'].includes(language)) language = 'javascript';
                        if (['tsx', 'ts'].includes(language)) language = 'typescript';
                        return (
                            <TabPane key={id + refreshKey} tab={targetPath}>
                                <div className={s.content}>
                                    {showEdit ? (
                                        <div style={{flex: '0 0 50%'}}>
                                            <CodeEditor
                                                otherHeight={60}
                                                language="javascript"
                                                value={templateContent}
                                                onChange={(value) => handleTemplateChange(value, file)}
                                            />
                                        </div>
                                    ) : null}
                                    <div style={{flex: showEdit ? '0 0 50%' : '0 0 100%'}}>
                                        <CodeEditor
                                            otherHeight={60}
                                            language={language}
                                            value={content}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </TabPane>
                        );
                    })}
                </Tabs>
            </Content>
        </Modal>
    );
});

