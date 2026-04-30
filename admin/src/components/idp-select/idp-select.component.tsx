import resources from '@config/resources';
import { IDP } from '@data-contracts/backend/data-contracts';
import { Select, Spinner } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface IdpSelectProps extends React.ComponentPropsWithoutRef<typeof Select> {
  field: string;
}

export const IdpSelect: React.FC<IdpSelectProps> = ({ field, ...rest }) => {
  const [data, setData] = useState<IDP[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

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
      <Select {...register(field)} {...rest}>
        {data.map((idp) => (
          <Select.Option key={`idp-select-${idp.id}`} value={idp.id}>
            {idp.name ?? idp.id}
          </Select.Option>
        ))}
      </Select>
    : <Spinner />;
};
