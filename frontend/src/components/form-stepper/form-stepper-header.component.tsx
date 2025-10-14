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
  showCancelButton?: boolean;
  showTitle?: boolean;
  showHelpButton?: boolean;
}

const FormStepperHeader = ({
  title,
  icon,
  showCancelButton = true,
  showTitle = true,
  showHelpButton = true,
}: FormStepperHeaderProps) => {
  const [showHelpComposer, setShowHelpComposer] = useState(false);
  const { width } = useWindowSize();
  const { t } = useTranslation(['common']);
  const isMd = width < tailwindBreakPoint.MD;

  const openHelpComposer = () => setShowHelpComposer(true);
  const closeHelpComposer = () => setShowHelpComposer(false);

  const justifyClass = !showCancelButton && !showTitle ? 'justify-end' : 'justify-between';

  return (
    <div
      className={cx(
        'flex grow justify-center py-16 w-full border-b-1 border-solid max-h-[78px]',
        isMd ? 'px-16' : 'px-80'
      )}
    >
      <div className={cx('flex grow items-center w-full max-w-[--max-w-7xl]', justifyClass)}>
        {showCancelButton && (
          <div className={cx(!isMd && 'pr-54')}>
            <NextLink href="/" passHref legacyBehavior>
              {isMd ? (
                <Button iconButton variant="secondary" className="border-0" aria-label={t('common:cancel')}>
                  <Icon icon={<CircleX />} />
                </Button>
              ) : (
                <Link strong={true} variant="tertiary">
                  {t('common:cancel')}
                </Link>
              )}
            </NextLink>
          </div>
        )}
        {showTitle && (
          <div className={cx('flex items-center gap-12', isMd ? 'm-12' : 'w-[--w-stepper-content]')}>
            {!isMd && <Icon icon={icon} />}
            <h4 className="text-xs md:text-[2rem]">{title}</h4>
          </div>
        )}
        {showHelpButton ? (
          isMd ? (
            <Button
              iconButton
              variant="secondary"
              className="border-0"
              onClick={openHelpComposer}
              aria-label={t('common:help')}
            >
              <Icon icon={<HelpCircle />} />
            </Button>
          ) : (
            <Button className="min-w-[10.4rem]" variant="secondary" onClick={openHelpComposer}>
              <Icon icon={<HelpCircle />} />
              {t('common:help')}
            </Button>
          )
        ) : (
          <div className="px-54"></div>
        )}
      </div>
      <HelpComposer show={showHelpComposer} closeHandler={closeHelpComposer} />
    </div>
  );
};

export default FormStepperHeader;
