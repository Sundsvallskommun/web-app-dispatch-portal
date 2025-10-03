const digitalMessageTypes = new Set(['EMAIL', 'SMS', 'WEB_MESSAGE', 'DIGITAL_MAIL', 'DIGITAL_INVOICE', 'SLACK']);

export const isDigitalMessage = (messageType: string): boolean => digitalMessageTypes.has(messageType);
