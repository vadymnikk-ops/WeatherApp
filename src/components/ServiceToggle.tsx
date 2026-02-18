import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ServiceType } from '../types/weather';

type ServiceToggleProps = {
  selectedService: ServiceType;
  onSelect: (service: ServiceType) => void;
  accent: string;
  accentSoft: string;
  textColor: string;
};

const options: Array<{ id: ServiceType; label: string }> = [
  { id: 'openWeather', label: 'OpenWeather' },
  { id: 'weatherApi', label: 'Met.no' }
];

export function ServiceToggle({
  selectedService,
  onSelect,
  accent,
  accentSoft,
  textColor
}: ServiceToggleProps) {
  return (
    <View>
      <Text style={[styles.title, { color: textColor }]}>Weather Service</Text>
      <View style={[styles.row, { backgroundColor: accentSoft }]}> 
        {options.map((option) => {
          const isActive = option.id === selectedService;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={({ pressed }) => [
                styles.option,
                {
                  borderColor: isActive ? accent : 'transparent',
                  backgroundColor: isActive ? accent : 'transparent',
                  transform: [{ scale: pressed ? 0.97 : 1 }]
                }
              ]}
            >
              <Text style={{ color: isActive ? '#FFFFFF' : textColor, fontWeight: '800' }}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.2
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 14,
    padding: 6
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center'
  }
});
