import { FileListItemComponent } from '@components/file-list-item/file-list-item.component';
import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';
import { RecipientTable } from '@components/recipient-table/recipient-table.component';
import { useMessageStore } from '@services/recipient-service';
import { cx, RadioButton, useConfirm } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Csv, Recipient } from 'src/data-contracts/backend/data-contracts';
import { SendType } from 'src/types';
import { formSendType } from '../../constants';
import { CsvRecipients } from './components/csv-file.component';
import { SingleAddress } from './components/single-address.component';
import { SingleRecipient } from './components/single-recipient.component';
import { Attachment } from '@components/attachment-handler/attachment-handler';

export interface RecipientListFormModel {
  recipientList: Array<Csv & Attachment>;
  storeRecipients: Partial<Recipient>[];
}

interface RecipientHandlerProps {
  sendType?: SendType;
}

const RecipientHandler = ({ sendType = formSendType.MAIL }: RecipientHandlerProps) => {
  const [current, setCurrent] = React.useState<number | undefined>(0);

  const { recipients, setRecipients, setAddresses, addresses } = useMessageStore();
  const validRecipientLength = recipients.length;
  const combinedLength = validRecipientLength + addresses.length;
  const { t } = useTranslation(['send-mail', 'common', 'accessibility']);
  const confirm = useConfirm();

  const { watch, setValue, clearErrors } = useFormContext<RecipientListFormModel>();
  const [recipientList] = watch(['recipientList']);

  const handleRemoveFile = () => {
    setValue('recipientList', []);
  };
  const resetAll = () => {
    setRecipients([]);
    setAddresses([]);
    clearErrors('storeRecipients');
    clearErrors('recipientList');
    setValue('storeRecipients', []);
    setValue('recipientList', []);
  };

  useEffect(() => {
    setValue('storeRecipients', [...(recipients ?? []), ...(addresses ?? [])]);
    if (recipientList.length > 0) {
      setCurrent(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSwitchCurrent = (navigateTo: number) => {
    if (recipientList?.length > 0 || combinedLength > 0) {
      confirm
        .showConfirmation(
          t(`send-mail:recipientHandler.changeTo.${navigateTo === 0 ? 'person' : 'list'}.label`),
          t(`send-mail:recipientHandler.changeTo.${navigateTo === 0 ? 'person' : 'list'}.text`),
          t('common:yesContinue'),
          t('common:cancel')
        )
        .then((confirm) => {
          if (confirm) {
            resetAll();
            setCurrent(navigateTo);
          }
        });
    } else {
      resetAll();
      setCurrent(navigateTo);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <HandlerWrapper
        title={t('send-mail:recipientHandler.title')}
        description={
          sendType === formSendType.MAIL
            ? t('send-mail:recipientHandler.contentFirstRow')
            : t('send-mail:recipientHandler.rekMail.content')
        }
      >
        <div className="w-full gap-32">
          {sendType === formSendType.MAIL && (
            <div className="flex flex-col">
              <h3 className="text-label-medium">{t('send-mail:recipientHandler.howAddRecipient')}</h3>
              <div className="flex flex-col md:flex-row gap-24 mt-12 mb-32">
                <div
                  className={cx(
                    'flex-1 border rounded-groups p-16',
                    current === 0 ? 'border-dark-primary' : 'border-divider'
                  )}
                >
                  <RadioButton value="0" onChange={() => handleSwitchCurrent(0)} checked={current === 0}>
                    {t('send-mail:recipientHandler.optionPersonalNumberOrAddress')}
                  </RadioButton>
                </div>
                {
                  <div
                    className={cx(
                      'flex-1 border rounded-groups p-16',
                      current === 1 ? 'border-dark-primary' : 'border-divider'
                    )}
                  >
                    <RadioButton value="1" onChange={() => handleSwitchCurrent(1)} checked={current === 1}>
                      {t('send-mail:recipientHandler.optionRecipientList')}
                    </RadioButton>
                  </div>
                }
              </div>
            </div>
          )}
          {current === 0 ? (
            <div className={cx('flex flex-col gap-12', sendType === formSendType.MAIL && 'pt-32')}>
              <SingleRecipient sendType={sendType} />
              <SingleAddress sendType={sendType} />
            </div>
          ) : (
            <CsvRecipients />
          )}

          {combinedLength > 0 && (
            <div className="w-full mt-40">
              {current === 0 && (
                <h3 className="mb-16 text-label-medium font-sans">
                  {sendType === formSendType.MAIL
                    ? t('send-mail:recipientHandler.addedRecipientNum', { num: combinedLength })
                    : t('send-mail:recipientHandler.addedRecipientsTitle')}
                </h3>
              )}
              {current === 1 && (
                <h3 className="mb-16 text-label-medium font-sans">
                  {t('send-mail:recipientHandler.addedFromFileNum', { num: validRecipientLength })}
                </h3>
              )}
              <div className="w-full">
                <RecipientTable showRemoveButton sendType={sendType} />
              </div>
            </div>
          )}
        </div>
        {combinedLength < 1 && current === 0 && (
          <div>
            <h3 className="text-label-medium font-sans">{t('send-mail:recipientHandler.addedRecipientsTitle')}</h3>
            <p className="text-secondary">{`${t('send-mail:recipientHandler.noRecipientAdded')}.`}</p>
          </div>
        )}
        {current === 1 && (
          <div className="flex flex-col w-full">
            <h3 className="text-label-medium font-sans">{t('send-mail:recipientHandler.addedFileTitle')}</h3>
            {recipientList?.length < 1 ? (
              <p className="text-base">{`${t('send-mail:recipientHandler.noFileAdded')}`}</p>
            ) : (
              <FileListItemComponent
                data-cy="recipientlist"
                noBorder
                data={recipientList[0]}
                handleRemove={handleRemoveFile}
              />
            )}
          </div>
        )}
      </HandlerWrapper>
    </div>
  );
};

export default RecipientHandler;
