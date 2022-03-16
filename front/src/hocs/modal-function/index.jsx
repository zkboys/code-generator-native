import ReactDOM from 'react-dom';

export default WrappedComponent => {

    return (config = {}) => {
        const container = document.createDocumentFragment();

        let currentConfig = { ...config, onCancel, close, visible: true };

        function render(props) {
            setTimeout(() => {
                // 公共属性
                const commonProps = {
                    maskClosable: false,
                    width: 1000,
                    onCancel: props.onCancel,
                    style: { top: 50 },
                    bodyStyle: { padding: 0 },
                };

                ReactDOM.render(
                    <WrappedComponent {...props} commonProps={commonProps}/>,
                    container,
                );
            });
        }

        function destroy(...args) {
            ReactDOM.unmountComponentAtNode(container);
            const triggerCancel = args.some(param => param && param.triggerCancel);
            if (config.onCancel && triggerCancel) {
                config.onCancel(...args);
            }
        }

        function onCancel(...args) {
            // 用户没有传递onCancel函数，直接关闭
            if (!config.onCancel) return close(...args);

            // 调用用户传递的onCancel函数
            const res = config.onCancel(...args);

            // 如果是promise，成功之后才关闭，失败不关闭
            if (res?.then) {
                res.then(() => close(...args));
            } else {
                // 不是promise，直接关闭
                close(...args);
            }
        }

        function close(...args) {
            currentConfig = {
                ...currentConfig,
                visible: false,
                afterClose: () => {
                    if (typeof config.afterClose === 'function') {
                        config.afterClose();
                    }
                    destroy.apply(this, args);
                },
            };
            render(currentConfig);
        }

        function update(configUpdate) {
            if (typeof configUpdate === 'function') {
                currentConfig = configUpdate(currentConfig);
            } else {
                currentConfig = {
                    ...currentConfig,
                    ...configUpdate,
                };
            }
            render(currentConfig);
        }

        render(currentConfig);

        // webpack热更新之后，销毁当前弹框
        if (process.env.NODE_ENV === 'development') {
            const socket = new WebSocket(`ws://${window.location.host}/ws`);
            socket.onmessage = event => event.data === '{"type":"invalid"}' && destroy();
        }

        return {
            close,
            destroy,
            update,
        };
    };
}
