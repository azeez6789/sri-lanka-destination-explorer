import { Injectable, ServiceUnavailableException } from '@nestjs/common';

type OpenMeteoResponse = {
  current?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  current_units?: {
    temperature_2m: string;
    wind_speed_10m: string;
  };
};

const CONDITIONS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snowfall',
  73: 'Moderate snowfall',
  75: 'Heavy snowfall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

@Injectable()
export class WeatherService {
  async getCurrent(latitude: number, longitude: number) {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.search = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current:
        'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
      timezone: 'Asia/Colombo',
    }).toString();

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);
      const data = (await response.json()) as OpenMeteoResponse;
      if (
        !data.current ||
        !Number.isFinite(data.current.temperature_2m) ||
        !Number.isFinite(data.current.relative_humidity_2m) ||
        !Number.isFinite(data.current.weather_code) ||
        !Number.isFinite(data.current.wind_speed_10m)
      ) {
        throw new Error('Open-Meteo returned an incomplete current-weather record.');
      }

      return {
        temperature: data.current.temperature_2m,
        temperatureUnit: data.current_units?.temperature_2m ?? '°C',
        condition: CONDITIONS[data.current.weather_code] ?? 'Unknown conditions',
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windSpeedUnit: data.current_units?.wind_speed_10m ?? 'km/h',
      };
    } catch {
      throw new ServiceUnavailableException(
        'Current weather is temporarily unavailable. Please try again later.',
      );
    }
  }
}
