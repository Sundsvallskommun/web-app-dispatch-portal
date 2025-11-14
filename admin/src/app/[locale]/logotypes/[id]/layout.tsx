import { EditResourceLayoutProps } from '@app/[locale]/[resource]/[id]/layout';
import initLocalization, { namespaces } from '@app/i18n';
import { capitalize } from 'underscore.string';

export const generateMetadata = async ({ params }: EditResourceLayoutProps) => {
  const { id, locale } = await params;
  const { t } = await initLocalization(locale ?? 'sv', namespaces);
  const resource = 'logotypes';
  const isNew = !id || id === 'new';

  let title =
    isNew ?
      capitalize(t('common:create_new', { resource: t(`${resource}:name`, { count: 1 }) }))
    : capitalize(t('common:edit', { resource: t(`${resource}:name`, { count: 1 }) }));

  return {
    title,
  };
};
export const EditResourceLayout: React.FC<EditResourceLayoutProps> = ({ children }) => {
  return children;
};

export default EditResourceLayout;
