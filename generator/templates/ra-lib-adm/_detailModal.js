module.exports = {
    filePath: __filename, // 用于读取当前文件内容
    name: 'DetailModal',
    targetPath: '{parentPath}/detailModal.jsx',
    getContent: config => {
        const {moduleNames: mn, file, fields, ignoreFields, NULL_LINE} = config;
        const {options = []} = file;

        // 返回false不生成文件
        if (!options.includes('详情')) return false;

        const detailFields = fields.filter(item => item.fieldOptions.includes('详情') && !ignoreFields.includes(item.__names.moduleName));
        return `
import React, {useState, useEffect} from 'react';
import {Button, Descriptions, Modal} from 'antd';
import {ModalContent} from '@ra-lib/adm';
import config from 'src/commons/config-hoc';

export default config({
    modalFunction: true,
})(function ${mn.ModuleName}DetailModal(props) {
    const { record, onCancel, commonProps } = props;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    // 初始化，查询详情数据
    useEffect(() => {
        (async () => {
            const res = await props.ajax.get(\`/${mn.module_names}/\${record?.id}\`, null, { setLoading });
            setData(res || {});
        })();
    }, [props.ajax, record?.id]);

    return (
        <Modal
            {...commonProps}
            title="详情"
        >
            <ModalContent
                loading={loading}
                footer={<Button onClick={onCancel}>关闭</Button>}
            >
                <Descriptions bordered size="small" labelStyle={{ width: 150 }}>
                    ${detailFields.map(item => `<Descriptions.Item label="${item.chinese}">{data.${item.__names.moduleName} ?? '-'}</Descriptions.Item>`).join('\n                    ')}
                </Descriptions>
            </ModalContent>
        </Modal>
    );
});
        `;
    },
};
