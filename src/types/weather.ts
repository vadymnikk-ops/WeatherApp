export type ServiceType = 'openWeather' | 'weatherApi';

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  dateTime: string;
  locationLabel: string;
  service: ServiceType;
}

export interface WeatherState {
  selectedService: ServiceType;
  query: string;
  isLoading: boolean;
  weather: WeatherData | null;
  error: string | null;
}
