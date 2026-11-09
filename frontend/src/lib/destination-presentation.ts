import { Destination } from '@/lib/types';

type DestinationLocation = {
  district: string;
  province: string;
  imageUrl?: string;
};

const destinationLocations: Record<string, DestinationLocation> = {
  colombo: {
    district: 'Colombo',
    province: 'Western',
    imageUrl: '/destinations/colombo-lotus-tower.png',
  },
  galle: { district: 'Galle', province: 'Southern', imageUrl: '/destinations/galle-fort.png' },
  kandy: { district: 'Kandy', province: 'Central', imageUrl: '/destinations/temple-of-the-tooth.png' },
  'temple of the tooth': { district: 'Kandy', province: 'Central', imageUrl: '/destinations/temple-of-the-tooth.png' },
  sigiriya: { district: 'Matale', province: 'Central', imageUrl: '/destinations/sigiriya.png' },
  dambulla: { district: 'Matale', province: 'Central' },
  'nine arch bridge': { district: 'Badulla', province: 'Uva', imageUrl: '/destinations/nine-arch-bridge.png' },
  'nine arches': { district: 'Badulla', province: 'Uva', imageUrl: '/destinations/nine-arch-bridge.png' },
  'ella': { district: 'Badulla', province: 'Uva', imageUrl: '/destinations/nine-arch-bridge.png' },
  badulla: { district: 'Badulla', province: 'Uva', imageUrl: '/destinations/nine-arch-bridge.png' },
  'nuwara eliya': { district: 'Nuwara Eliya', province: 'Central' },
  mirissa: { district: 'Matara', province: 'Southern' },
  yala: { district: 'Monaragala', province: 'Uva' },
};

const placeholderImageUrl = '/destinations/destination-placeholder.svg';

function findLocation(destination: Destination): DestinationLocation | undefined {
  const name = destination.name.trim().toLowerCase();
  return destinationLocations[name] ??
    Object.entries(destinationLocations).find(([place]) => name.includes(place))?.[1];
}

export function getDestinationImageUrl(destination: Destination): string {
  return (
    destination.imageUrl ||
    destination.images?.[0] ||
    findLocation(destination)?.imageUrl ||
    placeholderImageUrl
  );
}

export function getDestinationImages(destination: Destination): string[] {
  return [...new Set([getDestinationImageUrl(destination), ...(destination.images ?? [])])];
}

export function getDestinationLocation(destination: Destination) {
  if (destination.location?.trim()) {
    const location = destination.location.trim();
    return {
      label: location.toUpperCase(),
      description: location,
    };
  }

  const location = findLocation(destination);

  if (location) {
    return {
      label: `${location.district.toUpperCase()} · ${location.province.toUpperCase()} PROVINCE`,
      description: `${location.district} District, ${location.province} Province`,
    };
  }

  return {
    label: `${destination.latitude.toFixed(2)}° N · ${destination.longitude.toFixed(2)}° E`,
    description: `${destination.latitude.toFixed(4)}° N, ${destination.longitude.toFixed(4)}° E`,
  };
}
