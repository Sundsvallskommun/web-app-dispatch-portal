import { ListResourcesView } from 'src/views/list-resource-view.component';
import { ResourceLayoutParams } from './layout';

interface ResourcePageProps {
  params: Promise<ResourceLayoutParams>;
}

export default async function ResourcesPage({ params }: Readonly<ResourcePageProps>) {
  const { resource } = await params;

  return <ListResourcesView resource={resource} />;
}
