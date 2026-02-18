import { mapOpenMeteoToWeatherData, mapWeatherApiToWeatherData } from '../src/adapters/weatherAdapter';
import { IGeoService } from '../src/services/geocoding/GeoService';
import { OpenWeatherService } from '../src/services/weather/OpenWeatherService';
import { WeatherApiService } from '../src/services/weather/WeatherApiService';

describe('weather adapters', () => {
  it('maps OpenMeteo payload to WeatherData', () => {
    const mapped = mapOpenMeteoToWeatherData(
      {
        current: {
          temperature_2m: 21,
          relative_humidity_2m: 43,
          wind_speed_10m: 11,
          weather_code: 2,
          time: '2026-02-18T10:00'
        }
      },
      'Kyiv, Ukraine',
      'openWeather'
    );

    expect(mapped.temperature).toBe(21);
    expect(mapped.humidity).toBe(43);
    expect(mapped.windSpeed).toBe(11);
    expect(mapped.locationLabel).toBe('Kyiv, Ukraine');
  });

  it('throws on malformed Met.no payload', () => {
    expect(() => mapWeatherApiToWeatherData({}, 'Kyiv', 'weatherApi')).toThrow(
      'Malformed Met.no response'
    );
  });
});

describe('OpenWeatherService', () => {
  it('returns weather on successful API call', async () => {
    const geoService: IGeoService = {
      resolve: jest.fn().mockResolvedValue({
        latitude: 50.45,
        longitude: 30.52,
        label: 'Kyiv, Ukraine'
      })
    };

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 20,
          relative_humidity_2m: 40,
          wind_speed_10m: 9,
          weather_code: 0,
          time: '2026-02-18T09:00'
        }
      })
    });

    const service = new OpenWeatherService(geoService, mockFetch as unknown as typeof fetch);
    const weather = await service.getWeather('Kyiv');

    expect(weather.service).toBe('openWeather');
    expect(weather.temperature).toBe(20);
  });
});

describe('WeatherApiService', () => {
  it('returns weather on successful API call', async () => {
    const geoService: IGeoService = {
      resolve: jest.fn().mockResolvedValue({
        latitude: 50.45,
        longitude: 30.52,
        label: 'Kyiv, Ukraine'
      })
    };

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        properties: {
          timeseries: [
            {
              time: '2026-02-18T11:00:00Z',
              data: {
                instant: {
                  details: {
                    air_temperature: 3,
                    relative_humidity: 65,
                    wind_speed: 5
                  }
                },
                next_1_hours: {
                  summary: { symbol_code: 'partly_cloudy' }
                }
              }
            }
          ]
        }
      })
    });

    const service = new WeatherApiService(geoService, mockFetch as unknown as typeof fetch);
    const weather = await service.getWeather('Kyiv');

    expect(weather.service).toBe('weatherApi');
    expect(weather.temperature).toBe(3);
    expect(weather.description).toBe('Partly Cloudy');
  });
});
