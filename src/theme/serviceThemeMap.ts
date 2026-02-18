import { ServiceType } from '../types/weather';

export type ServiceTheme = {
  gradientStart: string;
  gradientEnd: string;
  glass: string;
  surface: string;
  text: string;
  mutedText: string;
  accent: string;
  accentSoft: string;
  icon: string;
};

export const serviceThemeMap: Record<ServiceType, ServiceTheme> = {
  openWeather: {
    gradientStart: '#C7EAFF',
    gradientEnd: '#EAF6FF',
    glass: 'rgba(255,255,255,0.45)',
    surface: '#FFFFFF',
    text: '#0B2239',
    mutedText: '#355A7F',
    accent: '#0284C7',
    accentSoft: '#D3EEFF',
    icon: '🌤'
  },
  weatherApi: {
    gradientStart: '#D8F8E4',
    gradientEnd: '#F3FFF7',
    glass: 'rgba(255,255,255,0.5)',
    surface: '#FFFFFF',
    text: '#0A2D1B',
    mutedText: '#2F6A48',
    accent: '#16A34A',
    accentSoft: '#D9FCE6',
    icon: '🌦'
  }
};
