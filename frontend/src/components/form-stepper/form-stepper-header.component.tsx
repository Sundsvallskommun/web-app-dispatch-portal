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
  isSuccess?: boolean;
}

const FormStepperHeader = ({ title, icon, isSuccess = false }: FormStepperHeaderProps) => {
  const [showHelpComposer, setShowHelpComposer] = useState(false);
  const { width } = useWindowSize();
  const { t } = useTranslation(['common']);
  const isMd = width < tailwindBreakPoint.MD;
  const openHelpComposer = () => setShowHelpComposer(true);
  const closeHelpComposer = () => setShowHelpComposer(false);

  const helpButton = isMd ? (
    <Button iconButton variant="secondary" className="border-0" onClick={openHelpComposer} aria-label={t('help')}>
      <Icon icon={<HelpCircle />} />
    </Button>
  ) : (
    <Button className="min-w-[10.4rem]" variant="secondary" onClick={openHelpComposer}>
      <Icon icon={<HelpCircle />} />
      {t('help')}
    </Button>
  );

  const cancelButton = (
    <NextLink href="/" passHref legacyBehavior>
      {isMd ? (
        <Button iconButton variant="secondary" className="border-0" aria-label={t('cancel')}>
          <Icon icon={<CircleX />} />
        </Button>
      ) : (
        <Link strong={true} variant="tertiary">
          {t('cancel')}
        </Link>
      )}
    </NextLink>
  );

  return (
    <div
      className={cx(
        'flex grow justify-center py-16 w-full border-b-1 border-solid max-h-[78px]',
        isMd ? 'px-16' : 'px-80'
      )}
    >
      <div
        className={cx(
          'flex grow items-center w-full max-w-[--max-w-7xl]',
          isSuccess ? 'justify-end' : 'justify-between'
        )}
      >
        {!isSuccess && cancelButton}
        {!isSuccess && (
          <div className={cx('flex items-center gap-12', isMd ? 'm-12' : 'w-[--w-stepper-content] ml-[54px]')}>
            {!isMd && <Icon icon={icon} />}
            <h4 className="text-xs md:text-[2rem]">{title}</h4>
          </div>
        )}
        {helpButton}
      </div>
      <HelpComposer show={showHelpComposer} closeHandler={closeHelpComposer} />
    </div>
  );
};

export default FormStepperHeader;
