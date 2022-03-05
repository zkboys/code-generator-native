import { useEffect, useState } from 'react';
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ajax from 'src/commons/ajax';
import { Input } from 'antd';
import { stringFormat } from 'src/commons';
import { usePrevious } from 'ahooks';

export default function TargetPathInput(props) {
  const { value, onChange, moduleNames, templateOptions, templateId, ...others } = props;
  const [exist, setExist] = useState(false);
  const prevModuleNames = usePrevious(moduleNames);

  useEffect(() => {
    if (!value) return;
    let val = value;
    if (prevModuleNames !== moduleNames) {
      val = templateOptions.find(item => item.value === templateId)?.record?.targetPath;
    }
    const nextValue = stringFormat(val, moduleNames);
    onChange(nextValue);
    const st = setTimeout(async () => {
      const exist = await ajax.post('/generate/file/exist', { targetPath: nextValue });
      setExist(exist);
    }, 300);
    return () => clearTimeout(st);
  }, [value, moduleNames, onChange, prevModuleNames, templateOptions, templateId]);
  return (
    <div>
      <Input value={value} onChange={onChange} {...others} />
      <span style={{ marginLeft: 4 }}>
                {exist ? <ExclamationCircleOutlined style={{ color: 'orange' }} /> : <CheckCircleOutlined style={{ color: 'green' }} />}
            </span>
    </div>
  );
}


