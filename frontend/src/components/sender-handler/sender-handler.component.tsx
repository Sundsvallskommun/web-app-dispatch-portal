import { useDepartments } from '@services/departments-service';
import { FormControl, FormLabel, Input, Spinner, Divider, Select } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import React from 'react';

export interface SenderFormModel {
  department: string;
  subject: string;
}

export const  SenderHandler: React.FC = () => {
  const { register } = useFormContext<SenderFormModel>();
  const { departments, loaded } = useDepartments();

  return !loaded ? (
    <Spinner />
  ) : (
    <div className="w-full flex justify-center">
      <div className="flex flex-col items-start w-full border-1 border-divider rounded-cards gap-56 p-32">
        
        <div className="w-full">
          <h4 className="pb-20">Ange ämne och avsändare</h4>
          <Divider className="w-full" orientation="horizontal" strong={false} />
        </div>

        <div className="flex flex-col gap-56 max-w-screen-sm">
          <FormControl className="w-full" size="md">
            <FormLabel className="text-label-medium">Ämne</FormLabel>
            <p className="text-small text-secondary">Ange ett ämne som beskriver utskickets innehåll.</p>
            <Input {...register('subject')} />
          </FormControl>
          

          <FormControl className="w-full">
            <FormLabel className="text-label-medium">Avsändare <span className="font-normal">(Din förvaltning)</span></FormLabel>
            <p className="text-small text-secondary">Förvaltningen visas inte i utskicket. Uppgiften behövs för att Kontorsservice ska kunna fakturera din förvaltning för utskicket.</p>
            <Select className="w-full" {...register('department')} defaultValue={''}>
              <Select.Option value="" disabled>
                Välj avsändare
              </Select.Option>
              {departments?.map((dep, index) => (
                <Select.Option key={index} value={dep.orgName}>
                  {dep.orgName}
                </Select.Option>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
};
