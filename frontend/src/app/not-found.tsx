import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="error-page">
      <p className="eyebrow">OFF THE MAP</p>
      <h1>This place is still a story away.</h1>
      <p>We couldn’t find that destination in the Sri Lanka guide.</p>
      <Link className="button button-dark" href="/">Explore the island <span aria-hidden="true">→</span></Link>
    </main>
  );
}
