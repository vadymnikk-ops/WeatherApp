import { ServiceType, WeatherData } from '../../types/weather';

export type HttpClient = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface RequestPolicy {
  timeoutMs: number;
  retries: number;
}

export interface IWeatherService {
  readonly type: ServiceType;
  readonly label: string;
  readonly requestPolicy: RequestPolicy;
  getWeather(location: string): Promise<WeatherData>;
}
