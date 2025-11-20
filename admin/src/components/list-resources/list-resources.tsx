'use client';

import { LogoPreview } from '@components/logo-preview/logo-preview.component';
import { defaultInformationFields } from '@config/defaults';
import resources from '@config/resources';
import { ResourceName } from '@interfaces/resource-name';
import { AutoTable, AutoTableHeader, Icon } from '@sk-web-gui/react';
import { getFormattedFields } from '@utils/formatted-field';
import { useLocalStorage } from '@utils/use-localstorage.hook';
import { Check, Pencil } from 'lucide-react';
import NextLink from 'next/link';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';
import { useShallow } from 'zustand/react/shallow';

interface ListResourcesProps {
  properties?: string[];
  resource: ResourceName;
  headers?: AutoTableHeader[];
  data?: Array<Record<string, unknown>>;
}

export const ListResources: React.FC<ListResourcesProps> = ({ properties, resource, headers: _headers, data }) => {
  const { update } = resources[resource];
  const { t } = useTranslation();
  const [{ [resource]: storeHeaders }, setHeaders] = useLocalStorage(
    useShallow((state) => [state.headers, state.setHeaders])
  );

  useEffect(() => {
    if (!storeHeaders && data) {
      const newHeaders = properties ?? [
        ...(data?.[0] ? Object.keys(data[0]).filter((field) => typeof data[0][field] !== 'object') : []),
        ...(defaultInformationFields || ['id']),
      ];
      setHeaders({
        [resource]: newHeaders,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeHeaders, data]);

  const getHeader = (property: string) => {
    return capitalize(t(`${resource}:properties.${property}`, { defaultValue: t(`common:properties.${property}`) }));
  };
  const headers = useMemo(
    () =>
      _headers ||
      storeHeaders?.reduce<AutoTableHeader[]>((headers, key) => {
        if (data) {
          if (key === 'logotype') {
            return [
              ...headers,
              {
                label: capitalize(t(`logotypes:name_one`)),
                renderColumn: (_value, item) => <LogoPreview logotype={item.logotype} name={item?.name} />,
                isColumnSortable: false,
              },
            ];
          }
          const type = typeof data?.[0]?.[key];
          if (type === 'string' || type === 'number') {
            return [
              ...headers,
              {
                label: getHeader(key),
                property: key,
              },
            ];
          } else if (type === 'boolean') {
            return [
              ...headers,
              {
                label: getHeader(key),
                property: key,
                renderColumn: (value) => (
                  <span>{value && <Icon.Padded rounded color="success" icon={<Check />} />}</span>
                ),
                isColumnSortable: false,
              },
            ];
          }

          return headers;
        } else {
          return headers;
        }
      }, []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storeHeaders, _headers, data]
  );

  const editHeader: AutoTableHeader = {
    label: 'edit',
    property: 'id',
    isColumnSortable: false,
    screenReaderOnly: true,
    sticky: true,
    renderColumn: (value) => (
      <div className="text-right w-full">
        <NextLink data-cy="edit-resource" href={`/${resource}/${value}`} aria-label="Redigera">
          <Icon.Padded icon={<Pencil />} variant="tertiary" className="link-btn" />
        </NextLink>
      </div>
    ),
  };

  const filteredHeaders: AutoTableHeader[] =
    headers
      ?.filter((header) => storeHeaders?.includes(header?.property ?? ''))
      ?.filter((header, index, arr) => arr.map((item) => item.label).indexOf(header.label) === index) || [];

  const formattedData = useMemo(() => data?.map((row) => getFormattedFields(row)), [data]);

  return (
    <div>
      {formattedData && formattedData?.length > 0 ?
        <AutoTable
          data-cy="resource-table"
          pageSize={15}
          autodata={formattedData}
          autoheaders={[...filteredHeaders, ...(update ? [editHeader] : [])]}
        />
      : <h3>{capitalize(t('common:no_resources', { resources: t(`${resource}:name_zero`) }))}</h3>}
    </div>
  );
};
