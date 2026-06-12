import { CustomOnChangeEventUploadFile, FileUpload, FormControl, FormLabel } from '@sk-web-gui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface EditResourceImageProps
  extends Omit<React.ComponentProps<typeof FileUpload.Field>, 'variant' | 'invalid' | 'children'> {
  label: string;
  property: string;
  required?: boolean;
}

export const EditResourceImage: React.FC<EditResourceImageProps> = ({ label, property, required, ...rest }) => {
  const {
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();

  const handleChange = (event: CustomOnChangeEventUploadFile) => {
    const files = event.target.value;
    if (files?.[0]?.file) {
      setValue(property, files[0].file, { shouldDirty: true, shouldValidate: true, shouldTouch: true });
      trigger();
    }
  };

  return (
    <FormControl required={required} className="w-full">
      <FormLabel>{label}</FormLabel>
      <FileUpload.Field
        onChange={handleChange}
        className="w-full pb-16"
        maxFileSizeMB={4}
        variant="horizontal"
        invalid={!!errors[property]}
        accept={['image/svg+xml', 'image/png']}
        allowMultiple={false}
        {...rest}
      />
    </FormControl>
  );
};
