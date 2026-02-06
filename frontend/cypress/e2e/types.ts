export type Pages = {
  route: '/send/mail' | '/send/rek-mail' | '/send/sms' | '/my-statistics' | '/statistics';
  description: string;
};

export type SendTypes = {
  text: 'Rekommenderat brev' | 'Brev' | 'Sms';
  uri: '/mail' | '/rek-mail' | 'sms';
  iconClass: string;
};
