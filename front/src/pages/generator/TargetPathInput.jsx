import React, {useEffect, useState} from 'react';
import {ExclamationCircleOutlined, CheckCircleOutlined} from '@ant-design/icons';
import ajax from 'src/commons/ajax';
import {Input} from 'antd';
import {stringFormat} from 'src/commons';

function TargetPathInput(props) {
    const { value, form, name, moduleNames, moduleChineseName, projectNames, checkExist, templateOptions, templateId, ...others } = props;
    const [exist, setExist] = useState(false);

    // 这个name不转string，放入依赖中，每次render都变，这个是数组。。。
    const nameStr = name.join(',');

    // value 改变 根据模块名，处理地址
    useEffect(() => {
        const path = value || templateOptions.find(item => item.value === templateId)?.record?.targetPath;
        if (!path) return;
        const val = path.includes('{') ? stringFormat(path, { ...moduleNames, moduleChineseName, ...projectNames }) : path;
        const name = nameStr.split(',');
        name[1] = window.parseInt(name[1], 10);
        form.setFields([{ name, value: val }]);
    }, [form, nameStr, value, moduleNames, templateId, templateOptions, moduleChineseName]);

    // moduleNames 改变 根据模块名，处理地址
    useEffect(() => {
        const path = templateOptions.find(item => item.value === templateId)?.record?.targetPath;
        const val = stringFormat(path, { ...moduleNames, moduleChineseName, ...projectNames });
        const name = nameStr.split(',');
        name[1] = window.parseInt(name[1], 10);
        form.setFields([{ name, value: val }]);
    }, [form, moduleNames, nameStr, templateId, templateOptions, moduleChineseName]);

    // 检测文件是否存在
    useEffect(() => {
        if (!value) return;
        const st = setTimeout(async () => {
            const exist = await ajax.post('/generate/file/exist', { targetPath: value }, { errorTip: false });
            setExist(exist);
        }, 300);
        return () => clearTimeout(st);
    }, [value, checkExist]);

    return (
        <div>
            <Input value={value} {...others} />
            <span style={{ marginLeft: 4 }}>
                {exist ? <ExclamationCircleOutlined style={{ color: 'orange' }}/> : <CheckCircleOutlined style={{ color: 'green' }}/>}
            </span>
        </div>
    );
}

export default React.memo(TargetPathInput);


