import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type LocationInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
  accent: string;
  textColor: string;
  mutedText: string;
};

export function LocationInput({
  value,
  onChange,
  onSearch,
  loading,
  accent,
  textColor,
  mutedText
}: LocationInputProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textColor }]}>Location or coordinates</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Kyiv or 50.45, 30.52"
        placeholderTextColor={mutedText}
        autoCapitalize="words"
        autoCorrect={false}
        style={[styles.input, { borderColor: accent, color: textColor }]}
      />
      <Pressable
        onPress={onSearch}
        disabled={loading}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: accent,
            opacity: loading ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }]
          }
        ]}
      >
        <Text style={styles.buttonText}>{loading ? 'Searching...' : 'Search'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  input: {
    borderWidth: 1.2,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    fontSize: 16
  },
  button: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.2
  }
});
