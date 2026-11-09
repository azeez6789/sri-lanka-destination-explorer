import { ServiceUnavailableException } from '@nestjs/common';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  const service = new WeatherService();

  afterEach(() => jest.restoreAllMocks());

  it('maps current Open-Meteo data into display values', async () => {
    const fetch = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          current: {
            temperature_2m: 29.4,
            relative_humidity_2m: 78,
            weather_code: 2,
            wind_speed_10m: 12.1,
          },
          current_units: {
            temperature_2m: '°C',
            wind_speed_10m: 'km/h',
          },
        }),
        { status: 200 },
      ),
    );

    await expect(service.getCurrent(6.93548, 79.84868)).resolves.toEqual({
      temperature: 29.4,
      temperatureUnit: '°C',
      condition: 'Partly cloudy',
      humidity: 78,
      windSpeed: 12.1,
      windSpeedUnit: 'km/h',
    });

    const requestUrl = new URL(fetch.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get('latitude')).toBe('6.93548');
    expect(requestUrl.searchParams.get('longitude')).toBe('79.84868');
    expect(requestUrl.searchParams.get('timezone')).toBe('Asia/Colombo');
  });

  it('returns a clear service error when Open-Meteo is unavailable', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response('upstream error', { status: 503 }),
    );

    await expect(service.getCurrent(6.9, 79.8)).rejects.toThrow(
      ServiceUnavailableException,
    );
  });
});
