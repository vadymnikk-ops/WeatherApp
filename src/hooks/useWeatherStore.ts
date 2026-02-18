import { useEffect, useMemo, useState } from 'react';
import { createWeatherServiceMap } from '../services/weather/WeatherServiceFactory';
import { WeatherStore } from '../store/weatherStore';
import { WeatherState } from '../types/weather';

export function useWeatherStore(): {
  state: WeatherState;
  store: WeatherStore;
} {
  const store = useMemo(() => new WeatherStore({ services: createWeatherServiceMap() }), []);

  const [state, setState] = useState<WeatherState>(store.getState());

  useEffect(() => {
    return store.subscribe((next) => {
      setState(next);
    });
  }, [store]);

  return { state, store };
}
