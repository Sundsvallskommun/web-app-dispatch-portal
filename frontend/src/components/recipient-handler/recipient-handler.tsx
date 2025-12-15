import { AddWithAddressDialog } from '@components/add-with-address-dialog/add-with-address-dialog.component';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';
import { FileListItemComponent } from '@components/file-list-item/file-list-item.component';
import FileUpload from '@components/file-upload/file-upload.component';
import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';
import { RecipientTable } from '@components/recipient-table/recipient-table.component';
import { getRecipient, MAX_RECIPIENT_FILE_SIZE_MB, useMessageStore } from '@services/recipient-service';
import {
  Button,
  cx,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  RadioButton,
  SearchField,
  Spinner,
  useConfirm,
} from '@sk-web-gui/react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import React, { KeyboardEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Address, Recipient } from 'src/data-contracts/backend/data-contracts';
import { SendType } from 'src/types';
import { formSendType } from '../../constants';
import PreviewPerson from './preview-person';

export interface RecipientListFormModel {
  recipientList: { file: File | undefined }[];
  singleRecipient: string;
  storeRecipients: Partial<Recipient>[];
}

interface RecipientHandlerProps {
  sendType?: SendType;
}

const RecipientHandler = ({ sendType = formSendType.MAIL }: RecipientHandlerProps) => {
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const [error, setError] = useState<string>();
  const [foundPerson, setFoundPerson] = React.useState<Recipient>();
  const [current, setCurrent] = React.useState<number | undefined>(0);
  const [isAddWithAddressOpen, setIsAddWithAddressOpen] = useState(false);
  const { recipients, setRecipients, setAddresses, addresses } = useMessageStore();
  const allowReplace = true;
  const validRecipientLength = recipients.length;
  const combinedLength = validRecipientLength + addresses.length;
  const { t } = useTranslation(['send-mail', 'common', 'accessibility']);
  const confirm = useConfirm();

  const {
    watch,
    setValue,
    setError: setFormError,
    clearErrors,
    register,
    formState: { errors },
  } = useFormContext<RecipientListFormModel>();
  const [recipientList, recipient] = watch(['recipientList', 'singleRecipient']);

  const renderFormMessage = () => {
    if (errors.storeRecipients?.message) {
      return <CustomFormErrorMessage padded={false} message={errors.storeRecipients.message} />;
    } else if (errors.singleRecipient?.message) {
      return <CustomFormErrorMessage padded={false} message={errors.singleRecipient.message} />;
    } else {
      return <p className="text-small">{t('send-mail:recipientHandler.searchPersonalNumberHelper')}</p>;
    }
  };

  const fetchRecipient = () => {
    setIsLoadingRecipients(true);
    setError(undefined);
    getRecipient(recipient.replace('-', '').replace(' ', ''), sendType === formSendType.REK_MAIL)
      .then((res) => {
        // check for duplicates
        const alreadyExists = recipients.find((rec) => rec?.partyId === res?.partyId);
        if (alreadyExists) {
          setFormError('singleRecipient', {
            message: t('send-mail:recipientHandler.fetchRecipientError.alreadyExists'),
          });
          setIsLoadingRecipients(false);
          return;
        }

        if (sendType === formSendType.REK_MAIL) {
          setRecipients([res]);
        } else {
          setRecipients(recipients.concat(res));
        }
        setIsLoadingRecipients(false);
        setFoundPerson(undefined);
        clearErrors('singleRecipient');
      })
      .catch((e) => {
        console.error(e);
        setIsLoadingRecipients(false);
        setFormError('singleRecipient', {
          message: t('send-mail:recipientHandler.fetchRecipientError.singleRecipient'),
        });
      });
  };

  const findPerson = (SSN: string) => {
    getRecipient(SSN.replace('-', '').replace(' ', ''))
      .then((res) => {
        setFoundPerson(res);
      })
      .catch((e) => {
        setFoundPerson(undefined);
        console.error(e);
      });
  };

  const handleRemoveFile = () => {
    setValue('recipientList', []);
  };
  const resetAll = () => {
    setRecipients([]);
    setAddresses([]);
    setFoundPerson(undefined);
    clearErrors('storeRecipients');
    clearErrors('singleRecipient');
    clearErrors('recipientList');
    setValue('storeRecipients', []);
    setValue('recipientList', []);
  };

  useEffect(() => {
    clearErrors('singleRecipient');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipients, setFormError]);

  useEffect(() => {
    setRecipients([]);
    setFoundPerson(undefined);
    clearErrors('singleRecipient');
    setValue('storeRecipients', [...(recipients ?? []), ...(addresses ?? [])]);
    if (recipientList.length > 0) {
      setCurrent(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  useEffect(() => {
    clearErrors(['storeRecipients', 'singleRecipient']);
    const length = recipient.length;
    if (length >= 12) {
      findPerson(recipient);
      return;
    }
    setFoundPerson(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipient, setFormError]);

  const handleSwitchCurrent = (navigateTo: number) => {
    if (recipientList?.length > 0 || recipients?.length > 0) {
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

  const handleSubmitSingleRecipient = () => {
    if (foundPerson?.deliveryMethod === 'DELIVERY_NOT_POSSIBLE') return;

    if (sendType === formSendType.REK_MAIL && recipients.length > 0) {
      confirm
        .showConfirmation(
          t('send-mail:recipientHandler.rekMail.replaceRecipientConfirm.title'),
          t('send-mail:recipientHandler.rekMail.replaceRecipientConfirm.message'),
          t('send-mail:recipientHandler.rekMail.replaceRecipientConfirm.confirm'),
          t('send-mail:recipientHandler.rekMail.replaceRecipientConfirm.dismiss'),
          'info'
        )
        .then((confirm: boolean) => {
          if (confirm) {
            fetchRecipient();
          }
          setFoundPerson(undefined);
          setValue('singleRecipient', '');
        });
    } else {
      clearErrors(['singleRecipient', 'storeRecipients']);
      if (recipient && recipient?.replace('-', '').length === 12) {
        fetchRecipient();
        setValue('singleRecipient', '');
        setFoundPerson(undefined);
      } else if (recipient.length < 12) {
        setFormError('singleRecipient', { message: t('send-mail:recipientHandler.personalNumberError.fewNumber') });
      } else if (recipient.length > 13) {
        setFormError('singleRecipient', {
          message: t('send-mail:recipientHandler.personalNumberError.tooManyNumbers'),
        });
      }
    }
  };

  const handleCloseAddWithAddressDialog = (closeData: Address | undefined) => {
    if (closeData) {
      const newAdress: Partial<Recipient> = {
        deliveryMethod: 'SNAIL_MAIL',
        address: closeData,
      };
      // find duplicates
      const alreadyExists = addresses.some(
        (recipient) =>
          recipient?.address === newAdress?.address &&
          recipient?.address?.firstName === newAdress?.address?.firstName &&
          recipient?.address?.lastName === newAdress?.address?.lastName &&
          recipient?.address?.zipCode === newAdress?.address?.zipCode &&
          recipient?.address?.city === newAdress?.address?.city &&
          recipient?.address?.careOf === newAdress?.address?.careOf
      );

      if (alreadyExists) {
        // TODO: show error message?
        setIsAddWithAddressOpen(false);
        return;
      }
      clearErrors('storeRecipients');
      setAddresses(addresses.concat(newAdress));
    }
    setIsAddWithAddressOpen(false);
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmitSingleRecipient();
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
              <FormControl className="w-full medium-device:w-[365px]" invalid={!!errors.singleRecipient}>
                <div className="flex flex-col w-full gap-8 pb-24">
                  <FormLabel>{t('send-mail:recipientHandler.searchPersonalNumber')}</FormLabel>
                  <SearchField
                    {...register('singleRecipient')}
                    data-cy="person-search-field"
                    value={recipient}
                    className="w-full"
                    showResetButton={recipient.length > 0}
                    type="text"
                    size="md"
                    maxLength={13}
                    minLength={12}
                    placeholder="Sök"
                    showSearchButton={false}
                    onKeyDown={handleEnter}
                    onReset={() => {
                      setValue('singleRecipient', '');
                      setFoundPerson(undefined);
                    }}
                  />
                  {renderFormMessage()}

                  {foundPerson?.address && (
                    <PreviewPerson
                      person={foundPerson}
                      handleSubmit={handleSubmitSingleRecipient}
                      sendType={sendType}
                    />
                  )}
                </div>

                {sendType === formSendType.MAIL && (
                  <div className="my-32">
                    <AddWithAddressDialog open={isAddWithAddressOpen} onClose={handleCloseAddWithAddressDialog} />
                    <p className="font-bold">{t('send-mail:recipientHandler.missingPersonalNumber')}</p>
                    <Button
                      data-cy="add-with-address-button"
                      leftIcon={<Icon icon={<Plus />} />}
                      onClick={() => setIsAddWithAddressOpen(true)}
                      color="vattjom"
                      inverted
                    >
                      {t('send-mail:recipientHandler.addRecipientWithAddress')}
                    </Button>
                  </div>
                )}
              </FormControl>
            </div>
          ) : (
            <div className="flex flex-col gap-32 w-full pt-32">
              <FormControl id="attachment" className="w-full">
                <FileUpload
                  showLabel
                  fieldName="recipientList"
                  accept={['.csv', '.CSV']}
                  allowMultiple={false}
                  helperText={t('send-mail:recipientHandler.csvHelperText')}
                  allowMax={1}
                  allowReplace={allowReplace}
                  maxFileSizeMB={MAX_RECIPIENT_FILE_SIZE_MB}
                  onErrorReset={() => {
                    setError(undefined);
                    setRecipients([]);
                  }}
                />
              </FormControl>
            </div>
          )}

          {isLoadingRecipients && (
            <div className="my-lg flex flex-col items-center justify-center gap-sm">
              <>
                <div>
                  <Spinner className="h-32 w-32" />
                </div>
                <div>{t('send-mail:recipientHandler.fetchingRecipient')}</div>
              </>
            </div>
          )}
          <div>{error && <FormErrorMessage className="my-8">{error}</FormErrorMessage>}</div>

          {combinedLength > 0 && !isLoadingRecipients && (
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
