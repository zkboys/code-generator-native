import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { PageContent } from '@ra-lib/admin';
import Fast from './Fast';
import Single from './Single';
import config from 'src/commons/config-hoc'
import s from './style.less';

const { TabPane } = Tabs;

export default config({path: '/gen'})(function Gen() {
    const [activeKey, setActiveKey] = useState('single');
    useEffect(() => {
        // 触发 window resize 事件，重新调整页面高度
        if (document.createEvent) {
            const ev = document.createEvent('HTMLEvents');
            ev.initEvent('resize', true, true);
            window.dispatchEvent(ev);
        } else if (document.createEventObject) {
            window.fireEvent('onresize');
        }
    }, [activeKey]);
    return (
        <PageContent className={s.root}>
            <Tabs activeKey={activeKey} onChange={activeKey => setActiveKey(activeKey)}>
                <TabPane key="single" tab="单独生成">
                    <Single />
                </TabPane>
                <TabPane key="fast" tab="快速生成">
                    <Fast />
                </TabPane>
            </Tabs>
        </PageContent>
    );
})
