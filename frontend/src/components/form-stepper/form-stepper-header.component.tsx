import { ReactElement, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { Button, cx, Icon, Link } from '@sk-web-gui/react';
import { CircleX, HelpCircle } from 'lucide-react';
import { HelpComposer } from '@components/help/help-composer';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from 'src/hooks/useWindowSize';
import { tailwindBreakPoint } from 'src/constants';
import { EnumQATags } from 'src/types';

interface FormStepperHeaderProps {
  title: string;
  icon: ReactElement;
  isSuccess?: boolean;
  helpType?: EnumQATags;
}

const FormStepperHeader = ({ title, icon, helpType, isSuccess = false }: FormStepperHeaderProps) => {
  const [showHelpComposer, setShowHelpComposer] = useState(false);
  const { width } = useWindowSize();
  const { t } = useTranslation(['common']);
  const isMd = width < tailwindBreakPoint.MD;

  const showHelpButton = true;
  const showCancelButton = useMemo(() => !isSuccess, [isSuccess]);
  const showTitle = useMemo(() => !isSuccess, [isSuccess]);

  const openHelpComposer = () => setShowHelpComposer(true);
  const closeHelpComposer = () => setShowHelpComposer(false);

  const justifyClass = !showCancelButton && !showTitle ? 'justify-end' : 'justify-between';

  let cancelButton: React.ReactNode;
  if (showCancelButton) {
    const content = isMd ? (
      <Button iconButton variant="secondary" className="border-0" aria-label={t('common:cancel')}>
        <Icon icon={<CircleX />} />
      </Button>
    ) : (
      <Link strong={true} variant="tertiary">
        {t('common:cancel')}
      </Link>
    );

    cancelButton = (
      <div className={cx(!isMd && 'pr-54')}>
        <NextLink href="/" passHref legacyBehavior>
          {content}
        </NextLink>
      </div>
    );
  }

  let helpButton: React.ReactNode;
  if (showHelpButton) {
    if (isMd) {
      helpButton = (
        <Button
          iconButton
          variant="secondary"
          className="border-0"
          onClick={openHelpComposer}
          aria-label={t('common:help')}
        >
          <Icon icon={<HelpCircle />} />
        </Button>
      );
    } else {
      helpButton = (
        <Button className="min-w-[10.4rem]" variant="secondary" onClick={openHelpComposer}>
          <Icon icon={<HelpCircle />} />
          {t('common:help')}
        </Button>
      );
    }
  } else {
    helpButton = <div className="px-54"></div>;
  }

  return (
    <div
      className={cx(
        'flex grow justify-center py-16 w-full border-b-1 border-solid max-h-[78px]',
        isMd ? 'px-16' : 'px-80'
      )}
    >
      <div className={cx('flex grow items-center w-full max-w-[--max-w-7xl]', justifyClass)}>
        {cancelButton}
        {showTitle && (
          <div className={cx('flex items-center gap-12', isMd ? 'm-12' : 'w-[--w-stepper-content]')}>
            {!isMd && <Icon icon={icon} />}
            <h4 className="text-xs md:text-[2rem]">{title}</h4>
          </div>
        )}
        {helpButton}
      </div>
      <HelpComposer show={showHelpComposer} closeHandler={closeHelpComposer} helpType={helpType} />
    </div>
  );
};

export default FormStepperHeader;
