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



## Screens
<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2026-02-18 at 14 29 11" src="https://github.com/user-attachments/assets/302c6c69-cd5a-4f9c-9df8-a306747d53c7" />

<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2026-02-18 at 14 29 14" src="https://github.com/user-attachments/assets/b14c9534-e02e-42e7-9694-e60fa943d4f9" />









