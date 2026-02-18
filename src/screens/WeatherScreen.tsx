import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LocationInput } from '../components/LocationInput';
import { ServiceToggle } from '../components/ServiceToggle';
import { WeatherCard } from '../components/WeatherCard';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useWeatherStore } from '../hooks/useWeatherStore';
import { serviceThemeMap } from '../theme/serviceThemeMap';
import { normalizeLocationInput, validateLocationInput } from '../utils/validation';

export function WeatherScreen() {
  const insets = useSafeAreaInsets();
  const { state, store } = useWeatherStore();
  const theme = serviceThemeMap[state.selectedService];
  const debouncedQuery = useDebouncedValue(state.query, 450);

  useEffect(() => {
    const normalized = normalizeLocationInput(debouncedQuery);

    if (!normalized) {
      return;
    }

    if (validateLocationInput(normalized) === null) {
      void store.search(normalized);
    }
  }, [debouncedQuery, store]);

  return (
    <View style={[styles.root, { backgroundColor: theme.gradientEnd }]}> 
      <View style={[styles.blobLarge, { backgroundColor: theme.gradientStart }]} />
      <View style={[styles.blobSmall, { backgroundColor: theme.accentSoft }]} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 20
          }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.headerCard, { backgroundColor: theme.glass }]}>
          <Text style={[styles.title, { color: theme.text }]}>Weather App</Text>
          <Text style={[styles.subtitle, { color: theme.mutedText }]}>Live forecast with provider switching</Text>
        </View>

        <View style={[styles.panel, { backgroundColor: theme.glass }]}> 
          <ServiceToggle
            selectedService={state.selectedService}
            onSelect={(service) => {
              void store.setService(service);
            }}
            accent={theme.accent}
            accentSoft={theme.accentSoft}
            textColor={theme.text}
          />

          <LocationInput
            value={state.query}
            onChange={(value) => store.setQuery(value)}
            onSearch={() => {
              void store.search();
            }}
            loading={state.isLoading}
            accent={theme.accent}
            textColor={theme.text}
            mutedText={theme.mutedText}
          />
        </View>

        {state.error ? (
          <View style={[styles.errorCard, { backgroundColor: 'rgba(255,255,255,0.75)' }]}>
            <Text style={styles.error}>{state.error}</Text>
          </View>
        ) : null}

        {state.isLoading ? (
          <View style={[styles.loadingCard, { backgroundColor: theme.glass }]}>
            <ActivityIndicator size="small" color={theme.accent} />
            <Text style={[styles.loadingText, { color: theme.text }]}>Refreshing weather...</Text>
          </View>
        ) : null}

        {state.weather ? (
          <WeatherCard
            weather={state.weather}
            surface={theme.surface}
            text={theme.text}
            mutedText={theme.mutedText}
            icon={theme.icon}
            accent={theme.accent}
            accentSoft={theme.accentSoft}
          />
        ) : (
          <Text style={[styles.placeholder, { color: theme.mutedText }]}>Enter a location and press Search.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  blobLarge: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    right: -90,
    top: -80,
    opacity: 0.9
  },
  blobSmall: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    left: -70,
    bottom: 120,
    opacity: 0.8
  },
  content: {
    gap: 16,
    paddingHorizontal: 16
  },
  headerCard: {
    borderRadius: 18,
    padding: 14,
    gap: 4
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0.2
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600'
  },
  panel: {
    borderRadius: 18,
    padding: 12,
    gap: 12
  },
  error: {
    color: '#B91C1C',
    fontWeight: '700'
  },
  errorCard: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  loadingCard: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  loadingText: {
    fontWeight: '700'
  },
  placeholder: {
    fontSize: 14,
    fontWeight: '600'
  }
});
