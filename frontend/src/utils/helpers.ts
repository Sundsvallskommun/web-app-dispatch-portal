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

export const formatPersonNumber = (ssn: string) => {
  return /\d/g.test(ssn) && (ssn.length === 10 || ssn.length === 12)
    ? `${ssn.slice(0, ssn.length - 4)}-${ssn.slice(ssn.length - 4)}`
    : ssn;
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
  return text.replaceAll(/[\s\u00A0]+/g, ' ').trim();
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
