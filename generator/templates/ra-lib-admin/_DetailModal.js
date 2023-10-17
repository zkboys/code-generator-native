module.exports = {
    filePath: __filename, // 用于读取当前文件内容
    name: 'DetailModal',
    targetPath: '{parentPath}/DetailModal.jsx',
    getContent: config => {
        const { moduleNames: mn, file, fields, ignoreFields } = config;
        const { options = [] } = file;

        // 返回false不生成文件
        if (!options.includes('详情')) return false;

        const detailFields = fields.filter(item => item.fieldOptions.includes('详情') && !ignoreFields.includes(item.__names.moduleName));
        return `
import React, {useState, useEffect} from 'react';
import {Button, Descriptions} from 'antd';
import {ModalContent} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';

export default config({
    modal: {
        title: '详情',
        width: '70%',
        top: 50,
    },
})(function ${mn.ModuleName}DetailModal(props) {
    const { record, onCancel } = props;
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
        <ModalContent
            bodyStyle={{ padding: 0 }}
            loading={loading}
            footer={<Button onClick={onCancel}>关闭</Button>}
        >
            <Descriptions bordered size="small" labelStyle={{ width: 150 }}>
                ${detailFields.map(item => `<Descriptions.Item label="${item.chinese}">{data.${item.__names.moduleName} ?? '-'}</Descriptions.Item>`).join('\n                ')}
            </Descriptions>
        </ModalContent>
    );
});
        `;
    },
};
