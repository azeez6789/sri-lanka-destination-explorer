import Link from 'next/link';
import BrandMark from '@/components/brand-mark';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/site-header';
import WeatherPanel from '@/components/weather-panel';
import DestinationGallery from '@/components/destination-gallery';
import { apiUrl } from '@/lib/api';
import { Destination } from '@/lib/types';
import { getDestinationImages, getDestinationLocation } from '@/lib/destination-presentation';

export const instant = false;

async function getDestination(id: string): Promise<Destination | null> {
  try {
    const response = await fetch(apiUrl(`/destinations/${id}`), { cache: 'no-store' });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Destination service is unavailable.');
    return (await response.json()) as Destination;
  } catch {
    throw new Error('We could not load this destination. Please try again later.');
  }
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = await getDestination(id);
  if (!destination) notFound();
  const images = getDestinationImages(destination);
  const location = getDestinationLocation(destination);
  const hasFullDescription = destination.summary?.trim()
    ? destination.description.trim() !== destination.summary.trim()
    : destination.description.trim().length > 240;

  return (
    <>
      <SiteHeader />
      <main className="detail-page">
        <Link className="back-link" href="/#destinations">← All destinations</Link>
        <section className="detail-hero">
          <div className="detail-visual">
            <DestinationGallery
              images={images}
              name={destination.name}
              locationLabel={location.label}
              destination={destination}
            />
          </div>
          <div className="detail-copy">
            <p className="eyebrow">A PLACE TO REMEMBER</p>
            <h1>{destination.name}<em>.</em></h1>
            <p className="detail-description">{destination.summary?.trim() || destination.description}</p>
            <div className="coordinates"><span>LOCATION</span>{destination.latitude.toFixed(4)}° N, {destination.longitude.toFixed(4)}° E</div>
          </div>
        </section>
        {hasFullDescription && (
          <section className="detail-story" aria-labelledby="detail-story-heading">
            <p className="eyebrow">GET TO KNOW THE DESTINATION</p>
            <h2 id="detail-story-heading">More about <em>{destination.name}</em></h2>
            <p className="detail-description">{destination.description}</p>
          </section>
        )}
        {destination.notes?.trim() && (
          <section className="detail-story" aria-labelledby="detail-notes-heading">
            <p className="eyebrow">PLAN YOUR VISIT</p>
            <h2 id="detail-notes-heading">Visitor notes for <em>{destination.name}</em></h2>
            <p className="detail-description">{destination.notes}</p>
          </section>
        )}
        <WeatherPanel destinationId={destination._id} />
        <div className="detail-bottom">
          <p>Make room for <em>one more story.</em></p>
          <Link className="button button-outline" href="/#destinations">Explore another place <span aria-hidden="true">→</span></Link>
        </div>
      </main>
      <footer className="site-footer">
        <Link className="brand footer-brand" href="/"><BrandMark /><span>Sri Lanka <span className="brand-light">Explorer</span></span></Link>
        <span>Made for the curious · Sri Lanka · M.A ABDUL AZEEZ</span>
        <Link href="/#destinations">ALL DESTINATIONS ↑</Link>
      </footer>
    </>
  );
}
