'use client';

import { ListResources } from '@components/list-resources/list-resources';
import { LogoPreview } from '@components/logo-preview/logo-preview.component';
import { Logotype } from '@data-contracts/backend/data-contracts';
import ListLayout from '@layouts/list-layout/list-layout.component';
import { AutoTableHeader } from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';
import { useResource } from '@utils/use-resource';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { capitalize } from 'underscore.string';

export const LogotypesPage: React.FC = () => {
  const { t } = useTranslation();

  const resource = 'logotypes';

  const { data, loaded } = useResource(resource);

  const properties = ['id', 'name', 'url', 'filename', 'createdAt', 'updatedAt'];

  const headers: AutoTableHeader[] = properties.reduce((headers: AutoTableHeader[], property) => {
    let header: AutoTableHeader = {
      property,
      label: t(`logotypes:properties.${property}`, { defaultValue: t(`common:properties.${property}`) }),
    };
    if (property === 'filename') {
      header = {
        property,
        label: capitalize(t(`common:preview`)),
        renderColumn: (_value, item: Logotype) => <LogoPreview logotype={item} />,
        isColumnSortable: false,
      };
    }
    return [...headers, header];
  }, []);

  return (
    <ListLayout resource={resource} properties={properties}>
      {loaded && <ListResources resource={resource} data={data} headers={headers} />}
    </ListLayout>
  );
};

export default LogotypesPage;
