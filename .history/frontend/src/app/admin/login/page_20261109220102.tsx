'use client';

import Link from 'next/link';
import BrandMark from '@/components/brand-mark';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      router.replace('/admin');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <Link href="/" className="brand login-brand"><BrandMark /><span>Sri Lanka <span className="brand-light">Explorer</span></span></Link>
      <div className="login-panel">
        <p className="eyebrow">A LITTLE PLACE FOR THE CURATOR</p>
        <h1>Welcome <em>back.</em></h1>
        <p className="login-intro">Sign in to keep Sri Lanka’s destination guide up to date.</p>
        <form className="admin-form" onSubmit={submit}>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" required maxLength={200} value={password} onChange={(event) => setPassword(event.target.value)} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark form-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">→</span>
          </button>
        </form>
        <Link className="login-back" href="/">← Back to the island</Link>
      </div>
      <span className="login-aside">SRI LANKA<br />A WORLD IN ONE ISLAND</span>
    </main>
  );
}
