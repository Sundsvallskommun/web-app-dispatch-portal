import resources from '@config/resources';
import { IDP } from '@data-contracts/backend/data-contracts';
import { Select, Spinner } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface IdpSelectProps {
  field: string;
}

export const IdpSelect: React.FC<IdpSelectProps> = ({ field }) => {
  const [data, setData] = useState<IDP[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const { t } = useTranslation();
  useEffect(() => {
    resources.idps
      .getMany()
      .then((res) => {
        setData(res.data.data ?? []);
        setLoaded(true);
      })
      .catch((e) => console.log('Error getting IDPs:', e));
  }, []);
  const { register } = useFormContext();
  return loaded ?
      <Select {...register(field)}>
        {data.map((idp) => (
          <Select.Option key={`idp-select-${idp.id}`} value={idp.id}>
            {idp.name ?? idp.id}
          </Select.Option>
        ))}
      </Select>
    : <Spinner />;
};
