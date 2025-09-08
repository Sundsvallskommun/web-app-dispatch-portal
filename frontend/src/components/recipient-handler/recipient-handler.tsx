import { AddWithAddressDialog } from '@components/add-with-address-dialog/add-with-address-dialog.component';
import { FileListItemComponent } from '@components/file-list-item/file-list-item.component';
import FileUpload from '@components/file-upload/file-upload.component';
import { RecipientList } from '@components/recipient-list/recipient-list';
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
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  SearchField,
  Link,
  Spinner,
  RadioButton,
  cx,
  Modal,
} from '@sk-web-gui/react';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export interface RecipientListFormModel {
  recipientList: { file: File | undefined }[];
  singleRecipient: string;
}

const RecipientHandler: React.FC = () => {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const [error, setError] = useState<string>();
  const setRecipients = useMessageStore((state) => state.setRecipients);
  const recipients = useMessageStore((state) => state.recipients);
  const [foundPerson, setFoundPerson] = React.useState<RecipientWithAddress>();

  const setAddresses = useMessageStore((state) => state.setAddresses);
  const addresses = useMessageStore((state) => state.addresses);

  const [current, setCurrent] = React.useState<number | undefined>(0);
  const allowReplace = true;

  const [isAddWithAddressOpen, setIsAddWithAddressOpen] = useState(false);

  const validRecipientLength = recipients.filter((rec) => !rec?.error).length;
  const invalidRecipient = recipients.filter((rec) => rec?.error);

  const combinedLength = validRecipientLength + addresses.length;

  const {
    watch,
    setValue,
    setError: setFormError,
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
            errorMessage = t('recipientHandler.errorHandler.noFile');
            break;
          case 'MAX_SIZE':
            errorMessage = `Filen får ej överstiga ${MAX_RECIPIENT_FILE_SIZE_MB}MB`;
            break;
          case 'MAX_RECIPIENT_ROW_SIZE':
            errorMessage = `Filen får inte innehålla fler än ${MAX_RECIPIENT_ROW_SIZE} rader`;
            break;
          default:
            errorMessage = 'Något gick fel när mottagarlistan hanterades';
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
          setFormError('singleRecipient', { message: 'Personen är readan tillagd.' });
          setIsLoadingRecipients(false);
          return;
        }

        setRecipients(recipients.concat(res));
        setIsLoadingRecipients(false);
        setFoundPerson(undefined);
        setFormError('singleRecipient', { message: undefined });
      })
      .catch((e) => {
        console.error(e);
        setIsLoadingRecipients(false);
        setFormError('singleRecipient', { message: 'Kunde inte hämta person. Har du angivit personnumret korrekt?' });
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
    setFormError('singleRecipient', { message: undefined });
    setAddresses([]);
    setValue('recipientList', []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  useEffect(() => {
    setFormError('singleRecipient', { message: undefined });
    const length = recipient.length;
    if (length >= 12) {
      findPerson(recipient);
      return;
    }
    setFoundPerson(undefined);
  }, [recipient, setFormError]);

  const handleSwitchCurrent = (navigateTo: number) => {
    if (combinedLength > 0 && current === 0) {
      setIsWarningOpen(true);
      return;
    }
    setCurrent(navigateTo);
  };

  const handleSubmitSingleRecipient = () => {
    if ((recipient && recipient?.length === 12) || recipient?.length === 13) {
      fetchRecipient();
      setValue('singleRecipient', '');
      setFoundPerson(undefined);
    } else if (recipient.length < 12) {
      setFormError('singleRecipient', { message: 'För få siffror i personnumret' });
    } else if (recipient.length > 13) {
      setFormError('singleRecipient', { message: 'För många siffror i personnumret' });
    }
  };

  const handleRemove = () => {
    setRecipients([]);
    setFoundPerson(undefined);
    setFormError('singleRecipient', { message: undefined });
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
        label="Vill du lägga till mottagare med mottagarlista?"
        className="w-[40rem]"
      >
        <Modal.Content>
          <p>Alla mottagare du har lagt till med personnummer eller adress kommer att försvinna.</p>
        </Modal.Content>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => onCloseWarningModal(false)}>
            Avbryt
          </Button>
          <Button color="vattjom" onClick={() => onCloseWarningModal(true)}>
            Ja, fortsätt
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="flex flex-col items-start w-full border-1 border-divider rounded-cards gap-56 p-32">
        <div className="w-full">
          <h4 className="pb-6">Lägg till mottagare</h4>
          <p className="text-base pb-6">
            Lägg till mottagare med personnummer eller adress, eller ladda upp en mottagarlista i CSV-format. Använd
            gärna <Link href="/files/example.csv">exempelfilen (csv)</Link> när du skapar en mottagarlista.
          </p>
          <p className="text-base pb-6">
            Ska du skicka post till en mottagare som har särskild postadress? Då behöver du ange adressen manuellt.
            Klicka på knappen ”Lägg till med adress”.
          </p>
          <Divider className="w-full" orientation="horizontal" strong={false} />
        </div>

        <div className="w-full gap-32">
          <h3 className="text-label-medium">Hur vill du lägga till mottagare?</h3>
          <div className="flex flex-col md:flex-row gap-24 mt-12 mb-32">
            <div
              className={cx(
                'flex-1 border rounded-groups p-16',
                current === 0 ? 'border-dark-primary' : 'border-divider'
              )}
            >
              <RadioButton value="0" onChange={() => handleSwitchCurrent(0)} checked={current === 0}>
                Med personnummer eller adress
              </RadioButton>
            </div>
            <div
              className={cx(
                'flex-1 border rounded-groups p-16',
                current === 1 ? 'border-dark-primary' : 'border-divider'
              )}
            >
              <RadioButton value="1" onChange={() => handleSwitchCurrent(1)} checked={current === 1}>
                Med mottagarlista
              </RadioButton>
            </div>
          </div>

          {current === 0 ? (
            <div className="flex flex-col gap-12 pt-32">
              <FormControl className="w-full medium-device:w-[365px]" invalid={!!errors.singleRecipient}>
                <div className="relative w-full">
                  <FormLabel className="text-label-medium">
                    Sök på personnummer <span className="font-normal">(ååååmmddxxxx)</span>
                  </FormLabel>
                  <SearchField
                    {...register('singleRecipient')}
                    value={recipient}
                    className="w-full"
                    showSearchButton={false}
                    // showSearchButton={dirtyFields.singleRecipient && ssnPattern.test(recipient)}
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
                    onSearch={() => handleSubmitSingleRecipient()}
                  />
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
                        Lägg till mottagare
                      </Button>
                    </div>
                  )}
                </div>

                {/* <FormHelperText className="w-full">Exempel: 199001012385</FormHelperText> */}
                {errors.singleRecipient && <FormErrorMessage>{errors.singleRecipient.message}</FormErrorMessage>}

                <AddWithAddressDialog open={isAddWithAddressOpen} onClose={handleCloseAddWithAddressDialog} />
                <Button onClick={() => setIsAddWithAddressOpen(true)} color="vattjom" inverted>
                  Lägg till med adress
                </Button>
              </FormControl>
            </div>
          ) : (
            <div className="flex flex-col gap-32 w-full pt-32">
              <FormControl id="attachment" className="w-full">
                <FileUpload
                  showLabel
                  fieldName="recipientList"
                  accept={['.csv', '.CSV']}
                  helperText="Tillåtna filtyper: csv. Maximalt antal rader: 250"
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
              <h4 className="text-label-medium mb-12">Tillagd fil</h4>
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
                <div>{t('recipientHandler.fetchingReceiver')}</div>
              </>
            </div>
          )}
          <div>{error && <FormErrorMessage className="my-8">{error}</FormErrorMessage>}</div>

          {invalidRecipient?.length > 0 && !isLoadingRecipients && (
            <div className="mt-56">
              <h4 className="text-label-medium">Ogiltiga mottagare ({invalidRecipient.length})</h4>
              <p className="text-small text-secondary">
                Mottagarna kunde inte läggas till. Kontrollera att personnumren är fullständiga och korrekt skrivna,
                ååååmmddxxxx. Ladda sedan upp filen igen.
              </p>

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
              {current === 0 && <h4 className="mb-16 text-h4-sm">Tillagda mottagare ({combinedLength})</h4>}
              {current === 1 && (
                <h4 className="mb-16 text-h4-sm">Tillagda mottagare från fil ({validRecipientLength})</h4>
              )}
              <RecipientList />
            </div>
          )}
        </div>
        {combinedLength < 1 && current === 0 && (
          <div>
            <h3 className="text-label-medium">Tillagda mottagare</h3>
            <p className="text-base">Du har inte lagt till några mottagare än.</p>
          </div>
        )}
        {recipients?.length < 1 && current === 1 && (
          <div>
            <h3 className="text-label-medium">Tillagd fil</h3>
            <p className="text-base">Du har inte lagt till någon fil än.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientHandler;
