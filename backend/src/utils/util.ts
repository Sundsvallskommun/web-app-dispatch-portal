import { API_BASE_URL, BASE_URL_PREFIX } from '@config';
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const localApi = (...parts: string[]): string => {
  const urlParts = [BASE_URL_PREFIX, ...parts];
  return urlParts.map(pathPart => pathPart.replace(/(\/$)/g, '')).join('/');
};

export const apiURL = (...parts: string[]): string => {
  const urlParts = [API_BASE_URL, ...parts];
  return urlParts.map(pathPart => pathPart.replace(/(^\/|\/$)/g, '')).join('/');
};

export const luhnCheck = (str = ''): boolean => {
  str = str.length === 12 ? str.slice(2) : str;
  let sum = 0;
  for (let i = 0, l = str.length; i < l; i++) {
    let v = parseInt(str[i]);
    v *= 2 - (i % 2);
    if (v > 9) {
      v -= 9;
    }
    sum += v;
  }
  return sum % 10 === 0;
};

export enum OrgNumberFormat {
  DASH,
}

export const formatOrgNr = (orgNr: string, format: OrgNumberFormat = OrgNumberFormat.DASH): string | undefined => {
  const orgNumber = orgNr.replace(/\D/g, '');
  if (orgNumber.length !== 10 || !luhnCheck(orgNumber)) {
    return; // NOTE: incorrect org number
  }
  return format === OrgNumberFormat.DASH ? orgNumber.substring(0, 6) + '-' + orgNumber.substring(6, 10) : orgNumber;
};

export const isPersonNumber = (input: string): boolean => {
  const regex = /^(?:\d{8}-?\d{4}|\d{12})$/;
  return regex.test(input);
};

export const dataPath = (path?: string): string => {
  const fullpath = path ? `/${path}` : '';
  return '/files' + fullpath;
};

export const dataDir = (path: string): string => {
  return __dirname + '/../../data/' + path;
};

// Convert Arabic-Indic (٠–٩) and Eastern Arabic-Indic (۰–۹) numerals to ASCII
export function normalizeDigits(input: string): string {
  if (!input) return input;
  let out = '';
  for (const charcter of input) {
    const code = charcter.codePointAt(0);
    if (code === undefined) continue;
    if (code >= 0x0660 && code <= 0x0669) {
      out += String.fromCodePoint(48 + (code - 0x0660));
      continue;
    }
    if (code >= 0x06f0 && code <= 0x06f9) {
      out += String.fromCodePoint(48 + (code - 0x06f0));
      continue;
    }
    out += charcter;
  }
  return out;
}

export function collapseSpaces(text: string): string {
  return text.replace(/[\s\u00A0]+/g, ' ').trim();
}

export function capitalizeWord(word: string): string {
  const lower = word.toLocaleLowerCase('sv-SE');
  return lower ? lower[0].toLocaleUpperCase('sv-SE') + lower.slice(1) : lower;
}

export const createDeliveryMethodMap = (snailMail: string, digitalMail: string): Record<string, string> => {
  return {
    SNAIL_MAIL: snailMail,
    DIGITAL_MAIL: digitalMail,
  };
};
