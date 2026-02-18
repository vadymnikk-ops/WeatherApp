import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WeatherScreen } from './src/screens/WeatherScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <WeatherScreen />
    </SafeAreaProvider>
  );
}
