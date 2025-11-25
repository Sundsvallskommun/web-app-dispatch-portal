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
 *   - display ("NNN NN") via formatPostalDisplay
 */
export function tryNormalizePostalCode(raw: string | undefined): ITryResult<string> {
  if (!raw || collapseSpaces(raw) === '') {
    return { ok: false, error: PostalError.EMPTY_INPUT };
  }

  // Normalize digits and collapse spaces
  let postal = normalizeDigits(raw);
  postal = postal.replaceAll(/SE/gi, ''); // drop country code prefix if present
  postal = postal.replaceAll(/[-\s\u00A0]/g, ''); // remove dashes/spaces
  postal = postal.trim();

  if (!/^\d+$/.test(postal)) return { ok: false, error: PostalError.INVALID_CHAR };
  if (postal.length !== 5) return { ok: false, error: PostalError.WRONG_LENGTH };

  // Optionally, you could block "00000" if you want.
  return { ok: true, value: postal };
}

/**
 * Full "postal line" normalizer: "<postal> <city>"
 * - Display: "NNN NN City"
 * Accepts loose input like "SE-85230   sundsvall"
 */
export function tryNormalizePostalLine(raw: string | undefined): ITryResult<{ postalCode: string; city: string }> {
  if (!raw || collapseSpaces(raw) === '') {
    return { ok: false, error: PostalError.EMPTY_INPUT };
  }

  const cleaned = collapseSpaces(normalizeDigits(raw));

  // Split by first space after something that looks like a postal code
  // We’ll pull a 5-digit group out of the start, then treat the rest as city.
  const postalLineRegex = /^\s*(?:SE[-\s]?)?(\d{3}[\s-]?\d{2})\s+(.{1,100})$/;
  const m = postalLineRegex.exec(cleaned);
  if (!m) return { ok: false, error: PostalError.BAD_FORMAT };

  const postalRaw = m[1];
  const cityRaw = m[2];

  const postal = tryNormalizePostalCode(postalRaw);
  if (!postal.ok || !postal.value) return { ok: false, error: postal.error };

  // Validate city: basic Swedish letters + common separators
  const cityTrim = collapseSpaces(cityRaw);
  if (!/^[A-Za-zÅÄÖåäö'.\-\s]+$/.test(cityTrim)) {
    return { ok: false, error: PostalError.INVALID_CHAR };
  }

  const city = capitalizeCity(cityTrim);
  return { ok: true, value: { postalCode: postal.value, city } };
}

/** Convenience: returns display line "NNN NN City" or raw if invalid */
export function formatPostalLineDisplay(raw: string): string {
  const postalLine = tryNormalizePostalLine(raw);
  if (!postalLine.ok || !postalLine.value) return raw;
  return `${postalLine.value.postalCode.replace(/^(\d{3})(\d{2})$/, '$1 $2')} ${postalLine.value.city}`;
}
