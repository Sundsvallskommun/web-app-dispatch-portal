//import {MyStatistics} from "@interfaces/my-statistics.interface";
import {useEffect, useState} from "react";
import { apiService } from "@services/api-service";
import { Message, Messages } from "@interfaces/statistics.interface";

export interface AttachmentResponse {
  data: ArrayBuffer;
  error?: never;
}

export interface AttachmentError {
  data?: never;
  error: number | 'UNKNOWN ERROR';
}

export const useMyStatistics = (): { messages: Message[]; loaded: boolean } => {

  const [messages, setMessages] = useState<Message[]>([]);
  //const [meta, setMeta] = useState<any>({});
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    apiService.get<Messages>(`my-statistics`).then((res) => {
      const messages = res?.data?.messages;
      // const _meta = res?.data?.data?._meta;

      if(messages) {
        setMessages(messages);
        // setMeta(_meta);
      }
      setLoaded(true);
    })
  }, []);

  return { messages, loaded };
}

export const useMessage = (messageId: string): { message: Message; loaded: boolean } => {

  const [message, setMessage] = useState<Message>({
    subject: '',
    issuer: '',
    sent: '',
    messageId: '',
    recipients: [],
    attachments: [],
  });
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!messageId) {
      setLoaded(true);
      return;
    }
    apiService.get<Message>(`my-statistics/${messageId}`).then((res) => {
      const message = res?.data

      if(message) {
        setMessage(message);
      }
      setLoaded(true);
    })
  }, [messageId]);

  return { message, loaded };
}

export const getAttachmentFile: (messageId: string, fileName: string) => Promise<AttachmentResponse | AttachmentError> = (messageId, fileName) =>
  apiService
    .get<ArrayBuffer>(`/my-statistics/attachment/${messageId}/${fileName}`, { responseType: 'arraybuffer'})
    .then((res) => res)
    .catch(
      (e) => ({ error: e.response?.status ?? 'UNKNOWN ERROR' })
    );
