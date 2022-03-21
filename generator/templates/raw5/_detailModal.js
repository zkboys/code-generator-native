module.exports = {
    name: 'DetailModal',
    targetPath: '{parentPath}/detailModal.jsx',
    getContent: config => {
        const { moduleNames: mn, file, fields, NULL_LINE } = config;
        const { options = [] } = file;

        // 返回false不生成文件
        if (!options.includes('详情')) return false;

        const ignore = ['id', 'updatedAt', 'createdAt', 'isDeleted'];
        const detailFields = fields.filter(item => item.fieldOptions.includes('详情') && !ignore.includes(item.__names.moduleName));
        return `
import {useState, useEffect} from 'react';
import {Button, Descriptions, Modal} from 'antd';
import {ModalContent} from '@ra-lib/adm';
import config from 'src/commons/config-hoc';

export default config({
    modalFunction: true,
})(function ${mn.ModuleName}EditModal(props) {
    const { record, onCancel, commonProps} = props;
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
        <Modal
            {...commonProps}
            title="详情"
        >
            <ModalContent
                loading={loading}
                footer={<Button onClick={onCancel}>关闭</Button>}
            >
                <Descriptions bordered size="small" labelStyle={{ width: 150 }}>
                    ${detailFields.map(item => `<Descriptions.Item label="${item.chinese}">{data.${item.__names.moduleName} ?? '-'}</Descriptions.Item>`).join('\n                ')}
                </Descriptions>
        </ModalContent>
        </Modal>
    );
});
        `;
    },
};
