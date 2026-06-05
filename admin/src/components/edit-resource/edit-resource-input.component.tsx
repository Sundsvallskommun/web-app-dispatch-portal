import { FormControl, FormLabel, Input, Switch } from '@sk-web-gui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EditResourceImage } from '@components/edit-resource/edit-resource-image.component';

type InputProps = React.ComponentPropsWithoutRef<typeof Input.Component>;

interface EditResourceInputProps extends Omit<InputProps, 'ref' | 'key'> {
  label: string;
  property: string;
  index?: number;
  required?: boolean;
  // eslint-disable-next-line no any
  defaultValue?: any;
}

export const EditResourceInput: React.FC<EditResourceInputProps> = ({
  label,
  property,
  required,
  defaultValue,
  ...rest
}) => {
  const { register, watch } = useFormContext();
  const data = watch(property);
  const type = typeof (defaultValue ?? data);

  return (
    <FormControl className="w-full" required={required}>
      {type === 'boolean' ?
        <Switch {...register(property)} color="gronsta">
          {label}
        </Switch>
      : <>
          {property === 'logotype_lightmode' || property === 'logotype_darkmode' ?
            <EditResourceImage label={label} property={property} />
          : <>
              <FormLabel>{label}</FormLabel>
              <Input type={type === 'number' ? 'number' : 'text'} {...register(property)} {...rest} />
            </>
          }
        </>
      }
    </FormControl>
  );
};
