import { EditView } from './client';
import { EditResourceLayoutProps } from './layout';

export const EditResourcePage: React.FC<EditResourceLayoutProps> = async ({ params }) => {
  const { resource, id } = await params;

  return <EditView resource={resource} id={id} />;
};

export default EditResourcePage;
