import { ModalContent } from 'src/components';
import { modal } from 'src/hocs';


export default modal('我的弹框')(function MyModal() {

  return (
    <ModalContent>
      弹框
    </ModalContent>
  );
});
