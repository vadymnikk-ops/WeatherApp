import { ServiceType, WeatherData, WeatherState } from '../types/weather';
import { getWeatherService } from '../services/weather/WeatherServiceFactory';
import { IWeatherService } from '../services/weather/WeatherService';
import { normalizeLocationInput, validateLocationInput } from '../utils/validation';

type WeatherStoreDeps = {
  services: Record<ServiceType, IWeatherService>;
};

type Listener = (state: WeatherState) => void;

const INITIAL_STATE: WeatherState = {
  selectedService: 'openWeather',
  query: '',
  isLoading: false,
  weather: null,
  error: null
};

export class WeatherStore {
  private state: WeatherState = INITIAL_STATE;
  private readonly listeners = new Set<Listener>();
  private readonly cache = new Map<string, WeatherData>();
  private requestVersion = 0;

  constructor(private readonly deps: WeatherStoreDeps) {}

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): WeatherState {
    return this.state;
  }

  setQuery(query: string): void {
    this.patch({ query, error: null });
  }

  async search(input?: string): Promise<void> {
    const rawQuery = input ?? this.state.query;
    const query = normalizeLocationInput(rawQuery);
    const validationError = validateLocationInput(query);

    this.patch({ query });

    if (validationError) {
      this.patch({ weather: null, error: validationError, isLoading: false });
      return;
    }

    const service = getWeatherService(this.state.selectedService, this.deps.services);
    const cacheKey = `${service.type}:${query.toLowerCase()}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      this.patch({ weather: cached, error: null, isLoading: false });
      return;
    }

    const version = ++this.requestVersion;
    this.patch({ isLoading: true, error: null });

    try {
      const weather = await this.fetchWithRetry(service, query);

      if (version !== this.requestVersion) {
        return;
      }

      this.cache.set(cacheKey, weather);
      this.patch({ weather, isLoading: false, error: null });
    } catch (error) {
      if (version !== this.requestVersion) {
        return;
      }

      const message = error instanceof Error ? error.message : 'Unknown weather error';
      this.patch({
        weather: this.state.weather,
        isLoading: false,
        error: `${message}. Try retry or switch provider.`
      });
    }
  }

  async setService(service: ServiceType): Promise<void> {
    if (this.state.selectedService === service) {
      return;
    }

    this.patch({ selectedService: service, error: null });

    if (normalizeLocationInput(this.state.query)) {
      await this.search(this.state.query);
    }
  }

  private async fetchWithRetry(service: IWeatherService, query: string): Promise<WeatherData> {
    const retries = service.requestPolicy.retries;
    let attempt = 0;
    let latestError: unknown;

    while (attempt <= retries) {
      try {
        return await this.withTimeout(
          service.getWeather(query),
          service.requestPolicy.timeoutMs,
          `Weather request timeout (${service.requestPolicy.timeoutMs}ms)`
        );
      } catch (error) {
        latestError = error;
        attempt += 1;
      }
    }

    throw latestError;
  }

  private patch(partial: Partial<WeatherState>): void {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener(this.state));
  }

  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    message: string
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(message));
      }, timeoutMs);

      promise
        .then((value) => {
          clearTimeout(timer);
          resolve(value);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }
}
