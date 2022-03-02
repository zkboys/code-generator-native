import React from 'react';
import Prism from 'prismjs';
import { CodeEditor } from 'src/components';

export default class SourceCode extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    state = {
        containerHeight: 'auto',
    };

    componentDidMount() {
        this.highlight();

        this.setHeight();
        window.addEventListener('resize', this.setHeight);
    }

    componentDidUpdate() {
        this.highlight();
    }

    setHeight = () => {
        const winHeight = document.documentElement.clientHeight || document.body.clientHeight;
        const height = winHeight - 286;

        this.setState({ containerHeight: height });
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.setHeight);
    }

    highlight = () => {
        console.log(this.ref);
        if (this.ref && this.ref.current) {
            Prism.highlightElement(this.ref.current);
        }
    };

    render() {
        const { code } = this.props;
        const { containerHeight } = this.state;
        return (
            <div ref={node => this.container = node} style={{ height: containerHeight }}>
                <CodeEditor
                    showHeader={false}
                    value={code}
                    readOnly
                />
            </div>
        );
    }
}
