import { ServiceType, WeatherData } from '../types/weather';

type OpenMeteoCurrent = {
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  weather_code: number;
  time: string;
};

type OpenMeteoPayload = {
  current?: OpenMeteoCurrent;
};

type MetNoPayload = {
  properties?: {
    timeseries?: Array<{
      time?: string;
      data?: {
        instant?: {
          details?: {
            air_temperature?: number;
            relative_humidity?: number;
            wind_speed?: number;
          };
        };
        next_1_hours?: {
          summary?: { symbol_code?: string };
        };
      };
    }>;
  };
};

function openMeteoCodeToText(code: number): string {
  if (code === 0) {
    return 'Clear sky';
  }

  if (code < 4) {
    return 'Partly cloudy';
  }

  if (code < 60) {
    return 'Cloudy';
  }

  if (code < 80) {
    return 'Rain';
  }

  return 'Storm';
}

export function mapOpenMeteoToWeatherData(
  payload: unknown,
  locationLabel: string,
  service: ServiceType
): WeatherData {
  const parsed = payload as OpenMeteoPayload;
  const current = parsed.current;

  if (!current) {
    throw new Error('Malformed OpenWeather response');
  }

  return {
    temperature: Number(current.temperature_2m),
    humidity: Number(current.relative_humidity_2m),
    windSpeed: Number(current.wind_speed_10m),
    description: openMeteoCodeToText(current.weather_code),
    dateTime: current.time,
    locationLabel,
    service
  };
}

export function mapWeatherApiToWeatherData(
  payload: unknown,
  fallbackLocation: string,
  service: ServiceType
): WeatherData {
  const parsed = payload as MetNoPayload;
  const current = parsed.properties?.timeseries?.[0];
  const details = current?.data?.instant?.details;

  if (!current || !details) {
    throw new Error('Malformed Met.no response');
  }

  return {
    temperature: Number(details.air_temperature ?? 0),
    humidity: Number(details.relative_humidity ?? 0),
    windSpeed: Number(details.wind_speed ?? 0),
    description: (current.data?.next_1_hours?.summary?.symbol_code ?? 'Unknown')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase()),
    dateTime: current.time ?? new Date().toISOString(),
    locationLabel: fallbackLocation,
    service
  };
}
