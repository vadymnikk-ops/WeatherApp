import { WeatherStore } from '../src/store/weatherStore';
import { IWeatherService } from '../src/services/weather/WeatherService';
import { ServiceType, WeatherData } from '../src/types/weather';

function createService(type: ServiceType, result: WeatherData): IWeatherService {
  return {
    type,
    label: type,
    requestPolicy: { timeoutMs: 1000, retries: 0 },
    getWeather: jest.fn().mockResolvedValue(result)
  };
}

describe('WeatherStore', () => {
  it('updates loading and weather on search', async () => {
    const openWeather = createService('openWeather', {
      temperature: 18,
      description: 'Clear',
      humidity: 41,
      windSpeed: 10,
      dateTime: '2026-02-18T11:00',
      locationLabel: 'Kyiv',
      service: 'openWeather'
    });

    const weatherApi = createService('weatherApi', {
      temperature: 19,
      description: 'Cloudy',
      humidity: 45,
      windSpeed: 12,
      dateTime: '2026-02-18T11:00',
      locationLabel: 'Kyiv',
      service: 'weatherApi'
    });

    const store = new WeatherStore({ services: { openWeather, weatherApi } });

    const snapshots: Array<boolean> = [];
    store.subscribe((state) => snapshots.push(state.isLoading));

    store.setQuery('Kyiv');
    await store.search();

    expect(snapshots).toContain(true);
    expect(store.getState().weather?.service).toBe('openWeather');
    expect(openWeather.getWeather).toHaveBeenCalledWith('Kyiv');
  });

  it('auto-refreshes on service toggle when query exists', async () => {
    const openWeather = createService('openWeather', {
      temperature: 15,
      description: 'Clear',
      humidity: 30,
      windSpeed: 8,
      dateTime: '2026-02-18T08:00',
      locationLabel: 'Kyiv',
      service: 'openWeather'
    });

    const weatherApi = createService('weatherApi', {
      temperature: 16,
      description: 'Rain',
      humidity: 60,
      windSpeed: 14,
      dateTime: '2026-02-18T08:05',
      locationLabel: 'Kyiv',
      service: 'weatherApi'
    });

    const store = new WeatherStore({ services: { openWeather, weatherApi } });

    store.setQuery('Kyiv');
    await store.search();
    await store.setService('weatherApi');

    expect(weatherApi.getWeather).toHaveBeenCalledWith('Kyiv');
    expect(store.getState().selectedService).toBe('weatherApi');
    expect(store.getState().weather?.service).toBe('weatherApi');
  });

  it('stores validation error for invalid input', async () => {
    const openWeather = createService('openWeather', {
      temperature: 1,
      description: 'Any',
      humidity: 1,
      windSpeed: 1,
      dateTime: '2026-02-18T00:00',
      locationLabel: 'Any',
      service: 'openWeather'
    });

    const weatherApi = createService('weatherApi', {
      temperature: 1,
      description: 'Any',
      humidity: 1,
      windSpeed: 1,
      dateTime: '2026-02-18T00:00',
      locationLabel: 'Any',
      service: 'weatherApi'
    });

    const store = new WeatherStore({ services: { openWeather, weatherApi } });

    await store.search('1');

    expect(store.getState().error).toBe('Location must be at least 2 characters');
    expect(openWeather.getWeather).not.toHaveBeenCalled();
  });

  it('stops loading when request times out', async () => {
    jest.useFakeTimers();

    const hangingService: IWeatherService = {
      type: 'openWeather',
      label: 'openWeather',
      requestPolicy: { timeoutMs: 100, retries: 0 },
      getWeather: jest.fn().mockImplementation(() => new Promise<WeatherData>(() => undefined))
    };

    const weatherApi = createService('weatherApi', {
      temperature: 10,
      description: 'Any',
      humidity: 10,
      windSpeed: 10,
      dateTime: '2026-02-18T00:00',
      locationLabel: 'Any',
      service: 'weatherApi'
    });

    const store = new WeatherStore({
      services: { openWeather: hangingService, weatherApi }
    });

    const searchPromise = store.search('Lviv');
    jest.advanceTimersByTime(120);
    await searchPromise;

    expect(store.getState().isLoading).toBe(false);
    expect(store.getState().error).toContain('Weather request timeout');

    jest.useRealTimers();
  });

  it('shows error and keeps selected provider when service fails', async () => {
    const openWeather = createService('openWeather', {
      temperature: 17,
      description: 'Clear',
      humidity: 44,
      windSpeed: 8,
      dateTime: '2026-02-18T12:00',
      locationLabel: 'Lviv',
      service: 'openWeather'
    });

    const weatherApi: IWeatherService = {
      type: 'weatherApi',
      label: 'weatherApi',
      requestPolicy: { timeoutMs: 200, retries: 0 },
      getWeather: jest.fn().mockRejectedValue(new Error('Met.no request failed'))
    };

    const store = new WeatherStore({
      services: { openWeather, weatherApi }
    });

    store.setQuery('Lviv');
    await store.setService('weatherApi');

    expect(store.getState().selectedService).toBe('weatherApi');
    expect(store.getState().error).toContain('Met.no request failed');
  });
});
