module.exports = {
    name: 'DetailModal',
    targetPath: '{parentPath}/DetailModal.jsx',
    getContent: config => {
        const { moduleNames: mn, file, fields, NULL_LINE } = config;
        const { options = [] } = file;

        // 返回false不生成文件
        if (!options.includes('详情')) return false;

        const ignore = ['id', 'updatedAt', 'createdAt', 'isDeleted'];
        const detailFields = fields.filter(item => item.fieldOptions.includes('详情') && !ignore.includes(item.__names.moduleName));
        return `
import {useState, useEffect} from 'react';
import {Button, Descriptions} from 'antd';
import {ModalContent} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';

export default config({
    modal: {
        title: '详情',
        width: '70%',
        top: 50,
    },
})(function ${mn.ModuleName}EditModal(props) {
    const { record, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    // 初始化，查询详情数据
    useEffect(() => {
        (async () => {
            const res = await props.ajax.get('/${mn.module_names}', { id: record?.id }, [], { setLoading });
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
