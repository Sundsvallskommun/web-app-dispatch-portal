'use client';

import { ResourceCard } from '@components/resource-card/resource-card.component';
import resources from '@config/resources';
import { ResourceName } from '@interfaces/resource-name';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { Header } from '@layouts/header/header.component';
import Main from '@layouts/main/main.component';
import { useTranslation } from 'next-i18next';
import { capitalize } from 'underscore.string';

export const Start = () => {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <Main>
        <Header>
          <h1 className="mb-0">{capitalize(`${t('common:welcome')}`)}</h1>
        </Header>
        <ul className="flex flex-wrap gap-32">
          {Object.keys(resources).map((resourceName, index) => (
            <ResourceCard key={`${resourceName}-${index}`} resource={resourceName as ResourceName} />
          ))}
        </ul>
      </Main>
    </DefaultLayout>
  );
};

export default Start;
