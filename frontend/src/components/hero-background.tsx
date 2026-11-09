import Image from 'next/image';

export default function HeroBackground() {
  return (
    <div className="hero-art" aria-hidden="true">
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/sri-lanka-hero.png"
      >
        <source src="/media/pixverse-sri-lanka-hero.mp4" type="video/mp4" />
      </video>
      <Image
        src="/sri-lanka-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-stars" aria-hidden="true">
        <span className="hero-stars__layer hero-stars__layer--far" />
        <span className="hero-stars__layer hero-stars__layer--near" />
      </div>
    </div>
  );
}
