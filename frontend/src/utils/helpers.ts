export const formatPersonNumber = (personnumber: string | number) => {
  const str = personnumber.toString();
  const isValid = /\d/g.test(str) && (str.length === 10 || str.length === 12);
  if (!isValid) return str;
  return `${str.slice(0, -4)}-${str.slice(-4)}`;
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
