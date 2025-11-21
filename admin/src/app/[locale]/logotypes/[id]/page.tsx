import { EditResourceLayoutParams } from '@app/[locale]/[resource]/[id]/layout';
import { EditLogotypeView } from 'src/views/edit-logotype-view.component';

interface EditLogotypePageProps {
  params: Promise<EditResourceLayoutParams>;
}

export default async function EditLogotypePage({ params }: Readonly<EditLogotypePageProps>) {
  const { id } = await params;

  return <EditLogotypeView id={id} />;
}
