import { LogoPreview } from '@components/logo-preview/logo-preview.component';
import { LogotypeModal } from '@components/logotype-modal/logotype-modal.component';
import { MunicipalitySelect } from '@components/municipality-select/municipality-select.component';
import { defaultInformationFields } from '@config/defaults';
import resources from '@config/resources';
import { Logotype } from '@data-contracts/backend/data-contracts';
import { Resource } from '@interfaces/resource';
import { ResourceName } from '@interfaces/resource-name';
import { Button, FormControl, FormLabel } from '@sk-web-gui/react';
import { Fragment, useState } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';
import { EditResourceArray } from './edit-resource-array.component';
import { EditResourceInput } from './edit-resource-input.component';
import { EditResourceObject } from './edit-resource-object.component';

interface EditResourceProps {
  resource: ResourceName;
}

export const EditResource: React.FC<EditResourceProps> = ({ resource }) => {
  const [showLogotypeSelect, setShowLogotypeSelect] = useState<boolean>(false);
  const { t } = useTranslation();
  //eslint-disable-next-line implicit-any
  const { requiredFields, hiddenFields, defaultValues } = resources[resource] as Resource<any>;

  type CreateType = Parameters<NonNullable<Resource<FieldValues>['create']>>[0];
  type UpdateType = Parameters<NonNullable<Resource<FieldValues>['update']>>[1];
  type DataType = CreateType | UpdateType;

  const { watch, setValue } = useFormContext<DataType>();
  const formdata = watch();
  const resetLogo = () => {
    setValue(`logotype`, undefined, { shouldDirty: true });
    setValue(`logotypeId`, '', { shouldDirty: true });
  };

  const handleSelectLogo = (logotype?: Logotype) => {
    if (logotype) {
      setValue(`logotype`, logotype, { shouldDirty: true });
      setValue(`logotypeId`, logotype.id, { shouldDirty: true });
    }
    setShowLogotypeSelect(false);
  };
  const allFields = [
    ...(requiredFields ?? []),
    ...(defaultValues ? Object.keys(defaultValues) : []),
    ...Object.keys(formdata),
  ];

  return (
    <>
      <LogotypeModal open={showLogotypeSelect} onClose={handleSelectLogo} />
      <div className="flex flex-col gap-32 grow mb-32">
        {allFields
          .filter((key) => !defaultInformationFields.includes(key))
          .filter((key) => !(hiddenFields ?? []).includes(key))
          .filter((key, index, arr) => arr.indexOf(key) === index)
          .map((key, index) => {
            const isRequired = requiredFields ? requiredFields.includes(key as (typeof requiredFields)[number]) : false;

            return (
              <Fragment key={`formc-${index}-${key}`}>
                <EditResourceInput
                  data-cy={`edit-${resource}-${key}`}
                  property={key}
                  index={index}
                  required={isRequired}
                  label={capitalize(t(`${resource}:properties.${key}`))}
                />
              </Fragment>
            );
          })}
        {resource === 'organizations' && <MunicipalitySelect />}
        <FormControl>
          <FormLabel>{capitalize(t('logotypes:name_one'))}</FormLabel>
          {formdata.logotype ?
            <>
              <LogoPreview logotype={formdata.logotype} name={formdata.name} />
              <Button data-cy={`edit-${resource}-remove-logo`} variant="secondary" onClick={() => resetLogo()}>
                {capitalize(t('common:remove_resource', { resource: t('logotypes:name_one') }))}
              </Button>
            </>
          : <Button
              data-cy={`edit-${resource}-pick-logo`}
              variant="primary"
              color="vattjom"
              onClick={() => setShowLogotypeSelect(true)}
            >
              {capitalize(t('common:select_resource', { resource: t('logotypes:name_one') }))}
            </Button>
          }
        </FormControl>
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
