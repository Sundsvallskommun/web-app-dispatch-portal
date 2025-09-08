import { useMemo, useRef } from 'react';
import { Button, Dialog, Input, FormControl, FormLabel, FormErrorMessage } from '@sk-web-gui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface AddWithAddressDialogFormModel {
  firstName: string;
  lastName: string;
  address: string;
  careOf?: string;
  zipCode: string;
  city: string;
};

interface AddWithAddressDialogProps {
  open: boolean;
  onClose: (data?: AddWithAddressDialogFormModel) => void;
  addWithAddressDialogForm?: AddWithAddressDialogFormModel;
};

const formSchema = yup
  .object({
    firstName: yup.string().required('Förnamn måste anges'),
    lastName: yup.string().required('Efternamn måste anges'),
    address: yup.string().required('Adress måste anges'),
    careOf: yup.string().optional(),
    //zipCode: yup.number().typeError('Måste vara ett nummer').required('Postnummer måste anges'),
    zipCode: yup.string().required('Postnummer måste anges'),
    city: yup.string().required('Ort måste anges'),
  });

const defaultValues = {
  firstName: '',
  lastName: '',
  address: '',
  careOf: '',
  zipCode: '',
  city: ''
};

export const AddWithAddressDialog: React.FC<AddWithAddressDialogProps> = ({ open, onClose, addWithAddressDialogForm = defaultValues  }) => {
  const initialFocus = useRef(null);

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
  }

  const handleClose = () => {
    reset();
    onClose();
  }

  return (
    <Dialog show={open} className="md:min-w-[50rem]">
      <Dialog.Content>
        <h1 className="h3">Lägg till mottagare med adress</h1>
        <p>
          När du lägger till en mottagare med adress kommer brevet att skickas med vanlig post. För att kunna skicka
          till en digital brevlåda krävs ett personnummer.
        </p>

        <div className="flex flex-col gap-16">
          <div className="flex flex-wrap items-center w-full gap-16">
            <FormControl id="firstName" invalid={!!errors.firstName}>
              <FormLabel>Förnamn</FormLabel>
              <Input {...register("firstName")} aria-describedby="firstName-error" />
              {errors.firstName && <FormErrorMessage key={`firstName-errors`}>{errors.firstName?.message}</FormErrorMessage>}
            </FormControl>

            <FormControl id="lastName" invalid={!!errors.lastName}>
              <FormLabel>Efternamn</FormLabel>
              <Input {...register("lastName")} aria-describedby="lastName-error" />
              {errors.lastName && <FormErrorMessage key={`lastName-errors`}>{errors.lastName?.message}</FormErrorMessage>}
            </FormControl>

            <FormControl id="address" invalid={!!errors.address}>
              <FormLabel>Adress</FormLabel>
              <Input {...register("address")} aria-describedby="address-error" />
              {errors.address && <FormErrorMessage key={`address-errors`}>{errors.address?.message}</FormErrorMessage>}
            </FormControl>

            <FormControl id="careOf">
              <FormLabel>C/o adress (valfri)</FormLabel>
              <Input {...register("careOf")} aria-describedby="careOf-error" />
              {errors.careOf && <FormErrorMessage key={`careOf-errors`}>{errors.careOf?.message}</FormErrorMessage>}
            </FormControl>

            <FormControl id="zipCode" invalid={!!errors.zipCode}>
              <FormLabel>Postnummer</FormLabel>
              <Input {...register("zipCode")} aria-describedby="zipCode-error" />
              {errors.zipCode && <FormErrorMessage key={`zipCode-errors`}>{errors.zipCode?.message}</FormErrorMessage>}
            </FormControl>

            <FormControl id="city" invalid={!!errors.city}>
              <FormLabel>Ort</FormLabel>
              <Input {...register("city")} aria-describedby="city-error" />
              {errors.city && <FormErrorMessage key={`city-errors`}>{errors.city?.message}</FormErrorMessage>}
            </FormControl>
          </div>
        </div>
      </Dialog.Content>
      <Dialog.Buttons>
        <Button variant="secondary" ref={initialFocus} onClick={() => handleClose()}>
          Avbryt
        </Button>
        <Button variant="primary" color="primary" onClick={() => handleAdd()}>
          Lägg till mottagare
        </Button>
      </Dialog.Buttons>
    </Dialog>
  );
};
