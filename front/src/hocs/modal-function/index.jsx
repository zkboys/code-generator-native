import ReactDOM from 'react-dom';

export default WrappedComponent => {

    return (config = {}) => {
        const container = document.createDocumentFragment();

        let currentConfig = { ...config, onCancel: close, visible: true };

        function render(props) {
            setTimeout(() => {
                ReactDOM.render(
                    <WrappedComponent{...props}/>,
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

        return {
            destroy: close,
            update,
        };
    };
}
