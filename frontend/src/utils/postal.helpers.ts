// Swedish postal code + "postal line" (postal code + city) utilities.

import { capitalizeWord, collapseSpaces, normalizeDigits } from './helpers';

export enum PostalError {
  EMPTY_INPUT = 'EMPTY_INPUT',
  INVALID_CHAR = 'INVALID_CHAR',
  WRONG_LENGTH = 'WRONG_LENGTH',
  BAD_FORMAT = 'BAD_FORMAT',
}

export interface ITryResult<T = string> {
  ok: boolean;
  value?: T;
  error?: PostalError;
}

function capitalizeCity(city: string): string {
  return city.split(' ').map(capitalizeWord).join(' ');
}

/**
 * Sanitize and normalize a Swedish postal code.
 * Accepts: "85230", "852 30", "SE-85230", "SE 852 30", "852-30"
 * Returns:
 *   - storage (5 digits) via toPostalStorage
 *   - display ("NNN NN") via formatPostalDisplay
 */
export function tryNormalizePostalCode(raw: string | undefined): ITryResult<string> {
  if (!raw || collapseSpaces(raw) === '') {
    return { ok: false, error: PostalError.EMPTY_INPUT };
  }

  // Normalize digits and collapse spaces
  let s = normalizeDigits(raw);
  s = s.replaceAll(/SE/gi, ''); // drop country code prefix if present
  s = s.replaceAll(/[-\s\u00A0]/g, ''); // remove dashes/spaces
  s = s.trim();

  if (!/^\d+$/.test(s)) return { ok: false, error: PostalError.INVALID_CHAR };
  if (s.length !== 5) return { ok: false, error: PostalError.WRONG_LENGTH };

  // Optionally, you could block "00000" if you want.
  return { ok: true, value: s };
}

/** Storage form: "NNNNN" or undefined if invalid */
export function toPostalStorage(raw: string): string | undefined {
  const r = tryNormalizePostalCode(raw);
  return r.ok ? r.value : undefined;
}

/** Display form: "NNN NN" if valid; otherwise returns raw unchanged */
export function formatPostalDisplay(raw: string): string {
  const r = tryNormalizePostalCode(raw);
  if (!r.ok || !r.value) return raw;
  return r.value.replaceAll(/^(\d{3})(\d{2})$/, '$1 $2');
}

/**
 * Full "postal line" normalizer: "<postal> <city>"
 * - Display: "NNN NN City"
 * - Storage: { postalCode: "NNNNN", city: "City" }
 * Accepts loose input like "SE-85230   sundsvall"
 */
export function tryNormalizePostalLine(raw: string | undefined): ITryResult<{ postalCode: string; city: string }> {
  if (!raw || collapseSpaces(raw) === '') {
    return { ok: false, error: PostalError.EMPTY_INPUT };
  }

  const cleaned = collapseSpaces(normalizeDigits(raw));

  // Split by first space after something that looks like a postal code
  // We’ll pull a 5-digit group out of the start, then treat the rest as city.
  const m = cleaned.match(/^\s*(?:SE[-\s]?)?(\d{3}[\s-]?\d{2})\s+(.{1,100})$/);
  if (!m) return { ok: false, error: PostalError.BAD_FORMAT };

  const postalRaw = m[1];
  const cityRaw = m[2];

  const p = tryNormalizePostalCode(postalRaw);
  if (!p.ok || !p.value) return { ok: false, error: p.error };

  // Validate city: basic Swedish letters + common separators
  const cityTrim = collapseSpaces(cityRaw);
  if (!/^[A-Za-zÅÄÖåäö'.\-\s]+$/.test(cityTrim)) {
    return { ok: false, error: PostalError.INVALID_CHAR };
  }

  const city = capitalizeCity(cityTrim);
  return { ok: true, value: { postalCode: p.value, city } };
}

/** Convenience: returns display line "NNN NN City" or raw if invalid */
export function formatPostalLineDisplay(raw: string): string {
  const r = tryNormalizePostalLine(raw);
  if (!r.ok || !r.value) return raw;
  return `${r.value.postalCode.replaceAll(/^(\d{3})(\d{2})$/, '$1 $2')} ${r.value.city}`;
}
