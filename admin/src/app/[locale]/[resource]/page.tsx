'use client';

import { ListResources } from '@components/list-resources/list-resources';
import { ResourceName } from '@interfaces/resource-name';
import ListLayout from '@layouts/list-layout/list-layout.component';
import { stringToResourceName } from '@utils/stringToResourceName';
import { useResource } from '@utils/use-resource';
import { useEffect, useState } from 'react';
import { ResourceLayoutParams, ResourceLayoutProps } from './layout';

export interface ResourcePageProps {
  params: ResourceLayoutParams;
}

export const ResourcesPage: React.FC<ResourceLayoutProps> = ({ params }) => {
  const [_resource, setResource] = useState<string>('');

  useEffect(() => {
    params.then((res) => {
      setResource(res.resource);
    });
  }, [params]);

  const resource = stringToResourceName(typeof _resource === 'object' ? _resource[0] : _resource) as ResourceName;

  const { data, loaded } = useResource(resource);

  const getProperties = () => {
    return data?.[0] ?
        Object.keys(data[0]).filter((key) => {
          const type = typeof data[0][key];
          return type === 'string' || type === 'number' || type === 'boolean';
        })
      : [];
  };

  return (
    loaded && (
      <ListLayout resource={resource} properties={[...getProperties(), 'logotype']}>
        {loaded && <ListResources resource={resource} data={data} />}
      </ListLayout>
    )
  );
};

export default ResourcesPage;
