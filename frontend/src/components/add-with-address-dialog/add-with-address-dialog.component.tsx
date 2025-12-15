import React, { useMemo, useRef } from 'react';
import { Button, Input, FormControl, FormLabel, Modal } from '@sk-web-gui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';
import { Address } from 'src/data-contracts/backend/data-contracts';

interface AddWithAddressDialogProps {
  open: boolean;
  onClose: (data?: Address) => void;
  addWithAddressDialogForm?: Address;
}

const formSchema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  street: yup.string().required(),
  careOf: yup.string().optional(),
  zipCode: yup.string().required(),
  city: yup.string().required(),
  country: yup.string().required(),
});

const defaultValues = {
  firstName: '',
  lastName: '',
  street: '',
  careOf: '',
  zipCode: '',
  city: '',
  country: 'SVERIGE',
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
    register,
    trigger,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<Address>({
    resolver: yupResolver(formSchema),
    defaultValues: useMemo(() => {
      return { ...addWithAddressDialogForm };
    }, [addWithAddressDialogForm]),
  });

  const onSubmit = (data: Address) => {
    trigger();
    if (!isValid) return;

    reset();
    onClose(data);
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
      data-cy="add-with-address-modal"
      label={t('send-mail:recipientHandler.addWithAddress.title')}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Content>
          <p className="pb-16">{t('send-mail:recipientHandler.addWithAddress.description')}</p>

          <div className="grid grid-cols-2 items-start w-full gap-y-24 gap-x-16">
            <FormControl className="w-full" id="firstName" invalid={!!errors.firstName}>
              <FormLabel>{t('send-mail:recipientHandler.addWithAddress.firstName')}</FormLabel>
              <Input {...register('firstName')} aria-describedby="firstName-error" />
              {errors.firstName && (
                <CustomFormErrorMessage
                  padded={false}
                  message={t('send-mail:recipientHandler.addWithAddress.error.firstName')}
                />
              )}
            </FormControl>

            <FormControl className="w-full" id="lastName" invalid={!!errors.lastName}>
              <FormLabel>{t('send-mail:recipientHandler.addWithAddress.lastName')}</FormLabel>
              <Input {...register('lastName')} aria-describedby="lastName-error" />
              {errors.lastName && (
                <CustomFormErrorMessage
                  padded={false}
                  message={t('send-mail:recipientHandler.addWithAddress.error.lastName')}
                />
              )}
            </FormControl>

            <FormControl className="w-full" id="address" invalid={!!errors.street}>
              <FormLabel>{t('send-mail:recipientHandler.addWithAddress.address')}</FormLabel>
              <Input {...register('street')} aria-describedby="address-error" />
              {errors.street && (
                <CustomFormErrorMessage
                  padded={false}
                  message={t('send-mail:recipientHandler.addWithAddress.error.address')}
                />
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
                <CustomFormErrorMessage
                  padded={false}
                  message={t('send-mail:recipientHandler.addWithAddress.error.zipCode')}
                />
              )}
            </FormControl>

            <FormControl className="w-full" id="city" invalid={!!errors.city}>
              <FormLabel>{t('send-mail:recipientHandler.addWithAddress.city')}</FormLabel>
              <Input {...register('city')} aria-describedby="city-error" />
              {errors.city && (
                <CustomFormErrorMessage
                  padded={false}
                  message={t('send-mail:recipientHandler.addWithAddress.error.city')}
                />
              )}
            </FormControl>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <Button variant="secondary" ref={initialFocus} onClick={() => handleClose()}>
            {t('common:cancel')}
          </Button>
          <Button variant="primary" color="primary" type="submit">
            {t('send-mail:recipientHandler.title')}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
