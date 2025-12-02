export const formatPersonNumber = (ssn: string) => {
  const ssnString = ssn.toString();
  return /\d/g.test(ssnString.toString()) && (ssnString.length === 10 || ssnString.length === 12)
    ? `${ssnString.slice(0, ssnString.length - 4)}-${ssnString.slice(ssnString.length - 4)}`
    : ssnString;
};

export const createDeliveryMethodMap = (snailMail: string, digitalMail: string): Record<string, string> => {
  return {
    SNAIL_MAIL: snailMail,
    DIGITAL_MAIL: digitalMail,
  };
};

export const getMonthFirstDayDate = (year: number, month: number) => {
  return `${year}-${String(month).padStart(2, '0')}-01`;
};
export const getMonthLastDayDate = (year: number, month: number) => {
  return `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;
};
