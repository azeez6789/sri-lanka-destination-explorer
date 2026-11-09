import Link from 'next/link';
import { Destination } from '@/lib/types';
import { getDestinationImageUrl, getDestinationLocation } from '@/lib/destination-presentation';
import ImageAttribution from './image-attribution';

export default function DestinationCard({
  destination,
  index,
}: {
  destination: Destination;
  index: number;
}) {
  const location = getDestinationLocation(destination);
  const imageUrl = getDestinationImageUrl(destination);

  return (
    <article className="destination-card">
      <Link
        href={`/destinations/${destination._id}`}
        className="destination-image"
        style={{ backgroundImage: `url("${imageUrl}")` }}
        aria-label={`Discover ${destination.name}`}
      >
        <span className="image-label">{location.label}</span>
        <span className="image-arrow" aria-hidden="true">↗</span>
      </Link>
      <div className="card-content">
        <div className="card-title-row">
          <h3><Link href={`/destinations/${destination._id}`}>{destination.name}</Link></h3>
          <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <p className="card-location"><span aria-hidden="true">⌖</span>{location.description}</p>
        <ImageAttribution destination={destination} />
        <p className="card-summary">{destination.summary?.trim() || destination.description}</p>
        <Link className="text-link" href={`/destinations/${destination._id}`}>
          Discover this place <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
