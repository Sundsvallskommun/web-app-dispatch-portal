import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';
import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';
import { AutoTable, AutoTableHeader, Button, Icon } from '@sk-web-gui/react';
import { formatLegalId } from '@utils/helpers';
import { SendEsigningForm } from '@utils/esigningFormSchema.yup';
import { ArrowDown, ArrowUp, Trash } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { formSendType } from '../../constants';
import { SingleRecipient } from './components/single-recipient.component';

type Signatory = SendEsigningForm['signatories'][number];

const EsigningRecipientHandler = () => {
  const { t } = useTranslation(['send-esigning', 'send-mail', 'common']);

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

  const handleRemove = (partyId?: string) => {
    setValue(
      'signatories',
      signatories.filter((signatory) => signatory.partyId !== partyId),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const handleMove = (index: number, offset: number) => {
    const target = index + offset;
    if (index < 0 || target < 0 || target >= signatories.length) return;

    const reordered = [...signatories];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setValue('signatories', reordered, { shouldValidate: true, shouldDirty: true });
  };

  const headers: Array<AutoTableHeader> = [
    {
      label: t('send-esigning:recipientHandler.recipients'),
      isColumnSortable: false,
      renderColumn: (_value, item) => {
        const signatory = item as Signatory;
        return (
          <div data-cy="signatory">
            <p data-cy="signatory-name">{signatory.name}</p>
            {signatory.personNumber && <p data-cy="signatory-person-number">{formatLegalId(signatory.personNumber)}</p>}
          </div>
        );
      },
    } as AutoTableHeader,
    {
      label: t('send-esigning:recipientHandler.emailLabel'),
      isColumnSortable: false,
      renderColumn: (_value, item) => <span data-cy="signatory-email">{(item as Signatory).email}</span>,
    } as AutoTableHeader,
    {
      label: t('send-esigning:recipientHandler.order'),
      screenReaderOnly: true,
      columnPosition: 'right',
      isColumnSortable: false,
      renderColumn: (_value, item) => {
        const index = signatories.indexOf(item as Signatory);
        return (
          <div className="flex justify-end gap-4">
            <Button
              data-cy="move-signatory-up-button"
              aria-label={t('send-esigning:recipientHandler.moveUp', { name: (item as Signatory).name })}
              disabled={index <= 0}
              onClick={() => handleMove(index, -1)}
              leftIcon={<Icon icon={<ArrowUp />} />}
              iconButton
            />
            <Button
              data-cy="move-signatory-down-button"
              aria-label={t('send-esigning:recipientHandler.moveDown', { name: (item as Signatory).name })}
              disabled={index < 0 || index >= signatories.length - 1}
              onClick={() => handleMove(index, 1)}
              leftIcon={<Icon icon={<ArrowDown />} />}
              iconButton
            />
          </div>
        );
      },
    } as AutoTableHeader,
    {
      label: t('common:remove'),
      screenReaderOnly: true,
      columnPosition: 'right',
      isColumnSortable: false,
      renderColumn: (_value, item) => (
        <div className="flex flex-1 justify-end text-right">
          <Button
            data-cy="delete-signatory-button"
            aria-label={t('common:remove')}
            variant="tertiary"
            onClick={() => handleRemove((item as Signatory).partyId)}
            leftIcon={<Icon icon={<Trash />} />}
            showBackground
          >
            {t('common:remove')}
          </Button>
        </div>
      ),
    } as AutoTableHeader,
  ];

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
              <AutoTable
                data-cy="signatory-table"
                autodata={signatories}
                autoheaders={headers}
                pageSize={signatories.length || 1}
                footer={false}
                tableSortable={false}
              />
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
