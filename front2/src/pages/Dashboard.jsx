import { useState } from 'react';
import { Button } from 'antd';
import { PageContent } from 'src/components';
import MyModal from './MyModal';

export default function Dashboard() {
  const [visible, setVisible] = useState(false);

  return (
    <PageContent>
      <Button type="primary" onClick={() => setVisible(true)}>好的</Button>
      <MyModal
        visible={visible}
        onCancel={() => setVisible(false)}
      />
    </PageContent>
  );
}
