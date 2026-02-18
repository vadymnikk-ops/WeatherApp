import { mapOpenMeteoToWeatherData } from '../../adapters/weatherAdapter';
import { parseCoordinates } from '../../utils/validation';
import { IGeoService } from '../geocoding/GeoService';
import { HttpClient, IWeatherService, RequestPolicy } from './WeatherService';

export class OpenWeatherService implements IWeatherService {
  readonly type = 'openWeather' as const;
  readonly label = 'OpenWeather';
  readonly requestPolicy: RequestPolicy;

  constructor(
    private readonly geoService: IGeoService,
    private readonly httpClient: HttpClient = fetch,
    requestPolicy: RequestPolicy = { timeoutMs: 8000, retries: 1 }
  ) {
    this.requestPolicy = requestPolicy;
  }

  async getWeather(location: string) {
    const normalizedLocation = location.trim();
    const coords = parseCoordinates(normalizedLocation);
    const geo = coords
      ? { latitude: coords.latitude, longitude: coords.longitude, label: normalizedLocation }
      : await this.geoService.resolve(normalizedLocation);

    const weatherRes = await this.httpClient(
      `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
    );

    if (!weatherRes.ok) {
      throw new Error('OpenWeather weather request failed');
    }

    const weatherPayload = (await weatherRes.json()) as { current?: unknown };

    return mapOpenMeteoToWeatherData(weatherPayload, geo.label, this.type);
  }
}
