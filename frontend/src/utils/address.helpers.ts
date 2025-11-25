// address.service.ts
// Handles both address lines (street + number) and city capitalization.

import { capitalizeWord, collapseSpaces, normalizeDigits } from './helpers';

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

/**
 * Parses "Street 24C" → Normalized
 */
export function tryNormalizeAddressLine(raw: string | undefined): IAddressTryResult {
  if (!raw || collapseSpaces(raw) === '') {
    return { ok: false, error: AddressError.EMPTY_INPUT };
  }

  const cleaned = collapseSpaces(normalizeDigits(raw));

  const addressRegex = /^(.{1,100})\s+(\d{1,4})([A-Za-zÅÄÖåäö])?$/;
  const parts = addressRegex.exec(cleaned);

  if (!parts) return { ok: false, error: AddressError.BAD_FORMAT };

  const street = collapseSpaces(parts[1]);
  const number = parts[2];
  const suffix = (parts[3] ?? '').toUpperCase();

  if (!/^\d{1,4}$/.test(number)) {
    return { ok: false, error: AddressError.BAD_HOUSENUMBER };
  }

  const normalized = `${capitalizeWord(street)} ${number}${suffix}`;
  return { ok: true, value: normalized };
}
