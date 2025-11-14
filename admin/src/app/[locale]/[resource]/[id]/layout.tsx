import { LocalizationLayoutProps } from '@app/[locale]/layout';
import initLocalization, { namespaces } from '@app/i18n';
import { stringToResourceName } from '@utils/stringToResourceName';
import { capitalize } from 'underscore.string';
import { ResourceLayoutParams } from '../layout';

export interface EditResourceLayoutParams extends ResourceLayoutParams {
  id: string;
}
export interface EditResourceLayoutProps extends Omit<LocalizationLayoutProps, 'params'> {
  params: Promise<EditResourceLayoutParams>;
}

export const generateMetadata = async ({ params }: EditResourceLayoutProps) => {
  const { resource: _resource, id, locale } = await params;
  const { t } = await initLocalization(locale ?? 'sv', namespaces);
  const resource = stringToResourceName(typeof _resource === 'object' ? _resource[0] : _resource);
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
