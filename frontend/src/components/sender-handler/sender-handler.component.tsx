import { useDepartments } from '@services/departments-service';
import { FormControl, FormLabel, Input, Spinner, Divider, Select } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import React from 'react';

export interface SenderFormModel {
  department: string;
  subject: string;
}

export const SenderHandler: React.FC = () => {
  const { register, getValues } = useFormContext<SenderFormModel>();
  const { departments, loaded } = useDepartments();

  return !loaded ? (
    <Spinner />
  ) : (
    <div className="w-full flex justify-center">
      <div className="flex flex-col items-start w-full border-1 border-divider rounded-cards">
        <h4 className="px-32 py-16">Ange avsändare</h4>
        <Divider className="w-full" orientation="horizontal" strong={false} />

        <div className="p-32">
          <FormControl className="w-full">
            <FormLabel>Förvaltning</FormLabel>
            <Select {...register('department')} defaultValue={getValues('department')}>
              {departments?.map((dep) => (
                <Select.Option key={dep.organizationId} value={dep.orgDisplayName}>
                  {dep.orgDisplayName}
                </Select.Option>
              ))}
            </Select>
          </FormControl>
          <p className="text-small pb-32 pt-8">Välj vilken förvaltning som är avsändare.</p>

          <FormControl className="w-full" size="md">
            <FormLabel>Ämne</FormLabel>
            <Input {...register('subject')} />
          </FormControl>
          <p className="text-small pt-8">Ange ett ämne som beskriver utskickets innehåll.</p>
        </div>
      </div>
    </div>
  );
};
