import { Help } from './help.component';
import { HelpWrapper } from './help-wrapper';
import { useTranslation } from 'react-i18next';
import { EnumQATags } from 'src/types';

interface IHelpComposerProps {
  show: boolean;
  closeHandler: () => void;
  helpType?: EnumQATags;
}

export const HelpComposer: React.FC<IHelpComposerProps> = ({ show, helpType, closeHandler }) => {
  const { t } = useTranslation(['help-menu']);
  const headerMap: Record<string, string> = {
    [EnumQATags.SMS]: t('help-menu:smsHeader'),
    [EnumQATags.MAIL]: t('help-menu:mailHeader'),
    [EnumQATags.REK_MAIL]: t('help-menu:rekMailHeader'),
  };
  const helpHeader = helpType ? headerMap[helpType] : t('help-menu:generalHeader');
  return (
    <HelpWrapper label="Hjälp" closeHandler={closeHandler} show={show}>
      <div className="my-md py-8 px-40 flex flex-col gap-24 ">
        <p className="text-h4-lg font-header m-0">{helpHeader}</p>
        <Help filterTag={helpType} />
      </div>
    </HelpWrapper>
  );
};
