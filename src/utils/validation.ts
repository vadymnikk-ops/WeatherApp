const CITY_PATTERN = /^[a-zA-Z\s.'-]+(?:,[a-zA-Z\s.'-]+)*$/;
const COORDS_PATTERN = /^-?\d{1,2}(?:\.\d+)?\s*,\s*-?\d{1,3}(?:\.\d+)?$/;

export function normalizeLocationInput(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function isCoordinateInput(value: string): boolean {
  return COORDS_PATTERN.test(value.trim());
}

export function parseCoordinates(value: string): { latitude: number; longitude: number } | null {
  if (!isCoordinateInput(value)) {
    return null;
  }

  const [latRaw, lonRaw] = value.split(',');
  const latitude = Number(latRaw.trim());
  const longitude = Number(lonRaw.trim());

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null;
  }

  return { latitude, longitude };
}

export function validateLocationInput(raw: string): string | null {
  const value = normalizeLocationInput(raw);

  if (!value) {
    return 'Location is required';
  }

  if (isCoordinateInput(value)) {
    return null;
  }

  if (value.length < 2) {
    return 'Location must be at least 2 characters';
  }

  if (!CITY_PATTERN.test(value)) {
    return 'Location contains unsupported characters';
  }

  return null;
}
