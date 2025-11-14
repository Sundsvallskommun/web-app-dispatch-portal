import { EditResourceLayoutProps } from '@app/[locale]/[resource]/[id]/layout';
import { EditView } from './client';

export const EditResourcePage: React.FC<EditResourceLayoutProps> = async ({ params }) => {
  const { id } = await params;

  return <EditView id={id} />;
};

export default EditResourcePage;
