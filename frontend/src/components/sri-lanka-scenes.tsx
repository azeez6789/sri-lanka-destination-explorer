import Image from 'next/image';

export default function SriLankaScenes() {
  return (
    <section className="scenic-section" aria-labelledby="scenic-heading">
      <div className="scenic-heading">
        <p className="eyebrow">A LITTLE ISLAND MAGIC</p>
        <h2 id="scenic-heading">Scenes to <em>stay a while.</em></h2>
        <p>From the highlands to the shore, Sri Lanka is always in motion.</p>
      </div>
      <div className="scenic-grid">
        <article className="scenic-card scenic-elephant">
          <Image
            className="scenic-photo"
            src="/media/sri-lankan-elephant.jpg"
            alt="A baby Sri Lankan elephant at Kalawewa National Park"
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 900px) 45vw, 30vw"
          />
          <div className="scenic-copy">
            <span>WILDLIFE</span>
            <h3>Gentle giants</h3>
            <p>A little island wonder, wandering by.</p>
            <small className="media-credit">
              Photo:{' '}
              <a
                href="https://commons.wikimedia.org/wiki/File:Baby_Sri_Lankan_elephant_(Elephas_maximus_maximus).jpg"
                target="_blank"
                rel="noreferrer"
              >
                Senthiaathavan
              </a>
              {' · '}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC BY-SA 4.0
              </a>
            </small>
          </div>
        </article>

        <article className="scenic-card scenic-beach">
          <div className="scenic-art scenic-waves" aria-hidden="true">
            <svg viewBox="0 0 420 150" preserveAspectRatio="none">
              <path className="wave wave-one" d="M0 42c70-30 140 30 210 0s140 30 210 0v108H0z" />
              <path className="wave wave-two" d="M0 68c70-30 140 30 210 0s140 30 210 0v82H0z" />
              <path className="wave wave-three" d="M0 94c70-30 140 30 210 0s140 30 210 0v56H0z" />
            </svg>
          </div>
          <div className="scenic-copy">
            <span>SOUTHERN COAST</span>
            <h3>Meet me by the sea</h3>
            <p>Salt air, rolling waves and nowhere else to be.</p>
          </div>
        </article>

        <article className="scenic-card scenic-bridge">
          <Image
            className="scenic-photo"
            src="/destinations/nine-arch-bridge.png"
            alt="A train crossing the Nine Arch Bridge through the green highlands near Ella"
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 900px) 45vw, 30vw"
          />
          <div className="scenic-copy">
            <span>NINE ARCH BRIDGE · ELLA</span>
            <h3>Across the highlands</h3>
            <p>A train winds through the green hills on its way across the Nine Arch Bridge.</p>
          </div>
        </article>
      </div>
    </section>
  );
}
