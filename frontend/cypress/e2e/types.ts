export type Pages = {
  route: '/send/mail' | '/send/rek-mail' | '/send/sms' | '/my-statistics' | '/statistics';
  description: string;
};

export type PersonNumber = {
  isEligible: '199011182475';
  isNotEligible: '192301010159';
};

export type SendTypes = {
  text: 'Rekommenderat brev' | 'Brev' | 'Sms';
  uri: '/mail' | '/rek-mail' | 'sms';
  iconClass: string;
};
