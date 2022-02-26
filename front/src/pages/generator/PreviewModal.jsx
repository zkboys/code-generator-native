import React, {Component} from 'react';
import {Tabs, Button} from 'antd';
import config from 'src/commons/config-hoc';
import {ModalContent} from '@ra-lib/admin';
import SourceCode from './SourceCode';

const {TabPane} = Tabs;

@config({
    modal: {
        title: '代码预览',
        width: '70%',
        top: 50,
    },
})
export default class index extends Component {
    state = {};

    render() {
        const {previewCode, onCancel} = this.props;
        return (
            <ModalContent
                surplusSpace
                footer={<Button onClick={onCancel}>关闭</Button>}
                bodyStyle={{padding: 0}}
            >
                <Tabs tabBarStyle={{margin: '0 16px'}}>
                    {previewCode.map(item => {
                        const {config: {fileTypeName}, code} = item;
                        return (
                            <TabPane tab={fileTypeName} key={fileTypeName}>
                                <SourceCode
                                    language="jsx"
                                    plugins={['line-numbers']}
                                    code={code}
                                />
                            </TabPane>
                        );
                    })}
                </Tabs>
            </ModalContent>
        );
    }
}
