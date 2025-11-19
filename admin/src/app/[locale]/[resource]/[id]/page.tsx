import { EditResourceView } from 'src/views/edit-resource-view.component';
import { EditResourceLayoutParams } from './layout';

interface EditResourcePageProps {
  params: Promise<EditResourceLayoutParams>;
}

export default async function EditResourcePage({ params }: Readonly<EditResourcePageProps>) {
  const { resource, id } = await params;

  return <EditResourceView resource={resource} id={id} />;
}
