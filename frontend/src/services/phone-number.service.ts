// phoneNumber.service.ts
// Utilities for Swedish SMS-capable mobile numbers.
// Canonical storage format: +467XXXXXXXX (e.g. +46762358914)

export enum MobileNumberError {
  EMPTY_INPUT = 'EMPTY_INPUT',
  INVALID_CHAR = 'INVALID_CHAR',
  PLUS_MISPLACED = 'PLUS_MISPLACED',
  NO_DIGITS = 'NO_DIGITS',
  WRONG_FORMAT = 'WRONG_FORMAT',
  NORMALIZE_FAIL = 'NORMALIZE_FAIL',
}

export interface ITryResult {
  ok: boolean;
  value?: string; // string (digits or +digits)
  error?: MobileNumberError; // enum error code if not ok
}

// ── Private config ─────────────────────────────────────────────────────────────

// Accept common human separators: spaces, dots, parentheses, ASCII & Unicode dashes
const TRIVIAL_CHARS_REGEX = /[.\s()\-\u00A0\u2010-\u2015]/g;
// For quick illegal check: anything outside digits, '+', and trivial separators
const ILLEGAL_CHARS_REGEX = /[^0-9+\s().\-\u00A0\u2010-\u2015]/;

// ── Private helpers ────────────────────────────────────────────────────────────

// Convert Arabic-Indic (٠–٩) and Eastern Arabic-Indic (۰–۹) numerals to ASCII
function normalizeDigits(input: string): string {
  if (!input) return input;
  let out = '';
  for (const ch of input) {
    const code = ch.charCodeAt(0);
    if (code >= 0x0660 && code <= 0x0669) {
      out += String.fromCharCode(48 + (code - 0x0660));
      continue;
    }
    if (code >= 0x06f0 && code <= 0x06f9) {
      out += String.fromCharCode(48 + (code - 0x06f0));
      continue;
    }
    out += ch;
  }
  return out;
}

// Validate a *sanitized* Swedish mobile input (pre-normalization)
function isValidMobileSanitized(s: string): boolean {
  // Accept: 07[2-9]xxxxxxx | +467[2-9]xxxxxxx | 00467[2-9]xxxxxxx | 7[2-9]xxxxxxxx
  return /^(?:07[2-9]\d{7}|\+467[2-9]\d{7}|00467[2-9]\d{7}|7[2-9]\d{8})$/.test(s);
}

// Normalize a *sanitized* Swedish mobile to +467XXXXXXXX
function normalizeMobileOrEmpty(s: string): string {
  if (/^\+467[2-9]\d{7}$/.test(s)) return s;
  if (/^00467[2-9]\d{7}$/.test(s)) return s.replace(/^0046/, '+46');
  if (/^07[2-9]\d{7}$/.test(s)) return s.replace(/^0/, '+46');
  if (/^7[2-9]\d{8}$/.test(s)) return `+46${s}`;
  return '';
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Try to sanitize raw input:
 * - Keeps only digits and a single leading '+'
 * - Removes trivial separators (spaces, dots, parentheses, dashes)
 * - Returns enum error codes instead of throwing
 */
export function trySanitizeMobileNumber(raw: string | undefined): ITryResult {
  if (!raw || raw.trim() === '') {
    return { ok: false, error: MobileNumberError.EMPTY_INPUT };
  }

  const trimmed = normalizeDigits(raw).trim();

  if (ILLEGAL_CHARS_REGEX.test(trimmed)) {
    return { ok: false, error: MobileNumberError.INVALID_CHAR };
  }

  // '+' must be at most once and only at position 0
  const plusFirst = trimmed.indexOf('+');
  if (plusFirst > 0 || (plusFirst === 0 && trimmed.slice(1).includes('+'))) {
    return { ok: false, error: MobileNumberError.PLUS_MISPLACED };
  }

  let cleaned: string;
  if (plusFirst === 0) {
    const rest = trimmed.slice(1).replace(TRIVIAL_CHARS_REGEX, '').replace(/\D/g, '');
    cleaned = rest ? `+${rest}` : '';
  } else {
    cleaned = trimmed.replace(TRIVIAL_CHARS_REGEX, '').replace(/\D/g, '');
  }

  if (!cleaned) {
    return { ok: false, error: MobileNumberError.NO_DIGITS };
  }

  return { ok: true, value: cleaned };
}

/**
 * Convenience validator for *raw* input (sanitize → validate).
 */
export function isValidMobile(raw: string): boolean {
  const s = trySanitizeMobileNumber(raw);
  return !!(s.ok && s.value && isValidMobileSanitized(s.value));
}

/**
 * Full pipeline for *raw* input:
 * sanitize → validate → normalize to canonical +467XXXXXXXX
 */
export function tryNormalizeMobileNumber(raw: string | undefined): ITryResult {
  const s = trySanitizeMobileNumber(raw);
  if (!s.ok || !s.value) {
    return { ok: false, error: s.error ?? MobileNumberError.INVALID_CHAR };
  }

  if (!isValidMobileSanitized(s.value)) {
    return { ok: false, error: MobileNumberError.WRONG_FORMAT };
  }

  const normalized = normalizeMobileOrEmpty(s.value);
  if (!normalized) {
    return { ok: false, error: MobileNumberError.NORMALIZE_FAIL };
  }

  return { ok: true, value: normalized };
}

/**
 * Pretty printer for UI:
 * - If valid Swedish mobile, formats as: "+46 7x-xxx xx xx"
 * - Otherwise returns the original input unchanged
 */
export function formatMobileNumberDisplay(raw: string): string {
  const r = tryNormalizeMobileNumber(raw);
  if (!r.ok || !r.value) return raw;

  const digits = r.value.replace(/\D/g, ''); // "46762358914"
  if (!digits.startsWith('46')) return r.value;

  const rest = digits.slice(2); // "762358914"
  const pretty = rest.replace(/^(\d{2})(\d{3})(\d{2})(\d{2})$/, '+46 $1-$2 $3 $4');
  return pretty || r.value;
}
