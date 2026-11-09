'use client';

import Link from 'next/link';
import BrandMark from '@/components/brand-mark';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DestinationForm from '@/components/destination-form';
import { ApiError, apiRequest } from '@/lib/api';
import { Destination } from '@/lib/types';

export default function EditDestination({ id }: { id: string }) {
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
      <header className="admin-header"><Link className="brand" href="/admin"><BrandMark /><span>Sri Lanka <span className="brand-light">Explorer</span></span></Link></header>
      <section className="editor-page">
        <Link className="back-link" href={destination ? `/admin/destinations/${destination._id}` : '/admin'}>← Back to destination</Link>
        {error && <div className="notice notice-error" role="alert">{error}</div>}
        {!destination && !error && <p className="empty-state">Loading destination…</p>}
        {destination && <>
          <p className="eyebrow">A FEW LITTLE UPDATES</p>
          <h1>Edit <em>{destination.name}.</em></h1>
          <DestinationForm destination={destination} />
        </>}
      </section>
    </main>
  );
}
