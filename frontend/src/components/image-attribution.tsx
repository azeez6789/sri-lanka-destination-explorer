import { Destination } from '@/lib/types';

export default function ImageAttribution({
  destination,
  className = '',
  attribution,
}: {
  destination: Destination;
  className?: string;
  attribution?: {
    credit?: string;
    license?: string;
    sourceUrl?: string;
  };
}) {
  const credit = attribution
    ? attribution.credit
    : destination.imageCredit;
  const license = attribution
    ? attribution.license
    : destination.imageLicense;
  const sourceUrl = attribution
    ? attribution.sourceUrl
    : destination.imageSourceUrl;
  if (!credit || !sourceUrl) return null;

  return (
    <p className={`image-attribution ${className}`}>
      Photo by{' '}
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
        {credit}
      </a>
      {license && <span> · {license}</span>}
    </p>
  );
}
