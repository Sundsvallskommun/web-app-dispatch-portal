export interface SMSStatus {
  batchId: string;
  messages: {
    messageId: string;
    deliveries: {
      deliveryId: string;
      messageType: string;
    }[];
  }[];
}

export interface SMSRequest {
  message: string;
  recipients: string[];
}
