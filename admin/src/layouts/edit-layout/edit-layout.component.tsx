import { Header } from '@layouts/header/header.component';
import { Icon } from '@sk-web-gui/react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Main from '../main/main.component';
import resources from '@config/resources';
import { defaultInformationFields } from '@config/defaults';
import { capitalize } from 'underscore.string';
import { useFormContext } from 'react-hook-form';

interface EditLayoutProps {
  children?: React.ReactNode;
  resource: keyof typeof resources;
}

export const EditLayout: React.FC<EditLayoutProps> = (props) => {
  const { children, resource } = props;
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const formdata = watch();

  const isNew = !watch('id') || watch('id') === 'new';

  return (
    <Main>
      <Header>
        <div className="flex gap-12 items-center">
          <Link
            data-cy="goback"
            href={`/${resource}`}
            className="sk-btn sk-btn-lg sk-btn-tertiary"
            data-icon="true"
            data-rounded="true"
            data-background="false"
            aria-label={t('common:go_back')}
          >
            <Icon icon={<ArrowLeft />} />
          </Link>

          <h1 className="mb-0">
            {isNew ?
              capitalize(t('common:create_new', { resource: t(`${resource}:name`, { count: 1 }) }))
            : capitalize(t('common:edit', { resource: t(`${resource}:name_one`) }))}
          </h1>
        </div>
        {!isNew && (
          <ul className="text-small flex gap-16">
            {defaultInformationFields.map((field, index) => (
              <li key={index + field}>
                <strong>{capitalize(t(`common:properties.${field}`))}: </strong>
                {formdata?.[field]}
              </li>
            ))}
          </ul>
        )}
      </Header>
      {children}
    </Main>
  );
};

export default EditLayout;
