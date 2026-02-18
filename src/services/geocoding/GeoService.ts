import { HttpClient } from '../weather/WeatherService';

export interface GeoPoint {
  latitude: number;
  longitude: number;
  label: string;
}

export interface IGeoService {
  resolve(location: string): Promise<GeoPoint>;
}

export class OpenMeteoGeoService implements IGeoService {
  constructor(private readonly httpClient: HttpClient = fetch) {}

  async resolve(location: string): Promise<GeoPoint> {
    const query = encodeURIComponent(location.trim());
    const geocodeRes = await this.httpClient(
      `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1`
    );

    if (!geocodeRes.ok) {
      throw new Error('Geocoding request failed');
    }

    const geocodePayload = (await geocodeRes.json()) as {
      results?: Array<{ name?: string; country?: string; latitude?: number; longitude?: number }>;
    };

    const first = geocodePayload.results?.[0];

    if (!first || typeof first.latitude !== 'number' || typeof first.longitude !== 'number') {
      throw new Error('Location was not found');
    }

    return {
      latitude: first.latitude,
      longitude: first.longitude,
      label: `${first.name ?? location}${first.country ? `, ${first.country}` : ''}`
    };
  }
}
