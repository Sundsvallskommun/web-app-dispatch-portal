// address.service.ts
// Handles both address lines (street + number) and city capitalization.

export enum AddressError {
  EMPTY_INPUT = 'EMPTY_INPUT',
  INVALID_CHAR = 'INVALID_CHAR',
  BAD_FORMAT = 'BAD_FORMAT',
  BAD_HOUSENUMBER = 'BAD_HOUSENUMBER',
}

export interface IAddressTryResult<T = string> {
  ok: boolean;
  value?: T;
  error?: AddressError;
}

const STREET_ALLOWED_REGEX = /^[A-Za-zÅÄÖåäö0-9'.\-\s]+$/;
const CITY_ALLOWED_REGEX = /^[A-Za-zÅÄÖåäö'.\-\s]+$/;

function normalizeDigits(input: string): string {
  if (!input) return input;
  let out = '';
  for (const ch of input) {
    const code = ch.codePointAt(0);
    if (code === undefined) continue;
    if (code >= 0x0660 && code <= 0x0669) {
      out += String.fromCodePoint(48 + (code - 0x0660));
      continue;
    }
    if (code >= 0x06f0 && code <= 0x06f9) {
      out += String.fromCodePoint(48 + (code - 0x06f0));
      continue;
    }
    out += ch;
  }
  return out;
}

function collapseSpaces(s: string): string {
  return s.replace(/[\s\u00A0]+/g, ' ').trim();
}

function capitalizeWord(word: string): string {
  const lower = word.toLocaleLowerCase('sv-SE');
  return lower ? lower[0].toLocaleUpperCase('sv-SE') + lower.slice(1) : lower;
}

function capitalizeStreet(street: string): string {
  return capitalizeWord(street);
}

/**
 * Capitalizes each word in a city name properly.
 * e.g. "västra frölunda" → "Västra Frölunda"
 */
export function tryNormalizeCity(raw: string | undefined): IAddressTryResult {
  if (!raw || collapseSpaces(raw) === '') {
    return { ok: false, error: AddressError.EMPTY_INPUT };
  }

  const cleaned = collapseSpaces(raw);

  if (!CITY_ALLOWED_REGEX.test(cleaned)) {
    return { ok: false, error: AddressError.INVALID_CHAR };
  }

  // Capitalize each word (handles compound cities like "Västra Frölunda")
  const normalized = cleaned.split(' ').map(capitalizeWord).join(' ');

  return { ok: true, value: normalized };
}

/**
 * Parses "Street 24C" → Normalized
 */
export function tryNormalizeAddressLine(raw: string | undefined): IAddressTryResult {
  if (!raw || collapseSpaces(raw) === '') {
    return { ok: false, error: AddressError.EMPTY_INPUT };
  }

  const cleaned = collapseSpaces(normalizeDigits(raw));
  const m = cleaned.match(/^([^\d]+?)\s+(\d{1,4})([A-Za-zÅÄÖåäö])?$/);
  if (!m) return { ok: false, error: AddressError.BAD_FORMAT };

  const street = collapseSpaces(m[1]);
  const number = m[2];
  const suffix = (m[3] ?? '').toUpperCase();

  if (!STREET_ALLOWED_REGEX.test(street)) {
    return { ok: false, error: AddressError.INVALID_CHAR };
  }
  if (!/^\d{1,4}$/.test(number)) {
    return { ok: false, error: AddressError.BAD_HOUSENUMBER };
  }

  const normalized = `${capitalizeStreet(street)} ${number}${suffix}`;
  return { ok: true, value: normalized };
}

export function isValidAddressLine(raw: string): boolean {
  const r = tryNormalizeAddressLine(raw);
  return !!(r.ok && r.value);
}

export function toAddressStorage(raw: string): string | undefined {
  const r = tryNormalizeAddressLine(raw);
  return r.ok ? r.value : undefined;
}

export function trySplitAddress(raw: string): IAddressTryResult<{ street: string; building: string }> {
  const r = tryNormalizeAddressLine(raw);
  if (!r.ok || !r.value) return { ok: false, error: r.error };
  const m = r.value.match(/^([^\d]{1,100})\s+(\d{1,6}[A-ZÅÄÖ]?)$/);
  if (!m) return { ok: false, error: AddressError.BAD_FORMAT };
  return { ok: true, value: { street: m[1], building: m[2] } };
}
