import {useEffect, useState} from 'react';
import {ExclamationCircleOutlined, CheckCircleOutlined} from '@ant-design/icons';
import ajax from 'src/commons/ajax';
import {Input} from 'antd';
import {stringFormat} from 'src/commons';

export default function TargetPathInput(props) {
    const { value, onChange, moduleNames, ...others } = props;
    const [exist, setExist] = useState(false);

    useEffect(() => {
        if (!value) return;
        const nextValue = stringFormat(value, moduleNames);
        onChange(nextValue);
        const st = setTimeout(async () => {
            const exist = await ajax.post('/generate/file/exist', { targetPath: nextValue });
            setExist(exist);
            console.log(exist);
        }, 300);
        return () => clearTimeout(st);
    }, [value, moduleNames, onChange]);
    return (
        <div>
            <Input value={value} onChange={onChange} {...others}/>
            <span style={{ marginLeft: 4 }}>
                {exist ? <ExclamationCircleOutlined style={{ color: 'orange' }}/> : <CheckCircleOutlined style={{ color: 'green' }}/>}
            </span>
        </div>
    );
}


