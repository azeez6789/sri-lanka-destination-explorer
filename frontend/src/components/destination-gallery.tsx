'use client';

import { useState } from 'react';
import ImageAttribution from './image-attribution';
import { Destination } from '@/lib/types';

export default function DestinationGallery({
  images,
  name,
  locationLabel,
  destination,
}: {
  images: string[];
  name: string;
  locationLabel: string;
  destination: Destination;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageCount = images.length;

  function showImage(index: number) {
    setActiveIndex((index + imageCount) % imageCount);
  }

  return (
    <div className="detail-image" role="group" aria-label={`${name} photo gallery`}>
      <div
        className="detail-image-photo"
        style={{ backgroundImage: `url("${images[activeIndex]}")` }}
        role="img"
        aria-label={`${name}, image ${activeIndex + 1} of ${imageCount}`}
      />
      <span className="image-label">{locationLabel}</span>
      {imageCount > 1 && (
        <div className="gallery-controls" role="group" aria-label="Photo navigation">
          <button
            type="button"
            className="gallery-button"
            onClick={() => showImage(activeIndex - 1)}
            aria-label="Show previous image"
          >
            &lsaquo;
          </button>
          <span className="gallery-count" aria-live="polite">
            {activeIndex + 1} / {imageCount}
          </span>
          <button
            type="button"
            className="gallery-button"
            onClick={() => showImage(activeIndex + 1)}
            aria-label="Show next image"
          >
            &rsaquo;
          </button>
        </div>
      )}
      <ImageAttribution
        destination={destination}
        className="detail-image-attribution"
        attribution={activeIndex === 0 ? undefined : {
          credit: destination.imageCredits?.[activeIndex - 1],
          license: destination.imageLicenses?.[activeIndex - 1],
          sourceUrl: destination.imageSourceUrls?.[activeIndex - 1],
        }}
      />
    </div>
  );
}
