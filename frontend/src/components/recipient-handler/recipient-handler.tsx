import FileUpload from '@components/file-upload/file-upload.component';
import { RecipientList } from '@components/recipient-list/recipient-list';
import { getRecipient, getRecipients, ssnPattern, useMessageStore } from '@services/recipient-service';
import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Spinner,
  MenuBar,
  SearchField,
} from '@sk-web-gui/react';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FileListItemComponent } from '@components/file-list-item/file-list-item.component';

export interface RecipientListFormModel {
  recipientList: { file: File | undefined }[];
  singleRecipient: string;
}

const RecipientHandler: React.FC = () => {
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const [error, setError] = useState<string>();
  const setRecipients = useMessageStore((state) => state.setRecipients);
  const recipients = useMessageStore((state) => state.recipients);

  const [current, setCurrent] = React.useState<number | undefined>(0);
  const allowReplace = true;

  const {
    watch,
    setValue,
    setError: setFormError,
    register,
    formState: { errors, dirtyFields },
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
        setIsLoadingRecipients(false);
        setError('Något gick fel när mottagarlistan hanterades');
      });
  };
  const fetchRecipient = () => {
    setIsLoadingRecipients(true);
    setError(undefined);
    getRecipient(recipient.replace('-', '').replace(' ', ''))
      .then((res) => {
        setRecipients(recipients.concat(res));
        setIsLoadingRecipients(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoadingRecipients(false);
        setFormError('singleRecipient', { message: 'Kunde inte hämta person. Har du angivit personnumret korrekt?' });
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
    setValue('recipientList', []);
  }, [current]);

  const handleSubmitSingleRecipient = () => {
    if ((recipient && recipient?.length === 12) || recipient?.length === 13) {
      fetchRecipient();
      setValue('singleRecipient', '');
    } else if (recipient.length < 12) {
      setFormError('singleRecipient', { message: 'För få siffror i personnumret' });
    } else if (recipient.length > 13) {
      setFormError('singleRecipient', { message: 'För många siffror i personnumret' });
    }
  };

  const handleRemove = () => {
    setRecipients([]);
    setValue('singleRecipient', '');
    setValue('recipientList', []);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col items-start w-full border-1 border-divider rounded-cards pb-32">
        <h4 className="px-32 py-16">Lägg till mottagare</h4>
        <Divider className="w-full" orientation="horizontal" strong={false} />

        <div className="w-full px-32 pt-32 gap-32">
          <MenuBar current={current} className="px-0">
            <MenuBar.Item>
              <Button
                onClick={() => {
                  setCurrent(0);
                  handleRemove();
                }}
              >
                Enskilda mottagare
              </Button>
            </MenuBar.Item>
            <MenuBar.Item>
              <Button
                onClick={() => {
                  setCurrent(1);
                  handleRemove();
                }}
              >
                Importera mottagare
              </Button>
            </MenuBar.Item>
          </MenuBar>

          {current === 0 ? (
            <div className="flex flex-col gap-12 pt-32">
              <FormControl invalid={!!errors.singleRecipient}>
                <FormLabel>Personnummer</FormLabel>
                <SearchField
                  {...register('singleRecipient')}
                  value={recipient}
                  className="w-full"
                  showSearchButton={dirtyFields.singleRecipient && ssnPattern.test(recipient)}
                  showResetButton={recipients.length > 0 && recipient}
                  type="text"
                  size="md"
                  maxLength={13}
                  minLength={12}
                  placeholder="ååååmmddxxxx"
                  hideExtra
                  onReset={() => setValue('singleRecipient', '')}
                  onSearch={() => handleSubmitSingleRecipient()}
                />

                <FormHelperText className="w-full">Exempel: 198509101234</FormHelperText>
                {errors.singleRecipient && <FormErrorMessage>{errors.singleRecipient.message}</FormErrorMessage>}
              </FormControl>
            </div>
          ) : (
            <div className="flex flex-col gap-32 w-full pt-32">
              <FormControl id="attachment" className="w-full">
                <FileUpload
                  showLabel
                  fieldName="recipientList"
                  accept={['.csv', '.CSV']}
                  helperText="Tillåtna filtyper: csv"
                  allowMax={1}
                  allowReplace={allowReplace}
                />
              </FormControl>
            </div>
          )}

          {recipientList?.length && recipients.length && current === 1 ? (
            <div className="pt-24">
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
                <div>Hämtar mottagare</div>
              </>
            </div>
          )}
          <div>{error && <FormErrorMessage>{error}</FormErrorMessage>}</div>
          {recipients?.length > 0 && !isLoadingRecipients && (
            <div className="w-full mt-40">
              <h4 className="mb-16 text-h4-sm">Mottagare</h4>
              <RecipientList />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipientHandler;
