import {useState, useEffect} from 'react';

export default (WrappedComponent) => {
    return props => {
        const { visible, onCancel } = props;
        const [destroyed, setDestroyed] = useState(true);

        useEffect(() => {
            if (visible) {
                setDestroyed(false);
            } else {
                // 等待动画
                const st = setTimeout(() => setDestroyed(true), 500);
                return () => clearTimeout(st);
            }
        }, [visible]);

        if (destroyed) return null;

        const commonProps = {
            visible,
            maskClosable: false,
            width: 1000,
            onCancel: onCancel,
            style: { top: 50 },
            bodyStyle: { padding: 0 },
        };

        return <WrappedComponent {...props} commonProps={commonProps}/>;
    };
}
