import React, {useState, useCallback} from 'react';
import {ModalContent, confirm} from 'src/components';
import {Button, Alert, Checkbox, Row, Col, Modal} from 'antd';
import {modal, ajax} from 'src/hocs';
import {getFiles} from 'src/commons';

function BatchModal(props) {
    const { onCancel, form, tableOptions, templateOptions, moduleNames } = props;
    const [loading, setLoading] = useState(false);
    const [tables, setTables] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const dbUrl = form.getFieldValue('dbUrl');
    const files = form.getFieldValue('files');

    const handleSubmit = useCallback(async () => {
        await confirm('您确定要生成选中的表吗？本地同名文件将被覆盖，请谨慎操作！');

        const nextFiles = getFiles(files, templateOptions, moduleNames);

        const params = {
            dbUrl,
            tables,
            files: nextFiles,
        };

        const paths = await props.ajax.post('/generate/files/batch', params, { setLoading });
        Modal.success({
            width: 600,
            title: '生成文件如下',
            content: (
                <div style={{ maxHeight: 200, overflow: 'auto' }}>
                    {paths.map(p => <div key={p}>{p}</div>)}
                </div>
            ),
        });
        onCancel();
    }, [dbUrl, files, moduleNames, onCancel, props.ajax, tables, templateOptions]);

    const handleChange = useCallback((tables) => {
        setTables(tables);
        setIndeterminate(!!tables.length && tables.length < tableOptions.length);
        setCheckAll(tables.length === tableOptions.length);
    }, [tableOptions.length]);

    const handleCheckAll = useCallback((e) => {
        const { checked } = e.target;
        setTables(checked ? tableOptions.map(item => item.value) : []);
        setIndeterminate(false);
        setCheckAll(checked);
    }, [tableOptions]);

    return (
        <ModalContent
            loading={loading}
            fitHeight
            footer={
                <>
                    <Button onClick={onCancel}>关闭</Button>
                    <Button
                        style={{ marginLeft: 16 }}
                        type={'primary'}
                        danger
                        onClick={handleSubmit}
                        disabled={!tables?.length}
                    >
                        生成文件
                    </Button>
                </>
            }
        >
            <Alert
                message={'提示'}
                style={{ marginBottom: 16 }}
                description="选择您要生成文件的数据库表，会根据页面文件配置生成所有文件。模块名默认为表名。"
            />
            <div style={{ marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #e9e9e9' }}>
                <Checkbox
                    indeterminate={indeterminate}
                    onChange={handleCheckAll}
                    checked={checkAll}
                >
                    全选
                </Checkbox>
            </div>
            <Checkbox.Group value={tables} onChange={handleChange}>
                <Row>
                    {tableOptions.map(item => {
                        return (
                            <Col span={8} style={{ marginBottom: 8 }} key={item.value}>
                                <Checkbox value={item.value}>
                                    {item.label}
                                </Checkbox>
                            </Col>
                        );
                    })}
                </Row>
            </Checkbox.Group>

        </ModalContent>
    );
}

export default ajax()(modal({
    top: 50,
    title: '基于数据库表批量生成',
    width: 1000,
    maskClosable: true,
})(BatchModal));
