import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { WeatherData } from '../types/weather';

type WeatherCardProps = {
  weather: WeatherData;
  surface: string;
  text: string;
  mutedText: string;
  icon: string;
  accent: string;
  accentSoft: string;
};

function formatWeatherDateTime(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(parsed);
}

export function WeatherCard({
  weather,
  surface,
  text,
  mutedText,
  icon,
  accent,
  accentSoft
}: WeatherCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true
      }),
      Animated.spring(translateY, {
        toValue: 0,
        damping: 14,
        stiffness: 130,
        useNativeDriver: true
      })
    ]).start();
  }, [weather, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: surface,
          opacity,
          transform: [{ translateY }]
        }
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.topMain}>
          <Text style={[styles.location, { color: text }]}> {icon} {weather.locationLabel}</Text>
          <Text style={[styles.temperature, { color: text }]}>{weather.temperature.toFixed(1)}°</Text>
        </View>
        <View style={[styles.conditionPill, { backgroundColor: accentSoft, borderColor: accent }]}>
          <Text style={[styles.conditionText, { color: accent }]}>{weather.description}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={[styles.statCard, { borderColor: accentSoft }]}>
          <Text style={[styles.statLabel, { color: mutedText }]}>💨 Wind</Text>
          <Text style={[styles.statValue, { color: text }]}>{weather.windSpeed.toFixed(1)} km/h</Text>
        </View>
        <View style={[styles.statCard, { borderColor: accentSoft }]}>
          <Text style={[styles.statLabel, { color: mutedText }]}>💧 Humidity</Text>
          <Text style={[styles.statValue, { color: text }]}>{weather.humidity.toFixed(0)}%</Text>
        </View>
      </View>
      <Text style={[styles.time, { color: mutedText }]}>
        🕒 Date & time: {formatWeatherDateTime(weather.dateTime)}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8
  },
  topMain: {
    flex: 1,
    gap: 2
  },
  location: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.2
  },
  temperature: {
    fontSize: 44,
    lineHeight: 48,
    fontWeight: '900'
  },
  conditionPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start'
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '800'
  },
  grid: {
    flexDirection: 'row',
    gap: 10
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 2
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700'
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800'
  },
  time: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600'
  }
});
