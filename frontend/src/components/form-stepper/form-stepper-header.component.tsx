import { ReactElement, useState } from 'react';
import NextLink from 'next/link';
import { Button, Icon, Link } from '@sk-web-gui/react';
import { HelpCircle } from 'lucide-react';
import { HelpComposer } from '@components/help/help-composer';
import { useTranslation } from 'react-i18next';

interface FormStepperHeaderProps {
  title: string;
  icon: ReactElement;
}

const FormStepperHeader = ({ title, icon }: FormStepperHeaderProps) => {
  const [showHelpComposer, setShowHelpComposer] = useState(false);
  const { t } = useTranslation(['common']);

  const openHelpComposer = () => setShowHelpComposer(true);
  const closeHelpComposer = () => setShowHelpComposer(false);

  return (
    <div className="flex grow justify-center px-80 py-16 w-full border-b-1 border-solid max-h-[78px]">
      <div className="flex grow items-center justify-between w-full max-w-[--max-w-7xl]">
        <NextLink href="/" passHref legacyBehavior>
          <Link strong={true} variant="tertiary">
            {t('cancel')}
          </Link>
        </NextLink>
        <div className="flex items-center gap-12 w-[--w-stepper-content] ml-[54px]">
          <Icon icon={icon} />
          <h4>{title}</h4>
        </div>
        <Button className="min-w-[10.4rem]" variant="secondary" onClick={openHelpComposer}>
          <Icon icon={<HelpCircle />} />
          {t('help')}
        </Button>
      </div>
      <HelpComposer show={showHelpComposer} closeHandler={closeHelpComposer} />
    </div>
  );
};

export default FormStepperHeader;
