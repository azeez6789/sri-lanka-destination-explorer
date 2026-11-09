'use client';

import Link from 'next/link';
import BrandMark from '@/components/brand-mark';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiError, apiRequest } from '@/lib/api';
import { Destination } from '@/lib/types';
import { getDestinationImageUrl } from '@/lib/destination-presentation';

export default function AdminDestinationDetails({ id }: { id: string }) {
  const router = useRouter();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        await apiRequest('/auth/me');
        setDestination(await apiRequest<Destination>(`/destinations/${id}`));
      } catch (reason) {
        if (reason instanceof ApiError && reason.status === 401) router.replace('/admin/login');
        else setError(reason instanceof Error ? reason.message : 'Unable to load destination.');
      }
    }
    void load();
  }, [id, router]);

  return (
    <main className="admin-page">
      <header className="admin-header"><Link className="brand" href="/admin"><BrandMark /><span>Sri Lanka <span className="brand-light">Explorer</span></span></Link><Link href="/admin" className="admin-header-link">Dashboard <span aria-hidden="true">↗</span></Link></header>
      <section className="editor-page">
        <Link className="back-link" href="/admin">← All destinations</Link>
        {error && <div className="notice notice-error" role="alert">{error}</div>}
        {!destination && !error && <p className="empty-state">Loading destination…</p>}
        {destination && <>
          <p className="eyebrow">DESTINATION DETAILS</p>
          <h1>{destination.name}<em>.</em></h1>
          <div
            className="admin-destination-preview"
            style={{ backgroundImage: `url("${getDestinationImageUrl(destination)}")` }}
            role="img"
            aria-label={`Image for ${destination.name}`}
          />
          <p className="detail-description admin-detail-description">{destination.description}</p>
          <dl className="admin-detail-list">
            <div><dt>Location</dt><dd>{destination.location || 'Not specified'}</dd></div>
            <div><dt>Category</dt><dd>{destination.category || 'Not specified'}</dd></div>
            <div><dt>Latitude</dt><dd>{destination.latitude}</dd></div>
            <div><dt>Longitude</dt><dd>{destination.longitude}</dd></div>
            <div><dt>Image URL</dt><dd>{destination.imageUrl || destination.images?.[0] || 'Placeholder image'}</dd></div>
            {destination.images?.map((image, index) => (
              <div key={`${image}-${index}`}><dt>Additional image {index + 1}</dt><dd>{image}</dd></div>
            ))}
          </dl>
          <Link className="button button-dark" href={`/admin/destinations/${destination._id}/edit`}>Edit destination <span aria-hidden="true">→</span></Link>
        </>}
      </section>
    </main>
  );
}
