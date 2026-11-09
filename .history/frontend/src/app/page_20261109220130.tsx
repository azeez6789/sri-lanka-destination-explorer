import Link from 'next/link';
import Image from 'next/image';
import BrandMark from '@/components/brand-mark';
import DestinationCard from '@/components/destination-card';
import HeroBackground from '@/components/hero-background';
import SiteHeader from '@/components/site-header';
import SriLankaScenes from '@/components/sri-lanka-scenes';
import { Destination } from '@/lib/types';
import { apiUrl } from '@/lib/api';

export const instant = false;

const destinationsPerPage = 10;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page: requestedPage } = await searchParams;
  let destinations: Destination[] = [];
  let error = '';

  try {
    const response = await fetch(apiUrl('/destinations'), {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('The destination service is unavailable.');
    destinations = (await response.json()) as Destination[];
  } catch {
    error =
      'We could not load destinations. Check that the backend can connect to MongoDB, then refresh the page.';
  }

  const requestedPageNumber = Number(
    Array.isArray(requestedPage) ? requestedPage[0] : requestedPage,
  );
  const pageCount = Math.ceil(destinations.length / destinationsPerPage);
  const currentPage = Number.isSafeInteger(requestedPageNumber)
    ? Math.min(Math.max(requestedPageNumber, 1), Math.max(pageCount, 1))
    : 1;
  const firstDestinationIndex = (currentPage - 1) * destinationsPerPage;
  const visibleDestinations = destinations.slice(
    firstDestinationIndex,
    firstDestinationIndex + destinationsPerPage,
  );

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="hero-inner">
            <p className="eyebrow"><span className="sun-mark">✳</span> THE PEARL OF THE INDIAN OCEAN</p>
            <h1>A little island.<br /><em>A lot to discover.</em></h1>
            <p className="hero-copy">
              Find your next favorite place in Sri Lanka, from misty hill
              country to palm-lined shores.
            </p>
            <a className="button button-dark" href="#destinations">
              Explore destinations <span aria-hidden="true">↓</span>
            </a>
          </div>
          <HeroBackground />
        </section>

        <section className="intro-section" id="about">
          <p className="eyebrow">YOUR ISLAND, YOUR WAY</p>
          <p className="intro-line">Three ways to fall in love<br />with <em>Sri Lanka.</em></p>
          <p className="intro-note">
            Ancient streets, cool mountain air and sunset by the sea. Start
            somewhere wonderful.
          </p>
        </section>

        <section className="experiences-section" id="experiences">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A LITTLE BIT OF EVERYTHING</p>
              <h2>Find your kind of <em>island.</em></h2>
            </div>
            <Link className="text-link experiences-link" href="#destinations">
              Browse all places <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="experience-grid">
            <article className="experience-card">
              <Link className="experience-image" href="#destinations" aria-label="Explore Sri Lanka's ancient sites">
                <Image src="/destinations/sigiriya.png" alt="Sigiriya Rock rising above the green landscape" fill sizes="(max-width: 640px) 90vw, (max-width: 900px) 45vw, 30vw" loading="eager" />
                <span className="experience-number">01 / CULTURE</span>
              </Link>
              <div className="experience-copy">
                <h3>Stories carved in stone</h3>
                <p>Follow the island’s history through hilltop fortresses, sacred temples and old streets.</p>
              </div>
            </article>
            <article className="experience-card">
              <Link className="experience-image experience-image-bridge" href="#destinations" aria-label="Explore the Nine Arch Bridge and Sri Lankan hill country">
                <Image src="/destinations/nine-arch-bridge.png" alt="The Nine Arch Bridge surrounded by lush green hills" fill sizes="(max-width: 640px) 90vw, (max-width: 900px) 45vw, 30vw" />
                <span className="experience-number">02 / HIGHLANDS</span>
              </Link>
              <div className="experience-copy">
                <h3>Take the scenic route</h3>
                <p>Trade the heat for misty mornings, tea country and slow train rides through the hills.</p>
              </div>
            </article>
            <article className="experience-card">
              <Link className="experience-image experience-image-coast" href="#destinations" aria-label="Explore Sri Lanka's coastal destinations">
                <Image src="/destinations/galle-fort.png" alt="Galle Fort beside the Indian Ocean" fill sizes="(max-width: 640px) 90vw, (max-width: 900px) 45vw, 30vw" />
                <span className="experience-number">03 / COAST</span>
              </Link>
              <div className="experience-copy">
                <h3>Let the day drift by</h3>
                <p>Wander old coastal towns, find a quiet beach and watch the sun slip into the sea.</p>
              </div>
            </article>
          </div>
        </section>

        <SriLankaScenes />

        <section className="destinations-section" id="destinations">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE PLACES THAT STAY WITH YOU</p>
              <h2>Find your <em>somewhere.</em></h2>
            </div>
            <span className="destination-count">{String(destinations.length).padStart(2, '0')} PLACES</span>
          </div>

          {error && <div className="notice notice-error" role="alert">{error}</div>}
          {!error && destinations.length === 0 && (
            <div className="empty-state">No destinations yet. Please check back soon.</div>
          )}
          {destinations.length > 0 && (
            <>
              <p className="destination-results" aria-live="polite">
                Showing {firstDestinationIndex + 1}–
                {Math.min(firstDestinationIndex + destinationsPerPage, destinations.length)} of{' '}
                {destinations.length} places
              </p>
              <div className="destination-grid">
                {visibleDestinations.map((destination, index) => (
                  <DestinationCard
                    key={destination._id}
                    destination={destination}
                    index={firstDestinationIndex + index}
                  />
                ))}
              </div>
              {pageCount > 1 && (
                <nav className="destination-pagination" aria-label="Destination pages">
                  {currentPage > 1 ? (
                    <Link
                      className="pagination-step"
                      href={`/?page=${currentPage - 1}#destinations`}
                      aria-label="Go to previous destination page"
                    >
                      <span aria-hidden="true">←</span> Previous
                    </Link>
                  ) : (
                    <span className="pagination-step is-disabled" aria-disabled="true">
                      <span aria-hidden="true">←</span> Previous
                    </span>
                  )}
                  <div className="pagination-pages">
                    {Array.from({ length: pageCount }, (_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <Link
                          key={pageNumber}
                          href={`/?page=${pageNumber}#destinations`}
                          className="pagination-page"
                          aria-label={`Go to page ${pageNumber}`}
                          aria-current={pageNumber === currentPage ? 'page' : undefined}
                        >
                          {pageNumber}
                        </Link>
                      );
                    })}
                  </div>
                  {currentPage < pageCount ? (
                    <Link
                      className="pagination-step"
                      href={`/?page=${currentPage + 1}#destinations`}
                      aria-label="Go to next destination page"
                    >
                      Next <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <span className="pagination-step is-disabled" aria-disabled="true">
                      Next <span aria-hidden="true">→</span>
                    </span>
                  )}
                </nav>
              )}
            </>
          )}
          <div className="all-places-note">
            <span className="sun-mark">✳</span>
            <p>Every journey begins with a place.</p>
            <Link href="/admin/login">Are you the curator? <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section className="trip-ideas-section">
          <div className="trip-ideas-copy">
            <p className="eyebrow">NO ACCOUNT NEEDED</p>
            <h2>One island.<br /><em>So many ways to wander.</em></h2>
            <p>Start with a place that catches your eye. Discover what is nearby, check the local weather and let the rest of the journey unfold.</p>
            <div className="trip-ideas-actions">
              <Link className="button button-light" href="#destinations">Browse destinations <span aria-hidden="true">→</span></Link>
              <span className="trip-public-note">Explore places and check local weather, all without signing in.</span>
            </div>
          </div>
          <div className="trip-ideas-list" aria-label="A few ways to explore">
            <div><span>01</span><p>Begin with the ancient heartland</p><span aria-hidden="true">↗</span></div>
            <div><span>02</span><p>Follow the rails into the highlands</p><span aria-hidden="true">↗</span></div>
            <div><span>03</span><p>Finish with a slow coastal afternoon</p><span aria-hidden="true">↗</span></div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <Link className="brand footer-brand" href="/"><BrandMark /><span>Sri Lanka <span className="brand-light">Explorer</span></span></Link>
        <span>Made for the curious · Sri Lanka · M.A ABDUL AZEEZ</span>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </>
  );
}
