import { AddWithAddressDialog } from '@components/add-with-address-dialog/add-with-address-dialog.component';
import { FileListItemComponent } from '@components/file-list-item/file-list-item.component';
import FileUpload from '@components/file-upload/file-upload.component';
import {
  AddWithAddress,
  getRecipient,
  getRecipients,
  MAX_RECIPIENT_FILE_SIZE_MB,
  MAX_RECIPIENT_ROW_SIZE,
  RecipientWithAddress,
  useMessageStore,
} from '@services/recipient-service';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  SearchField,
  Link,
  Spinner,
  RadioButton,
  cx,
  Modal,
  Icon,
} from '@sk-web-gui/react';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'next-i18next';
import { Info, Plus } from 'lucide-react';
import { RecipientTable } from 'src/recipient-table/recipient-table.component';
import { formSendType } from '../../constants';

export interface RecipientListFormModel {
  recipientList: { file: File | undefined }[];
  singleRecipient: string;
  storeRecipients: string;
}

export type RecipientHandlerSendType = (typeof formSendType)[keyof typeof formSendType];

interface RecipientHandlerProps {
  sendType?: RecipientHandlerSendType;
}

const RecipientHandler = ({ sendType = formSendType.MAIL }: RecipientHandlerProps) => {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const [error, setError] = useState<string>();
  const [foundPerson, setFoundPerson] = React.useState<RecipientWithAddress>();
  const [current, setCurrent] = React.useState<number | undefined>(0);
  const [isAddWithAddressOpen, setIsAddWithAddressOpen] = useState(false);
  const setRecipients = useMessageStore((state) => state.setRecipients);
  const setAddresses = useMessageStore((state) => state.setAddresses);
  const recipients = useMessageStore((state) => state.recipients);
  const addresses = useMessageStore((state) => state.addresses);
  const allowReplace = true;
  const validRecipientLength = recipients.filter((rec) => !rec?.error).length;
  const invalidRecipient = recipients.filter((rec) => rec?.error);
  const combinedLength = validRecipientLength + addresses.length;
  const { t } = useTranslation(['send-mail', 'common', 'accessibility']);

  const {
    watch,
    setValue,
    setError: setFormError,
    clearErrors,
    register,
    formState: { errors },
  } = useFormContext<RecipientListFormModel>();
  const recipientList = watch('recipientList');
  const recipient = watch('singleRecipient');

  const fetchRecipients = () => {
    setIsLoadingRecipients(true);
    setError(undefined);
    setValue('singleRecipient', '');
    getRecipients(recipientList)
      .then((res) => {
        setRecipients(res);
        setIsLoadingRecipients(false);
      })
      .catch((e) => {
        console.error(e);
        let errorMessage: string;
        switch (e.message) {
          case 'NO_FILE':
            errorMessage = t('send-mail:recipientHandler.errorHandler.noFile');
            break;
          case 'MAX_SIZE':
            errorMessage = t('send-mail:recipientHandler.errorHandler.maxSize', { size: MAX_RECIPIENT_FILE_SIZE_MB });
            break;
          case 'MAX_RECIPIENT_ROW_SIZE':
            errorMessage = t('send-mail:recipientHandler.errorHandler.maxRow', { rows: MAX_RECIPIENT_ROW_SIZE });
            break;
          default:
            errorMessage = t('send-mail:recipientHandler.errorHandler.default');
        }
        setIsLoadingRecipients(false);
        setError(errorMessage);
        setRecipients([]);
      });
  };
  const fetchRecipient = () => {
    setIsLoadingRecipients(true);
    setError(undefined);
    getRecipient(recipient.replace('-', '').replace(' ', ''))
      .then((res) => {
        // check for duplicates
        const alreadyExists = recipients.find(
          (rec) => rec?.recipient?.personnumber === res[0]?.recipient?.personnumber
        );
        if (alreadyExists) {
          setFormError('singleRecipient', {
            message: t('send-mail:recipientHandler.fetchRecipientError.alreadyExists'),
          });
          setIsLoadingRecipients(false);
          return;
        }

        setRecipients(recipients.concat(res));
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
        setFoundPerson(res[0]);
      })
      .catch((e) => {
        setFoundPerson(undefined);
        console.error(e);
      });
  };

  useEffect(() => {
    clearErrors('singleRecipient');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipients, setFormError]);

  useEffect(() => {
    if (recipientList?.length === 1) {
      if (recipients?.length < 1) {
        fetchRecipients();
      } else {
        if (allowReplace) {
          fetchRecipients();
        }
      }
    } else {
      setRecipients([]);
    }
    //eslint-disable-next-line
  }, [recipientList]);

  useEffect(() => {
    setRecipients([]);
    setFoundPerson(undefined);
    clearErrors('singleRecipient');
    setAddresses([]);
    setValue('recipientList', []);
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
    if (combinedLength > 0 && current === 0) {
      setIsWarningOpen(true);
      return;
    }
    setCurrent(navigateTo);
  };

  const handleSubmitSingleRecipient = () => {
    clearErrors(['singleRecipient', 'storeRecipients']);
    if ((recipient && recipient?.length === 12) || recipient?.length === 13) {
      fetchRecipient();
      setValue('singleRecipient', '');
      setFoundPerson(undefined);
    } else if (recipient.length < 12) {
      setFormError('singleRecipient', { message: t('send-mail:recipientHandler.personalNumberError.fewNumber') });
    } else if (recipient.length > 13) {
      setFormError('singleRecipient', { message: t('send-mail:recipientHandler.personalNumberError.tooManyNumbers') });
    }
  };

  const handleRemove = () => {
    setRecipients([]);
    setFoundPerson(undefined);
    clearErrors('singleRecipient');
    setValue('singleRecipient', '');
    setValue('recipientList', []);
  };

  const handleCloseAddWithAddressDialog = (closeData: AddWithAddress | undefined) => {
    if (closeData) {
      const { firstName, lastName, address, careOf, zipCode, city } = closeData;
      const addWithAdress: AddWithAddress = {
        firstName,
        lastName,
        address,
        careOf,
        zipCode,
        city,
      };
      // find duplicates
      const alreadyExists = addresses.find(
        (rec) =>
          rec?.address === addWithAdress?.address &&
          rec?.firstName === addWithAdress?.firstName &&
          rec?.lastName === addWithAdress?.lastName &&
          rec?.zipCode === addWithAdress?.zipCode &&
          rec?.city === addWithAdress?.city &&
          rec?.careOf === addWithAdress?.careOf
      );

      if (alreadyExists) {
        // TODO: show error message?
        setIsAddWithAddressOpen(false);
        return;
      }

      setAddresses(addresses.concat(addWithAdress));
    }
    setIsAddWithAddressOpen(false);
  };

  const onCloseWarningModal = (shouldNavigate: boolean) => {
    if (shouldNavigate) {
      setCurrent(1);
    }
    setIsWarningOpen(false);
  };

  return (
    <div className="w-full flex justify-center">
      <Modal
        show={isWarningOpen}
        onClose={() => onCloseWarningModal(false)}
        label={t('send-mail:recipientHandler.modalLabel')}
        className="w-[40rem]"
      >
        <Modal.Content>
          <p>{t('send-mail:recipientHandler.modalWarning')}</p>
        </Modal.Content>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => onCloseWarningModal(false)}>
            {t('common:cancel')}
          </Button>
          <Button color="vattjom" onClick={() => onCloseWarningModal(true)}>
            {t('common:yesContinue')}
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        className={cx(
          'flex flex-col items-start w-full rounded-cards shadow-50 p-32',
          sendType === formSendType.REK_MAIL ? 'gap-40' : 'gap-64'
        )}
      >
        <div className="w-full">
          <h4 className="pb-6">{t('send-mail:recipientHandler.title')}</h4>
          {sendType === formSendType.MAIL ? (
            <React.Fragment>
              <p className="text-base pb-6">
                <Trans
                  i18nKey="send-mail:recipientHandler.contentFirstRow"
                  components={{
                    Link: <Link href="/files/example.csv" />,
                  }}
                />
              </p>
              <p className="text-base pb-6">{`${t('send-mail:recipientHandler.contentSecondRow')}.`}</p>
            </React.Fragment>
          ) : (
            <p className="text-base pb-6">{`${t('send-mail:recipientHandler.rekMail.content')}.`}</p>
          )}
        </div>
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
                <div className="flex flex-col w-full gap-8">
                  <FormLabel className="text-label-medium">
                    <Trans
                      i18nKey="send-mail:recipientHandler.searchPersonalNumber"
                      components={{
                        span: <span className="font-normal" />,
                      }}
                    />
                  </FormLabel>
                  <SearchField
                    {...register('singleRecipient')}
                    value={recipient}
                    className="w-full"
                    showSearchButton={false}
                    showResetButton={recipient.length > 0}
                    type="text"
                    size="md"
                    maxLength={13}
                    minLength={12}
                    placeholder="Sök"
                    hideExtra
                    onReset={() => {
                      setValue('singleRecipient', '');
                      setFoundPerson(undefined);
                    }}
                    onSearch={() => {
                      handleSubmitSingleRecipient();
                    }}
                  />
                  <p className="text-xs m-0">{t('send-mail:recipientHandler.searchPersonalNumberHelper')}</p>

                  {foundPerson?.address && (
                    <div className="preview-person absolute mt-4 bg-background-content p-16 rounded-button border-1 border-divider w-full z-10">
                      <p className="text-body text-base font-bold">
                        {foundPerson.address.givenname} {foundPerson.address.lastname}
                      </p>
                      <p className="text-small">{foundPerson.address?.personNumber}</p>
                      <p className="text-small">
                        {foundPerson.address?.addresses[0].address}, {foundPerson.address?.addresses[0].city}
                      </p>

                      <Button className="mt-16" onClick={() => handleSubmitSingleRecipient()}>
                        {t('send-mail:recipientHandler.addRecipient')}
                      </Button>
                    </div>
                  )}
                </div>

                {errors.storeRecipients?.message && (
                  <FormErrorMessage className="text-error-text-primary flex items-center gap-8">
                    <Icon size="1.6rem" icon={<Info />} color="error" /> {errors.storeRecipients.message}
                  </FormErrorMessage>
                )}
                {errors.singleRecipient?.message && (
                  <FormErrorMessage className="text-error-text-primary flex items-center gap-8">
                    <Icon size="1.6rem" icon={<Info />} color="error" /> {errors.singleRecipient.message}
                  </FormErrorMessage>
                )}
                {sendType === formSendType.MAIL && (
                  <React.Fragment>
                    <AddWithAddressDialog open={isAddWithAddressOpen} onClose={handleCloseAddWithAddressDialog} />
                    <p className="font-bold">{t('send-mail:recipientHandler.missingPersonalNumber')}</p>
                    <Button
                      leftIcon={<Icon icon={<Plus />} />}
                      onClick={() => setIsAddWithAddressOpen(true)}
                      color="vattjom"
                      inverted
                    >
                      {t('send-mail:recipientHandler.addRecipientWithAddress')}
                    </Button>
                  </React.Fragment>
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

          {recipientList?.length && recipients?.length && current === 1 ? (
            <div className="mt-56">
              <h4 className="text-label-medium mb-12">{t('send-mail:recipientHandler.csvAddedFile')}</h4>
              <FileListItemComponent data={recipientList[0]} handleRemove={handleRemove} />
            </div>
          ) : (
            <></>
          )}
          {isLoadingRecipients && (
            <div className="my-lg flex flex-col items-center justify-center gap-sm">
              <>
                <div>
                  <Spinner className="h-32 w-32"></Spinner>
                </div>
                <div>{t('send-mail:recipientHandler.fetchingRecipient')}</div>
              </>
            </div>
          )}
          <div>{error && <FormErrorMessage className="my-8">{error}</FormErrorMessage>}</div>

          {invalidRecipient?.length > 0 && !isLoadingRecipients && (
            <div className="mt-56">
              <h4 className="text-label-medium">
                {t('send-mail:recipientHandler.errorHandler.invalidRecipient', { num: invalidRecipient.length })}
              </h4>
              <p className="text-small text-secondary">{`${t('send-mail:recipientHandler.errorHandler.invalidRecipient')}.`}</p>
              <div className="mt-12 border-1 rounded-groups border-error-surface-primary">
                {invalidRecipient.map((rec, index) => (
                  <div
                    key={`inv-rec-${index}-${rec?.recipient?.personnumber}`}
                    className="py-16 px-18 border-b-1 border-divider last:border-0"
                  >
                    <p className="text-small text-secondary">{rec?.recipient?.personnumber}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {combinedLength > 0 && !isLoadingRecipients && (
            <div className="w-full mt-40">
              {current === 0 && (
                <h3 className="mb-16 text-label-medium font-sans">
                  {t('send-mail:recipientHandler.addedRecipientNum', { num: combinedLength })}
                </h3>
              )}
              {current === 1 && (
                <h3 className="mb-16 text-label-medium font-sans">
                  {t('send-mail:recipientHandler.addedFromFileNum', { num: validRecipientLength })}
                </h3>
              )}
              <div className="w-full">
                <RecipientTable showRemoveButton sendType={formSendType.REK_MAIL} />
              </div>
            </div>
          )}
        </div>
        {combinedLength < 1 && current === 0 && (
          <div>
            <h3 className="text-label-medium font-sans">{t('send-mail:recipientHandler.addedRecipientsTitle')}</h3>
            <p className="text-base">{`${t('send-mail:recipientHandler.noRecipientAdded')}.`}</p>
          </div>
        )}
        {recipients?.length < 1 && current === 1 && (
          <div>
            <h3 className="text-label-medium font-sans">{t('send-mail:recipientHandler.addedFileTitle')}</h3>
            <p className="text-base">{`${t('send-mail:recipientHandler.noFileAdded')}.`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientHandler;
