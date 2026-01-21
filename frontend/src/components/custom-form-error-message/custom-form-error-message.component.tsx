import { FormErrorMessage } from '@sk-web-gui/react';
import { useTranslation } from 'react-i18next';

interface CustomFormErrorMessageProps {
  message: string | undefined;
}

const CustomFormErrorMessage = ({ message }: CustomFormErrorMessageProps) => {
  const { t } = useTranslation();

  return <FormErrorMessage data-cy="form-error-message">{message ? t(message) : ''}</FormErrorMessage>;
};

export default CustomFormErrorMessage;
