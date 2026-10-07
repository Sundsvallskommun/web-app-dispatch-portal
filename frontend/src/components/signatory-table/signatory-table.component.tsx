import { AutoTable, AutoTableHeader, Button, Icon } from '@sk-web-gui/react';
import { SendEsigningForm } from '@utils/esigningFormSchema.yup';
import { formatLegalId } from '@utils/helpers';
import { ArrowDown, ArrowUp, Trash } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export type Signatory = SendEsigningForm['signatories'][number];

const swapSignatories = (signatories: Array<Signatory>, a: number, b: number): Array<Signatory> => {
  const reordered = [...signatories];
  [reordered[a], reordered[b]] = [reordered[b], reordered[a]];
  return reordered;
};

interface SignatoryTableProps {
  showActions?: boolean;
}

export const SignatoryTable: React.FC<SignatoryTableProps> = ({ showActions = false }) => {
  const { t } = useTranslation(['send-esigning', 'common']);
  const { watch, setValue } = useFormContext<SendEsigningForm>();

  const signatories = watch('signatories') ?? [];

  const handleRemove = (partyId?: string) => {
    setValue(
      'signatories',
      signatories.filter((signatory) => signatory.partyId !== partyId),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    setValue('signatories', swapSignatories(signatories, fromIndex, toIndex), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const actions: Array<AutoTableHeader> = showActions
    ? [
        {
          label: t('send-esigning:recipientHandler.order'),
          screenReaderOnly: true,
          columnPosition: 'right',
          isColumnSortable: false,
          renderColumn: (_value, item) => {
            const signatory = item as Signatory;
            const index = signatories.indexOf(signatory);

            return (
              <div className="flex flex-1 justify-end items-center gap-4">
                <Button
                  data-cy="move-signatory-up-button"
                  aria-label={t('send-esigning:recipientHandler.moveUp', { name: signatory.name })}
                  disabled={index <= 0}
                  onClick={() => handleMove(index, index - 1)}
                  leftIcon={<Icon icon={<ArrowUp />} />}
                  iconButton
                  variant="ghost"
                />
                <Button
                  data-cy="move-signatory-down-button"
                  aria-label={t('send-esigning:recipientHandler.moveDown', { name: signatory.name })}
                  disabled={index < 0 || index >= signatories.length - 1}
                  onClick={() => handleMove(index, index + 1)}
                  leftIcon={<Icon icon={<ArrowDown />} />}
                  iconButton
                  variant="ghost"
                />
                <Button
                  data-cy="delete-signatory-button"
                  aria-label={t('common:remove')}
                  variant="ghost"
                  onClick={() => handleRemove(signatory.partyId)}
                  leftIcon={<Icon icon={<Trash />} />}
                />
              </div>
            );
          },
        },
      ]
    : [];

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
    },
    {
      label: t('send-esigning:recipientHandler.emailLabel'),
      isColumnSortable: false,
      renderColumn: (_value, item) => <span data-cy="signatory-email">{(item as Signatory).email}</span>,
    },
  ];

  return (
    <AutoTable
      data-cy="signatory-table"
      autodata={signatories}
      autoheaders={[...headers, ...actions]}
      pageSize={signatories.length || 1}
      footer={false}
      tableSortable={false}
    />
  );
};
