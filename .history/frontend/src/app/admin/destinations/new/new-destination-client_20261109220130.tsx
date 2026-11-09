'use client';

import Link from 'next/link';
import BrandMark from '@/components/brand-mark';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DestinationForm from '@/components/destination-form';
import { ApiError, apiRequest } from '@/lib/api';

export default function NewDestination() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/auth/me')
      .then(() => setAuthorized(true))
      .catch((reason: Error) => {
        if (reason instanceof ApiError && reason.status === 401) router.replace('/admin/login');
        else setError(reason.message);
      });
  }, [router]);

  return (
    <main className="admin-page">
      <header className="admin-header"><Link className="brand" href="/admin"><BrandMark /><span>Sri Lanka <span className="brand-light">Explorer</span></span></Link></header>
      <section className="editor-page">
        <Link className="back-link" href="/admin">← All destinations</Link>
        {error && <div className="notice notice-error" role="alert">{error}</div>}
        {!authorized && !error && <p className="empty-state">Checking your admin session…</p>}
        {authorized && <>
          <p className="eyebrow">MAKE ROOM FOR A NEW STORY</p>
          <h1>Add a <em>destination.</em></h1>
          <p className="editor-intro">A few details are all it takes to bring a new place to life.</p>
          <DestinationForm />
        </>}
      </section>
    </main>
  );
}
