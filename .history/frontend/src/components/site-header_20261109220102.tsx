import Link from 'next/link';
import BrandMark from '@/components/brand-mark';

export default function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <Link className="brand" href="/">
        <BrandMark />
        <span>Sri Lanka <span className="brand-light">Explorer</span></span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link href="/#about">About</Link>
        <Link href="/#experiences">Experiences</Link>
        <Link href="/#destinations">Destinations</Link>
        <Link href="/admin/login" className="nav-cta">Admin sign in <span aria-hidden="true">↗</span></Link>
      </nav>
    </header>
  );
}
