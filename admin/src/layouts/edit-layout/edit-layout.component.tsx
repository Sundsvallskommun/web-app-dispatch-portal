import { Header } from '@layouts/header/header.component';
import { Icon } from '@sk-web-gui/react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Main from '../main/main.component';

interface EditLayoutProps {
  /**
   * href (url or path)
   */
  backLink?: string;
  title: string;
  headerInfo?: React.ReactNode;
  children?: React.ReactNode;
}

export const EditLayout: React.FC<EditLayoutProps> = (props) => {
  const { backLink, title, headerInfo, children } = props;
  const { t } = useTranslation();

  return (
    <Main>
      <Header>
        <div className="flex gap-12 items-center">
          {backLink && (
            <Link
              href={backLink}
              className="sk-btn sk-btn-lg sk-btn-tertiary"
              data-icon="true"
              data-rounded="true"
              data-background="false"
              aria-label={t('common:go_back')}
            >
              <Icon icon={<ArrowLeft />} />
            </Link>
          )}

          <h1 className="mb-0">{title}</h1>
        </div>
        {headerInfo}
      </Header>
      {children}
    </Main>
  );
};

export default EditLayout;
