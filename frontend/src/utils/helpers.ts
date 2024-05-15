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
