module.exports = {
    filePath: __filename, // 用于读取当前文件内容
    name: 'DetailModal',
    targetPath: '{parentPath}/detailModal.jsx',
    getContent: config => {
        const { moduleNames: mn, file, fields, ignoreFields = [] } = config;
        const { options = [] } = file;

        // 返回false不生成文件
        if (!options.includes('详情')) return false;

        const detailFields = fields.filter(item => item.fieldOptions.includes('详情') && !ignoreFields.includes(item.__names.moduleName));
        return `
import {useState, useEffect} from 'react';
import {Button, Descriptions, Modal} from 'antd';
import {config, Content} from '@rc-lib/pc';

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
            title="${mn.chineseName}详情"
            footer={<Button onClick={onCancel}>关闭</Button>}
        >
            <Content loading={loading}>
                <Descriptions bordered size="small" labelStyle={{ width: 150 }}>
                    ${detailFields.map(item => `<Descriptions.Item label="${item.chinese}">{data.${item.__names.moduleName} ?? '-'}</Descriptions.Item>`).join('\n                    ')}
                </Descriptions>
            </Content>
        </Modal>
    );
});
        `;
    },
};
