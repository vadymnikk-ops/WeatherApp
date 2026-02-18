import { ServiceType } from '../../types/weather';
import { OpenMeteoGeoService } from '../geocoding/GeoService';
import { IWeatherService } from './WeatherService';
import { OpenWeatherService } from './OpenWeatherService';
import { WeatherApiService } from './WeatherApiService';

export function createWeatherServiceMap(): Record<ServiceType, IWeatherService> {
  const geoService = new OpenMeteoGeoService();

  return {
    openWeather: new OpenWeatherService(geoService),
    weatherApi: new WeatherApiService(geoService)
  };
}

export function getWeatherService(
  type: ServiceType,
  map: Record<ServiceType, IWeatherService>
): IWeatherService {
  return map[type];
}
