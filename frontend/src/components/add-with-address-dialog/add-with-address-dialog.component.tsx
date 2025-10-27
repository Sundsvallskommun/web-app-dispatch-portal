import React, { useMemo, useRef } from 'react';
import { Button, Input, FormControl, FormLabel, FormErrorMessage, Modal } from '@sk-web-gui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

interface AddWithAddressDialogFormModel {
  firstName: string;
  lastName: string;
  address: string;
  careOf?: string;
  zipCode: string;
  city: string;
}

interface AddWithAddressDialogProps {
  open: boolean;
  onClose: (data?: AddWithAddressDialogFormModel) => void;
  addWithAddressDialogForm?: AddWithAddressDialogFormModel;
}

const formSchema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  address: yup.string().required(),
  careOf: yup.string().optional(),
  zipCode: yup.string().required(),
  city: yup.string().required(),
});

const defaultValues = {
  firstName: '',
  lastName: '',
  address: '',
  careOf: '',
  zipCode: '',
  city: '',
};

export const AddWithAddressDialog: React.FC<AddWithAddressDialogProps> = ({
  open,
  onClose,
  addWithAddressDialogForm = defaultValues,
}) => {
  const initialFocus = useRef(null);
  const { t } = useTranslation(['common', 'send-mail']);

  const {
    reset,
    getValues,
    register,
    trigger,
    formState: { errors, isValid },
  } = useForm<AddWithAddressDialogFormModel>({
    resolver: yupResolver(formSchema),
    defaultValues: useMemo(() => {
      return { ...addWithAddressDialogForm };
    }, [addWithAddressDialogForm]),
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  const handleAdd = () => {
    trigger();
    if (!isValid) return;

    const vals = getValues();
    reset();
    onClose(vals);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      show={open}
      onClose={onClose}
      className="max-w-[60rem]"
      label={t('send-mail:recipientHandler.addWithAddress.title')}
    >
      <Modal.Content>
        <p className="pb-16">{t('send-mail:recipientHandler.addWithAddress.description')}</p>

        <div className="grid grid-cols-2 items-center w-full gap-y-24 gap-x-16">
          <FormControl className="w-full" id="firstName" invalid={!!errors.firstName}>
            <FormLabel>{t('send-mail:recipientHandler.addWithAddress.firstName')}</FormLabel>
            <Input {...register('firstName')} aria-describedby="firstName-error" />
            {errors.firstName && (
              <FormErrorMessage key={`firstName-errors`}>
                {t('send-mail:recipientHandler.addWithAddress.error.firstName')}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl className="w-full" id="lastName" invalid={!!errors.lastName}>
            <FormLabel>{t('send-mail:recipientHandler.addWithAddress.lastName')}</FormLabel>
            <Input {...register('lastName')} aria-describedby="lastName-error" />
            {errors.lastName && (
              <FormErrorMessage key={`lastName-errors`}>
                {t('send-mail:recipientHandler.addWithAddress.error.lastName')}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl className="w-full" id="address" invalid={!!errors.address}>
            <FormLabel>{t('send-mail:recipientHandler.addWithAddress.address')}</FormLabel>
            <Input {...register('address')} aria-describedby="address-error" />
            {errors.address && (
              <FormErrorMessage key={`address-errors`}>
                {t('send-mail:recipientHandler.addWithAddress.error.address')}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl className="w-full" id="careOf">
            <FormLabel>{t('send-mail:recipientHandler.addWithAddress.careOf')}</FormLabel>
            <Input {...register('careOf')} aria-describedby="careOf-error" />
          </FormControl>

          <FormControl className="w-full" id="zipCode" invalid={!!errors.zipCode}>
            <FormLabel>{t('send-mail:recipientHandler.addWithAddress.zipCode')}</FormLabel>
            <Input {...register('zipCode')} aria-describedby="zipCode-error" />
            {errors.zipCode && (
              <FormErrorMessage key={`zipCode-errors`}>
                {t('send-mail:recipientHandler.addWithAddress.error.zipCode')}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl className="w-full" id="city" invalid={!!errors.city}>
            <FormLabel>{t('send-mail:recipientHandler.addWithAddress.city')}</FormLabel>
            <Input {...register('city')} aria-describedby="city-error" />
            {errors.city && (
              <FormErrorMessage key={`city-errors`}>
                {t('send-mail:recipientHandler.addWithAddress.error.city')}
              </FormErrorMessage>
            )}
          </FormControl>
        </div>
      </Modal.Content>
      <Modal.Footer>
        <Button variant="secondary" ref={initialFocus} onClick={() => handleClose()}>
          {t('common:cancel')}
        </Button>
        <Button variant="primary" color="primary" onClick={() => handleAdd()}>
          {t('send-mail:recipientHandler.title')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
