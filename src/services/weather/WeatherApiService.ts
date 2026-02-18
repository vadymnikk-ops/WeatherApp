import { mapWeatherApiToWeatherData } from '../../adapters/weatherAdapter';
import { parseCoordinates } from '../../utils/validation';
import { IGeoService } from '../geocoding/GeoService';
import { HttpClient, IWeatherService, RequestPolicy } from './WeatherService';

export class WeatherApiService implements IWeatherService {
  readonly type = 'weatherApi' as const;
  readonly label = 'Met.no';
  readonly requestPolicy: RequestPolicy;

  constructor(
    private readonly geoService: IGeoService,
    private readonly httpClient: HttpClient = fetch,
    requestPolicy: RequestPolicy = { timeoutMs: 14000, retries: 2 }
  ) {
    this.requestPolicy = requestPolicy;
  }

  async getWeather(location: string) {
    const normalizedLocation = location.trim();
    const coords = parseCoordinates(normalizedLocation);
    const geo = coords
      ? { latitude: coords.latitude, longitude: coords.longitude, label: normalizedLocation }
      : await this.geoService.resolve(normalizedLocation);

    const response = await this.httpClient(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${geo.latitude}&lon=${geo.longitude}`,
      {
        headers: {
          'User-Agent': 'weather-switch-app/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Met.no request failed');
    }

    const payload = (await response.json()) as {
      properties?: unknown;
    };

    return mapWeatherApiToWeatherData(payload, normalizedLocation, this.type);
  }
}
