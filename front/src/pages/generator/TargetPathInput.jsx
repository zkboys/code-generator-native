import {useEffect, useCallback, useState} from 'react';
import {ExclamationCircleOutlined, CheckCircleOutlined} from '@ant-design/icons';
import ajax from 'src/commons/ajax';
import {Input} from 'antd';
import {stringFormat} from 'src/commons';

export default function TargetPathInput(props) {
    const { value, form, name, moduleNames, templateOptions, templateId, ...others } = props;
    const [exist, setExist] = useState(false);

    // 根据模块名，处理地址
    useEffect(() => {
        const path = templateOptions.find(item => item.value === templateId)?.record?.targetPath;
        const value = stringFormat(path, moduleNames);
        form.setFields([{ name, value }]);
    }, [form, name, moduleNames, templateId, templateOptions]);

    // 检测文件是否存在
    useEffect(() => {
        if (!value) return;
        const st = setTimeout(async () => {
            const exist = await ajax.post('/generate/file/exist', { targetPath: value });
            setExist(exist);
        }, 300);
        return () => clearTimeout(st);
    }, [value]);

    return (
        <div>
            <Input value={value} {...others} />
            <span style={{ marginLeft: 4 }}>
                {exist ? <ExclamationCircleOutlined style={{ color: 'orange' }}/> : <CheckCircleOutlined style={{ color: 'green' }}/>}
            </span>
        </div>
    );
}


