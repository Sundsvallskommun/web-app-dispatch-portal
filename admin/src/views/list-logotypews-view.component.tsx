'use client';

import { ListResources } from '@components/list-resources/list-resources';
import { LogoPreview } from '@components/logo-preview/logo-preview.component';
import { Logotype } from '@data-contracts/backend/data-contracts';
import ListLayout from '@layouts/list-layout/list-layout.component';
import { AutoTableHeader, cx } from '@sk-web-gui/react';
import { useResource } from '@utils/use-resource';
import { useTranslation } from 'next-i18next';
import { capitalize } from 'underscore.string';

export const ListLogotypesView: React.FC = () => {
  const { t } = useTranslation();

  const { data, loaded } = useResource('logotypes');

  const properties = [
    'id',
    'name',
    'urlLightMode',
    'urlDarkMode',
    'filenameLightMode',
    'filenameDarkMode',
    'createdAt',
    'updatedAt',
  ];

  const headers: AutoTableHeader[] = properties.reduce((headers: AutoTableHeader[], property) => {
    let header: AutoTableHeader = {
      property,
      label: capitalize(t(`logotypes:properties.${property}`, { defaultValue: t(`common:properties.${property}`) })),
    };
    if (property.startsWith('filename')) {
      header = {
        property,
        label: capitalize(t(`logotypes:properties.${property}`)),
        renderColumn: (_value, item: Logotype) => (
          <div className={cx('p-8', property.includes('Light') ? 'bg-white' : 'bg-black')}>
            <LogoPreview logotype={item} mode={property.includes('Light') ? 'light' : 'dark'} />
          </div>
        ),
        isColumnSortable: false,
      };
    }
    return [...headers, header];
  }, []);

  return (
    <ListLayout resource="logotypes" properties={properties}>
      {loaded && <ListResources resource="logotypes" data={data} headers={headers} />}
    </ListLayout>
  );
};
