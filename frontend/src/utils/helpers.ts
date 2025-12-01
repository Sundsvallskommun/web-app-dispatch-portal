export const formatPersonNumber = (ssn: string) => {
  return /\d/g.test(ssn) && (ssn.length === 10 || ssn.length === 12)
    ? `${ssn.slice(0, ssn.length - 4)}-${ssn.slice(ssn.length - 4)}`
    : ssn;
};

export const createDeliveryMethodMap = (snailMail: string, digitalMail: string): Record<string, string> => {
  return {
    SNAIL_MAIL: snailMail,
    DIGITAL_MAIL: digitalMail,
  };
};
