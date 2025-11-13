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
    <FormErrorMessage data-cy="form-error-message" className={cx('flex gap-8', padded ? 'mt-8' : 'mt-auto')}>
      <Icon className="mt-5 shrink-0" size={16} icon={<Info />} color="error" />
      <p className="text-error">{message ? t(message) : ''}</p>
    </FormErrorMessage>
  );
};

export default CustomFormErrorMessage;
