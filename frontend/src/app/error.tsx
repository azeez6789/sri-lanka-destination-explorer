'use client';

import Link from 'next/link';

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="error-page">
      <p className="eyebrow">A SMALL DETOUR</p>
      <h1>We couldn’t find our way.</h1>
      <p>This page could not be loaded just now. Please try again.</p>
      <div className="error-actions">
        <button className="button button-dark" onClick={() => reset()}>Try again</button>
        <Link className="button button-outline" href="/">Back home</Link>
      </div>
    </main>
  );
}
