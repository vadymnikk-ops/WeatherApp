# Weather App

React Native (Expo) + TypeScript weather app with 2 providers and clean modular architecture.

## What it does

- Search weather by city or coordinates
- Show temperature, condition, wind, humidity, and date/time
- Switch provider: `OpenWeather` / `Met.no`
- Auto-refresh results when provider changes and query already exists
- Validate input before requests
- Adapt UI theme by selected provider

## Tech

- React Native + Expo
- TypeScript (`strict`)
- Jest unit tests

## Project structure

```text
src/
  adapters/
  components/
  hooks/
  screens/
  services/
    geocoding/
    weather/
  store/
  theme/
  types/
  utils/
```

## Run

```bash
npm install
npm run start
npm test
npx tsc --noEmit
```

## Replace a provider

1. Create a new service implementing `IWeatherService`
2. Register it in `src/services/weather/WeatherServiceFactory.ts`
3. (Optional) Add provider theme in `src/theme/serviceThemeMap.ts`



