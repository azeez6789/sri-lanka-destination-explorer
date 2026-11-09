'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiError, apiRequest } from '@/lib/api';
import { Destination } from '@/lib/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const categoryCount = new Set(
    destinations.map((destination) => destination.category?.trim().toLowerCase()).filter(Boolean),
  ).size;
  const locationCount = destinations.filter((destination) => destination.location?.trim()).length;

  useEffect(() => {
    async function load() {
      try {
        const admin = await apiRequest<{ email: string }>('/auth/me');
        const places = await apiRequest<Destination[]>('/destinations');
        setAdminEmail(admin.email);
        setDestinations(places);
      } catch (reason) {
        if (reason instanceof ApiError && reason.status === 401) {
          router.replace('/admin/login');
        } else {
          setError(reason instanceof Error ? reason.message : 'Unable to load dashboard.');
        }
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [router]);

  async function signOut() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
      router.replace('/');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to log out.');
    }
  }

  async function remove(destination: Destination) {
    if (!window.confirm(`Delete ${destination.name}? This cannot be undone.`)) return;
    setError('');
    try {
      await apiRequest(`/destinations/${destination._id}`, { method: 'DELETE' });
      setDestinations((current) => current.filter((item) => item._id !== destination._id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to delete destination.');
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Link className="brand" href="/"><span className="brand-icon">SL</span><span>Sri Lanka <span className="brand-light">Explorer</span></span></Link>
        <div className="admin-user"><span>{adminEmail || 'Loading account…'}</span><button onClick={signOut}>Log out <span aria-hidden="true">↗</span></button></div>
      </header>
      <section className="admin-main">
        <div className="admin-heading">
          <div><p className="eyebrow">YOUR ISLAND, YOUR EDITION</p><h1>Places to <em>explore.</em></h1><p>Manage the destinations visitors discover across Sri Lanka.</p></div>
          <Link className="button button-dark" href="/admin/destinations/new">Add a destination <span aria-hidden="true">＋</span></Link>
        </div>
        {!loading && !error && (
          <section className="admin-overview" aria-label="Destination overview">
            <article className="admin-metric">
              <span className="admin-metric-label">TOTAL PLACES</span>
              <strong>{String(destinations.length).padStart(2, '0')}</strong>
              <span className="admin-metric-note">Across your island guide</span>
            </article>
            <article className="admin-metric admin-metric-teal">
              <span className="admin-metric-label">CATEGORIES</span>
              <strong>{String(categoryCount).padStart(2, '0')}</strong>
              <span className="admin-metric-note">Distinct destination themes</span>
            </article>
            <article className="admin-metric admin-metric-blue">
              <span className="admin-metric-label">LOCATIONS ADDED</span>
              <strong>{String(locationCount).padStart(2, '0')}</strong>
              <span className="admin-metric-note">Places with location details</span>
            </article>
          </section>
        )}
        {error && <div className="notice notice-error" role="alert">{error}</div>}
        {loading && <div className="empty-state">Loading your destinations…</div>}
        {!loading && !error && destinations.length === 0 && (
          <div className="empty-state">No destinations saved yet. Add the first one to get started.</div>
        )}
        {!loading && destinations.length > 0 && (
          <div className="admin-library">
            <div className="admin-library-heading">
              <div><p className="eyebrow">DESTINATION LIBRARY</p><h2>All places</h2></div>
              <span>{destinations.length} {destinations.length === 1 ? 'place' : 'places'}</span>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>DESTINATION</th><th>COORDINATES</th><th>DESCRIPTION</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {destinations.map((destination, index) => (
                    <tr key={destination._id}>
                      <td><span className={`table-dot table-dot-${index % 3}`} /><Link className="admin-destination-name" href={`/admin/destinations/${destination._id}`}>{destination.name}</Link></td>
                      <td>{destination.latitude.toFixed(3)}, {destination.longitude.toFixed(3)}</td>
                      <td className="table-description">{destination.description}</td>
                      <td className="table-actions"><Link href={`/admin/destinations/${destination._id}/edit`}>Edit</Link><button className="delete-link" onClick={() => void remove(destination)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <Link className="back-link admin-back" href="/">← View public website</Link>
      </section>
    </main>
  );
}
