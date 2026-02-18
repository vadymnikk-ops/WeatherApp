import {
  isCoordinateInput,
  normalizeLocationInput,
  validateLocationInput
} from '../src/utils/validation';

describe('validation', () => {
  it('rejects empty input', () => {
    expect(validateLocationInput('   ')).toBe('Location is required');
  });

  it('rejects unsupported characters', () => {
    expect(validateLocationInput('Kyiv123')).toBe('Location contains unsupported characters');
  });

  it('accepts valid city names', () => {
    expect(validateLocationInput('  New   York ')).toBeNull();
    expect(normalizeLocationInput('  New   York ')).toBe('New York');
  });

  it('accepts coordinates', () => {
    expect(isCoordinateInput('50.45, 30.52')).toBe(true);
    expect(validateLocationInput('50.45, 30.52')).toBeNull();
  });
});
