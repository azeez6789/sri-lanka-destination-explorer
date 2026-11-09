'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { Weather } from '@/lib/types';

export default function WeatherPanel({ destinationId }: { destinationId: string }) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiRequest<Weather>(`/destinations/${destinationId}/weather`)
      .then((result) => { if (active) setWeather(result); })
      .catch(() => {
        if (active) {
          setError('Weather information is temporarily unavailable. Please try again later.');
        }
      });
    return () => { active = false; };
  }, [destinationId]);

  return (
    <section className="weather-card" aria-labelledby="weather-heading">
      <div className="weather-heading-row">
        <div>
          <p className="eyebrow">A LITTLE CHECK-IN</p>
          <h2 id="weather-heading">The weather <em>right now.</em></h2>
        </div>
        <span className="weather-sun" aria-hidden="true">☼</span>
      </div>
      {!weather && !error && <p className="weather-status">Checking the skies over Sri Lanka…</p>}
      {error && <p className="weather-error" role="alert">{error}</p>}
      {weather && (
        <>
          <p className="weather-condition">{weather.condition}</p>
          <div className="weather-stats">
            <div><span>TEMPERATURE</span><strong>{weather.temperature} {weather.temperatureUnit}</strong></div>
            <div><span>HUMIDITY</span><strong>{weather.humidity}%</strong></div>
            <div><span>WIND SPEED</span><strong>{weather.windSpeed} {weather.windSpeedUnit}</strong></div>
          </div>
          <p className="weather-source">Live conditions · Open-Meteo</p>
        </>
      )}
    </section>
  );
}
