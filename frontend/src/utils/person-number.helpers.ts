// Utilities for Swedish personnummer (and samordningsnummer*).
// Canonical storage format: YYYYMMDDXXXX (12 digits, no separator)
// Canonical display format: YYYYMMDD-XXXX
// *Samordningsnummer uses day+60; validation supports this by default.

export enum PersonnummerError {
  EMPTY_INPUT = 'EMPTY_INPUT',
  INVALID_CHAR = 'INVALID_CHAR',
  NO_DIGITS = 'NO_DIGITS',
  WRONG_LENGTH = 'WRONG_LENGTH',
  BAD_DATE = 'BAD_DATE',
  BAD_CHECKSUM = 'BAD_CHECKSUM',
  NORMALIZE_FAIL = 'NORMALIZE_FAIL',
}

export interface ITryResult {
  ok: boolean;
  value?: string;
  error?: PersonnummerError;
}

// ── Private config ─────────────────────────────────────────────────────────────

// Accept common separators: spaces, dots, parentheses, dash/–— and the '+' century separator.
const TRIVIAL_CHARS_REGEX = /[.\s()\-\+\u00A0\u2010-\u2015]/g;
// Reject anything outside digits and trivial separators (so letters, punctuation, etc.)
const ILLEGAL_CHARS_REGEX = /[^0-9.\s()\-\+\u00A0\u2010-\u2015]/;

// Arabic-Indic digits → ASCII (same as your mobile utils)
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

// Luhn on YYMMDDNNN + check digit (10-digit form)
function luhn10Check(tenDigits: string): boolean {
  if (!/^\d{10}$/.test(tenDigits)) return false;
  const digits = tenDigits.split('').map(Number);
  const checksum = digits[9];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let val = digits[i] * (i % 2 === 0 ? 2 : 1);
    if (val > 9) val -= 9;
    sum += val;
  }
  const calc = (10 - (sum % 10)) % 10;
  return calc === checksum;
}

// Date validation with optional samordningsnummer support (day may be +60)
function isValidDateYMD(year: number, month: number, day: number, supportSamordning = true): boolean {
  if (supportSamordning && day > 60) day -= 60;
  if (month < 1 || month > 12) return false;
  const maxDay = new Date(year, month, 0).getDate(); // JS: month is 1–12, day 0 = last of prev month
  return day >= 1 && day <= maxDay;
}

// Infer century for YY based on separator and a reference date.
// '-' or none → choose century that yields age 0–99 relative to refDate.
// '+' → 100+ years old, i.e., subtract 100 years from '-' case.
function inferCentury(yy: number, sep: '-' | '+' | '', refDate = new Date()): number {
  const refYY = refDate.getFullYear() % 100;
  let base = yy <= refYY ? 2000 : 1900;
  if (sep === '+') base -= 100;
  return base;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Sanitize raw input → only digits remain (strip separators and whitespace).
 * Returns 10 or 12 digits if present, error otherwise.
 */
export function trySanitizePersonnummer(raw: string | undefined): ITryResult {
  if (!raw || raw.trim() === '') return { ok: false, error: PersonnummerError.EMPTY_INPUT };

  const trimmed = normalizeDigits(raw).trim();
  if (ILLEGAL_CHARS_REGEX.test(trimmed)) {
    return { ok: false, error: PersonnummerError.INVALID_CHAR };
  }

  // Keep a note whether '+' appeared, to help century inference later if only 10 digits provided.
  const hadPlus = /[+]/.test(trimmed);

  // Remove all trivial separators (including '+' and '-')
  const digitsOnly = trimmed.replaceAll(TRIVIAL_CHARS_REGEX, '');

  if (!digitsOnly) return { ok: false, error: PersonnummerError.NO_DIGITS };
  if (!/^\d{10}$|^\d{12}$/.test(digitsOnly)) return { ok: false, error: PersonnummerError.WRONG_LENGTH };

  // Encode '+' presence by prefixing a marker we can read later (without exposing outside).
  // We won't persist this marker—only used in normalize.
  const value = (hadPlus ? 'P' : '') + digitsOnly;

  return { ok: true, value };
}

/**
 * Validate a sanitized (via trySanitizePersonnummer) value and normalize to 12 digits.
 * Saves as: YYYYMMDDXXXX
 */
export function tryNormalizePersonnummer(
  raw: string | undefined,
  opts?: { supportSamordning?: boolean; refDate?: Date }
): ITryResult {
  const san = trySanitizePersonnummer(raw);
  if (!san.ok || !san.value) return { ok: false, error: san.error ?? PersonnummerError.INVALID_CHAR };

  const supportSamordning = opts?.supportSamordning ?? true;
  const refDate = opts?.refDate;

  const hadPlus = san.value.startsWith('P');
  const digits = hadPlus ? san.value.slice(1) : san.value;

  let twelve = '';
  if (digits.length === 12) {
    twelve = digits;
  } else {
    // 10 digits → need century inference
    // The 10-digit form is YYMMDDXXXX (with XXXX including the check digit).
    const yy = Number(digits.slice(0, 2));
    const century = inferCentury(yy, hadPlus ? '+' : '-', refDate);
    twelve = `${century + yy}${digits}`;
  }

  // YYYY MM DD XXXX
  const yyyy = Number(twelve.slice(0, 4));
  const mm = Number(twelve.slice(4, 6));
  const dd = Number(twelve.slice(6, 8));

  // Validate date (supports samordningsnummer day+60 if enabled)
  if (!isValidDateYMD(yyyy, mm, dd, supportSamordning)) {
    return { ok: false, error: PersonnummerError.BAD_DATE };
  }

  // Luhn on 10-digit form (YYMMDDNNNC)
  const ten = twelve.slice(2); // drop century
  if (!luhn10Check(ten)) {
    return { ok: false, error: PersonnummerError.BAD_CHECKSUM };
  }

  // Normalize result: 12 digits (storage)
  if (!/^\d{12}$/.test(twelve)) return { ok: false, error: PersonnummerError.NORMALIZE_FAIL };
  return { ok: true, value: twelve };
}

/**
 * Quick validator for raw input.
 */
export function isValidPersonnummer(raw: string, opts?: { supportSamordning?: boolean; refDate?: Date }): boolean {
  const r = tryNormalizePersonnummer(raw, opts);
  return !!(r.ok && r.value);
}

/**
 * Pretty printer for UI:
 * - Always "YYYYMMDD-XXXX" if valid.
 * - Otherwise returns raw unchanged.
 */
export function formatPersonnummerDisplay(raw: string, opts?: { supportSamordning?: boolean; refDate?: Date }): string {
  const r = tryNormalizePersonnummer(raw, opts);
  if (!r.ok || !r.value) return raw;
  const yyyyMMdd = r.value.slice(0, 8);
  const xxxx = r.value.slice(8);
  return `${yyyyMMdd}-${xxxx}`;
}

/**
 * Storage helper:
 * - Returns the canonical 12-digit string or undefined if invalid.
 */
export function toPersonnummerStorage(
  raw: string,
  opts?: { supportSamordning?: boolean; refDate?: Date }
): string | undefined {
  const r = tryNormalizePersonnummer(raw, opts);
  return r.ok ? r.value : undefined;
}
