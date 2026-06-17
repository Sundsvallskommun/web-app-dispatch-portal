import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, FormControl, FormLabel, Modal, RadioButton, cx } from '@sk-web-gui/react';
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

const formSchema = yup.object().shape({
  firstName: yup.string().when('$recipientType', {
    is: 'private',
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional(),
  }),
  lastName: yup.string().when('$recipientType', {
    is: 'private',
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional(),
  }),
  organizationName: yup.string().when('$recipientType', {
    is: 'organization',
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional(),
  }),
  street: yup.string().required(),
  careOf: yup.string().optional(),
  zipCode: yup.string().required(),
  city: yup.string().required(),
  country: yup.string().required(),
});

const defaultValues = {
  firstName: '',
  lastName: '',
  organizationName: '',
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
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);

  const {
    reset,
    register,
    trigger,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<Address>({
    resolver: yupResolver(formSchema),
    context: { recipientType: current === 1 ? 'organization' : 'private' },
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

  useEffect(() => {
    if (open) {
      setIsAdding(false);
      setCurrent(0);
    }
  }, [open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      show={open}
      onClose={handleClose}
      className="md:w-[60rem]"
      data-cy="add-with-address-modal"
      label={t('send-mail:recipientHandler.addWithAddress.title')}
    >
      {isAdding ? (
        <form key="address-step" onSubmit={handleSubmit(onSubmit)}>
          <Modal.Content>
            <p className="pb-16">{t('send-mail:recipientHandler.addWithAddress.description')}</p>

            <div className="grid grid-cols-2 items-start w-full gap-y-24 gap-x-16">
              <FormControl className="w-full" id="firstName" invalid={!!errors.firstName}>
                <FormLabel>
                  {t('send-mail:recipientHandler.addWithAddress.firstName', {
                    context: current === 1 ? 'optional' : '',
                  })}
                </FormLabel>
                <Input {...register('firstName')} aria-describedby="firstName-error" />
                {errors.firstName && (
                  <CustomFormErrorMessage message={t('send-mail:recipientHandler.addWithAddress.error.firstName')} />
                )}
              </FormControl>

              <FormControl className="w-full" id="lastName" invalid={!!errors.lastName}>
                <FormLabel>
                  {t('send-mail:recipientHandler.addWithAddress.lastName', {
                    context: current === 1 ? 'optional' : '',
                  })}
                </FormLabel>
                <Input {...register('lastName')} aria-describedby="lastName-error" />
                {errors.lastName && (
                  <CustomFormErrorMessage message={t('send-mail:recipientHandler.addWithAddress.error.lastName')} />
                )}
              </FormControl>

              {current === 1 && (
                <FormControl className="w-full col-span-2" id="orgName" invalid={!!errors.organizationName}>
                  <FormLabel>{t('send-mail:recipientHandler.addWithAddress.orgName')}</FormLabel>
                  <Input {...register('organizationName')} aria-describedby="orgName-error" />
                  {errors.organizationName && (
                    <CustomFormErrorMessage message={t('send-mail:recipientHandler.addWithAddress.error.orgName')} />
                  )}
                </FormControl>
              )}

              <FormControl className="w-full" id="address" invalid={!!errors.street}>
                <FormLabel>{t('send-mail:recipientHandler.addWithAddress.address')}</FormLabel>
                <Input {...register('street')} aria-describedby="address-error" />
                {errors.street && (
                  <CustomFormErrorMessage message={t('send-mail:recipientHandler.addWithAddress.error.address')} />
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
                  <CustomFormErrorMessage message={t('send-mail:recipientHandler.addWithAddress.error.zipCode')} />
                )}
              </FormControl>

              <FormControl className="w-full" id="city" invalid={!!errors.city}>
                <FormLabel>{t('send-mail:recipientHandler.addWithAddress.city')}</FormLabel>
                <Input {...register('city')} aria-describedby="city-error" />
                {errors.city && (
                  <CustomFormErrorMessage message={t('send-mail:recipientHandler.addWithAddress.error.city')} />
                )}
              </FormControl>
            </div>
          </Modal.Content>
          <Modal.Footer className="pt-16">
            <Button variant="secondary" ref={initialFocus} onClick={() => handleClose()}>
              {t('common:cancel')}
            </Button>
            <Button variant="primary" color="primary" type="submit">
              {t('send-mail:recipientHandler.title')}
            </Button>
          </Modal.Footer>
        </form>
      ) : (
        <form key="recipient-type-step">
          <Modal.Content>
            <div className="flex flex-col">
              <h3 className="text-label-medium pb-16">
                {t('send-mail:recipientHandler.addWithAddress.recipientTypeTitle')}
              </h3>
              <div className="flex flex-col md:flex-row items-start w-full gap-y-16 md:gap-y-24 gap-x-16">
                <div
                  className={cx(
                    'flex-1 w-full border rounded-groups p-16',
                    current === 0 ? 'border-dark-primary' : 'border-divider'
                  )}
                >
                  <RadioButton value="0" onChange={() => setCurrent(0)} checked={current === 0}>
                    {t('send-mail:recipientHandler.addWithAddress.recipientTypePrivate')}
                  </RadioButton>
                </div>
                {
                  <div
                    className={cx(
                      'flex-1 w-full border rounded-groups p-16',
                      current === 1 ? 'border-dark-primary' : 'border-divider'
                    )}
                  >
                    <RadioButton value="1" onChange={() => setCurrent(1)} checked={current === 1}>
                      {t('send-mail:recipientHandler.addWithAddress.recipientTypeOrg')}
                    </RadioButton>
                  </div>
                }
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer className="pt-16">
            <Button variant="secondary" ref={initialFocus} onClick={() => handleClose()}>
              {t('common:cancel')}
            </Button>
            <Button variant="primary" color="primary" onClick={() => setIsAdding(true)}>
              {t('common:next')}
            </Button>
          </Modal.Footer>
        </form>
      )}
    </Modal>
  );
};
