import { HelpComposer } from '@components/help/help-composer';
import { Button, cx, Icon, useThemeQueries } from '@sk-web-gui/react';
import { CircleX, HelpCircle } from 'lucide-react';
import NextLink from 'next/link';
import { ReactElement, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EnumQATags } from 'src/types';

interface FormStepperHeaderProps {
  title: string;
  icon: ReactElement;
  isSuccess?: boolean;
  helpType?: EnumQATags;
}

const FormStepperHeader = ({ title, icon, helpType, isSuccess = false }: FormStepperHeaderProps) => {
  const [showHelpComposer, setShowHelpComposer] = useState(false);
  const { t } = useTranslation(['common']);
  const { isMaxSm } = useThemeQueries();
  const showCancelButton = useMemo(() => !isSuccess, [isSuccess]);
  const showTitle = useMemo(() => !isSuccess, [isSuccess]);
  const openHelpComposer = () => setShowHelpComposer(true);
  const closeHelpComposer = () => setShowHelpComposer(false);
  const justifyClass = !showCancelButton && !showTitle ? 'justify-end' : 'justify-between';

  const cancelButton = isMaxSm ? (
    <NextLink href="/" data-cy="cancel-mobile-button" aria-label={t('common:cancel')}>
      <Icon icon={<CircleX />} />
    </NextLink>
  ) : (
    <NextLink href="/" data-cy="cancel-button" className="sk-link text-dark-secondary font-bold">
      {t('common:cancel')}
    </NextLink>
  );

  const helpButton = isMaxSm ? (
    <button
      data-cy="help-button"
      className="text-dark-secondary"
      onClick={openHelpComposer}
      aria-label={t('common:help')}
    >
      <Icon icon={<HelpCircle />} />
    </button>
  ) : (
    <Button data-cy="help-button" variant="secondary" onClick={openHelpComposer}>
      <Icon icon={<HelpCircle />} />
      {t('common:help')}
    </Button>
  );

  return (
    <div
      data-cy="header"
      className={cx(
        'flex grow justify-center py-16 w-full border-b-1 border-solid max-h-[78px]',
        isMaxSm ? 'px-16' : 'px-80'
      )}
    >
      <div className={cx('flex grow items-center w-full max-w-[--max-w-7xl]', justifyClass)}>
        <div className={cx(!isMaxSm && 'pr-54')}>{showCancelButton && cancelButton}</div>
        {showTitle && (
          <div className={cx('flex items-center gap-12', isMaxSm ? 'm-12' : 'w-[--w-stepper-content]')}>
            {!isMaxSm && <Icon icon={icon} />}
            <h1 className="text-h4-sm md:text-h4-md xl:text-h4-lg m-0">{title}</h1>
          </div>
        )}
        {helpButton}
      </div>
      <HelpComposer show={showHelpComposer} closeHandler={closeHelpComposer} helpType={helpType} />
    </div>
  );
};

export default FormStepperHeader;
