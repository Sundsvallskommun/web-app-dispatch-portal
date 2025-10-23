import { Help } from './help.component';
import { HelpWrapper } from './help-wrapper';
import { EnumQATags } from './help-types';

interface IHelpComposerProps {
  show: boolean;
  closeHandler: () => void;
  helpType?: EnumQATags;
}

export const HelpComposer: React.FC<IHelpComposerProps> = ({ show, helpType, closeHandler }) => {
  return (
    <HelpWrapper label="Hjälp" closeHandler={closeHandler} show={show}>
      <div className="my-md py-8 px-40 flex flex-col gap-12 ">
        <h1>Behöver du hjälp att komma igång?</h1>
        <Help filterTag={helpType} />
      </div>
    </HelpWrapper>
  );
};
