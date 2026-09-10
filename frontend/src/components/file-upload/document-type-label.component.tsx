import { Label } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';

export interface DocumentTypeLabelProps {
  isSignatoryDocument: boolean;
}

export const DocumentTypeLabel = ({ isSignatoryDocument }: DocumentTypeLabelProps) => {
  const { t } = useTranslation(['send-esigning']);

  return (
    <Label
      data-cy="document-type-label"
      className="order-1"
      rounded
      inverted
      color={isSignatoryDocument ? 'gronsta' : 'vattjom'}
    >
      {t(
        isSignatoryDocument
          ? 'send-esigning:attachmentHandler.signingLabel'
          : 'send-esigning:attachmentHandler.attachmentLabel'
      )}
    </Label>
  );
};
