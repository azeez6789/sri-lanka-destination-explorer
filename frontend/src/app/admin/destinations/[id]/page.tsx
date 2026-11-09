import AdminDestinationDetails from './destination-detail-client';

export const instant = false;

export default async function AdminDestinationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminDestinationDetails id={id} />;
}
