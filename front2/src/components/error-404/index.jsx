import React from 'react';
import { Result, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import PageContent from '../page-content';

export default function Error404(props) {
  const { homePath = '/' } = props;
  let navigate = useNavigate();

  return (
    <PageContent
      fitHeight
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="您访问的页面不存在"
        extra={
          <Space>
            <Button type="primary" onClick={() => navigate(homePath, { replace: true })}>返回首页</Button>
            <Button onClick={() => navigate('../')}>返回上个页面</Button>
          </Space>
        }
      />
    </PageContent>
  );
}
