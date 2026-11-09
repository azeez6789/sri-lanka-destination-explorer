import EditDestination from './edit-destination-client';

export const instant = false;

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditDestination id={id} />;
}
