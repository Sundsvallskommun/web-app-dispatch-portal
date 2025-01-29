import { useState } from 'react';
import { Help } from './help.component';
import { Input, Modal } from '@sk-web-gui/react';
import { HelpWrapper } from './help-wrapper';

export const HelpComposer: React.FC<{
  show: boolean;
  closeHandler: () => void;
}> = (props) => {
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState<boolean>(false);

  const closeAttachmentModal = () => {
    setIsAttachmentModalOpen(false);
  };

  return (
    <>
      <HelpWrapper label="Hjälp" closeHandler={props.closeHandler} show={props.show}>
        <div className="my-md py-8 px-40 flex flex-col gap-12 ">
          <Input type="hidden" />
          <Input type="hidden" />
          <h1>Behöver du hjälp att komma igång?</h1>
          <Help />
        </div>
      </HelpWrapper>

      <Modal show={isAttachmentModalOpen} onClose={closeAttachmentModal} label="Ladda upp bilaga" className="w-[40rem]">
        <Modal.Content>
          <Help />
        </Modal.Content>

        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};
