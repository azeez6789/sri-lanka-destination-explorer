export type Destination = {
  _id: string;
  name: string;
  location?: string;
  summary?: string;
  description: string;
  notes?: string;
  category?: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  imageCredit?: string;
  imageLicense?: string;
  imageSourceUrl?: string;
  images?: string[];
  imageCredits?: string[];
  imageLicenses?: string[];
  imageSourceUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Weather = {
  temperature: number;
  temperatureUnit: string;
  condition: string;
  humidity: number;
  windSpeed: number;
  windSpeedUnit: string;
};
