import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';
import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';
import { SignatoryTable } from '@components/signatory-table/signatory-table.component';
import { SendEsigningForm } from '@utils/esigningFormSchema.yup';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { formSendType } from '../../constants';
import { SingleRecipient } from './components/single-recipient.component';

const EsigningRecipientHandler = () => {
  const { t } = useTranslation(['send-esigning', 'common']);

  const {
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<SendEsigningForm>();

  const signatories = watch('signatories') ?? [];

  const handleAdd = (partyId: string | undefined, name: string, email: string, personNumber: string) => {
    setValue('signatories', [...signatories, { partyId, name, email, personNumber }], {
      shouldValidate: true,
      shouldDirty: true,
    });
    clearErrors('signatories');
  };

  return (
    <div className="w-full flex justify-center">
      <HandlerWrapper title={t('send-esigning:recipientHandler.title')}>
        <div className="w-full gap-32">
          <SingleRecipient
            sendType={formSendType.ESIGNING}
            requireEmail
            existingPartyIds={signatories.map((signatory) => signatory.partyId)}
            onAdd={(recipient, email) =>
              handleAdd(
                recipient.partyId,
                `${recipient.address?.firstName ?? ''} ${recipient.address?.lastName ?? ''}`.trim(),
                email,
                recipient.personNumber ?? ''
              )
            }
          />

          <div className="w-full mt-40">
            <h3 className="mb-16 text-label-medium font-sans">{t('send-esigning:recipientHandler.signersLabel')}</h3>
            <p className="text-secondary pb-8">{t('send-esigning:recipientHandler.signersDescription')}</p>
            {signatories.length > 0 ? (
              <SignatoryTable showActions />
            ) : (
              <p className="text-secondary">{t('send-esigning:recipientHandler.noSigners')}</p>
            )}
            {errors.signatories?.message && <CustomFormErrorMessage message={errors.signatories.message} />}
          </div>
        </div>
      </HandlerWrapper>
    </div>
  );
};

export default EsigningRecipientHandler;
