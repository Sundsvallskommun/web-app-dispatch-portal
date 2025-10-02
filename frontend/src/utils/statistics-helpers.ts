export const isDigitalMessage = (messageType: string) => {
  switch (messageType) {
    case 'EMAIL':
      return true;
    case 'SMS':
      return true;
    case 'WEB_MESSAGE':
      return true;
    case 'DIGITAL_MAIL':
      return true;
    case 'DIGITAL_INVOICE':
      return true;
    case 'SLACK':
      return true;
    default:
      return false;
  }
};
