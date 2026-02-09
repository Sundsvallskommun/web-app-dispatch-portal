import { defaultInformationFields } from '@config/defaults';
import resources from '@config/resources';
import { Resource } from '@interfaces/resource';
import { ResourceName } from '@interfaces/resource-name';
import { Fragment } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';
import { EditResourceArray } from './edit-resource-array.component';
import { EditResourceInput } from './edit-resource-input.component';
import { EditResourceObject } from './edit-resource-object.component';
import { IdpSelect } from '@components/idp-select/idp-select.component';
import { FormControl, FormLabel } from '@sk-web-gui/react';

interface EditResourceProps {
  resource: ResourceName;
}

export const EditResource: React.FC<EditResourceProps> = ({ resource }) => {
  const { t } = useTranslation();
  //eslint-disable-next-line implicit-any
  const { requiredFields, hiddenFields, defaultValues } = resources[resource] as Resource<any>;

  type CreateType = Parameters<NonNullable<Resource<FieldValues>['create']>>[0];
  type UpdateType = Parameters<NonNullable<Resource<FieldValues>['update']>>[1];
  type DataType = CreateType | UpdateType;

  const { watch } = useFormContext<DataType>();
  const formdata = watch();

  const allFields = [
    ...(requiredFields ?? []),
    ...(defaultValues ? Object.keys(defaultValues) : []),
    ...Object.keys(formdata),
  ];

  return (
    <>
      <div className="flex flex-col gap-32 grow mb-32">
        {allFields
          .filter((key) => !defaultInformationFields.includes(key))
          .filter((key) => !(hiddenFields ?? []).includes(key))
          .filter((key, index, arr) => arr.indexOf(key) === index)
          .map((key, index) => {
            const isRequired = requiredFields ? requiredFields.includes(key as (typeof requiredFields)[number]) : false;

            if (key === 'idpId') {
              return (
                <FormControl key={`formc-${index}-${key}`}>
                  <FormLabel>{t(`${resource}:properties.${key}`)}</FormLabel>
                  <IdpSelect field="idpId" data-cy={`edit-${resource}-idp`} />
                </FormControl>
              );
            }

            return (
              <Fragment key={`formc-${index}-${key}`}>
                <EditResourceInput
                  data-cy={`edit-${resource}-${key}`}
                  property={key}
                  index={index}
                  required={isRequired}
                  defaultValue={defaultValues?.[key]}
                  label={capitalize(t(`${resource}:properties.${key}`))}
                />
              </Fragment>
            );
          })}
      </div>
      <div className="flex flex-col gap-32 grow mb-32">
        {Object.keys(formdata)
          .filter((key) => !defaultInformationFields.includes(key))
          .filter((key) => !(hiddenFields ?? []).includes(key))
          .map((key, index) => {
            const type = typeof formdata[key];
            if (type === 'object') {
              return Array.isArray(formdata[key]) ?
                  <EditResourceArray key={`res-${index}-${key}`} resource={resource} property={key} />
                : <EditResourceObject key={`res-${index}-${key}`} resource={resource} property={key} />;
            }
          })}
      </div>
    </>
  );
};
