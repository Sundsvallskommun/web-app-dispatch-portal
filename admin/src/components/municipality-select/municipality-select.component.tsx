import { Municipality } from '@data-contracts/backend/data-contracts';
import { FormControl, FormLabel, Select } from '@sk-web-gui/react';
import { useResource } from '@utils/use-resource';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

export const MunicipalitySelect: React.FC = () => {
  const { register } = useFormContext<{ municipalityId: string }>();
  const { t } = useTranslation();
  const { data, loaded } = useResource('municipalities');

  return (
    loaded && (
      <FormControl>
        <FormLabel>{capitalize(t('municipalities:name_one'))}</FormLabel>
        <Select data-cy="select-municipality" {...register('municipalityId')}>
          {data.map((mun: Municipality) => (
            <Select.Option key={mun.municipalityId} value={mun.municipalityId}>
              ({mun.municipalityId}) {mun.name}
            </Select.Option>
          ))}
        </Select>
      </FormControl>
    )
  );
};
