import { ReactElement, useState } from 'react';
import NextLink from 'next/link';
import { Button, cx, Icon, Link } from '@sk-web-gui/react';
import { CircleX, HelpCircle } from 'lucide-react';
import { HelpComposer } from '@components/help/help-composer';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from 'src/hooks/useWindowSize';
import { tailwindBreakPoint } from 'src/constants';

interface FormStepperHeaderProps {
  title: string;
  icon: ReactElement;
}

const FormStepperHeader = ({ title, icon }: FormStepperHeaderProps) => {
  const [showHelpComposer, setShowHelpComposer] = useState(false);
  const { width } = useWindowSize();
  const { t } = useTranslation(['common']);
  const isMd = width < tailwindBreakPoint.MD;
  const iconButtonClass =
    'focus:outline-none focus:ring-2 focus:ring-vattjom focus:ring-offset-2 rounded-full h-auto p-6';

  const openHelpComposer = () => setShowHelpComposer(true);
  const closeHelpComposer = () => setShowHelpComposer(false);

  return (
    <div className="flex grow justify-center px-80 py-16 w-full border-b-1 border-solid max-h-[78px]">
      <div className="flex grow items-center justify-between w-full max-w-[--max-w-7xl]">
        <NextLink href="/" passHref legacyBehavior>
          {isMd ? (
            <Button color="vattjom" aria-label={t('cancel')} className={iconButtonClass}>
              <Icon icon={<CircleX />} />
            </Button>
          ) : (
            <Link strong={true} variant="tertiary">
              {t('cancel')}
            </Link>
          )}
        </NextLink>
        <div className={cx('flex items-center gap-12', isMd ? 'm-12' : 'w-[--w-stepper-content] ml-[54px]')}>
          {!isMd && <Icon icon={icon} />}
          <h4 className="text-xs md:text-[2rem]">{title}</h4>
        </div>
        {isMd ? (
          <Button color="vattjom" onClick={openHelpComposer} aria-label={t('help')} className={iconButtonClass}>
            <Icon icon={<HelpCircle />} />
          </Button>
        ) : (
          <Button className="min-w-[10.4rem]" variant="secondary" onClick={openHelpComposer}>
            <Icon icon={<HelpCircle />} />
            {t('help')}
          </Button>
        )}
      </div>
      <HelpComposer show={showHelpComposer} closeHandler={closeHelpComposer} />
    </div>
  );
};

export default FormStepperHeader;
