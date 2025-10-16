import { cx, FormErrorMessage, Icon } from '@sk-web-gui/react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CustomFormErrorMessageProps {
  message: string | undefined;
  padded?: boolean;
}

const CustomFormErrorMessage = ({ message, padded = true }: CustomFormErrorMessageProps) => {
  const { t } = useTranslation(['send-mail', 'common']);

  return (
    <FormErrorMessage className={cx('flex items-center gap-8', padded ? 'mt-8' : 'mt-auto')}>
      <Icon size={16} icon={<Info />} color="error" />
      <p className="text-error">{message ? t(message) : ''}</p>
    </FormErrorMessage>
  );
};

export default CustomFormErrorMessage;
