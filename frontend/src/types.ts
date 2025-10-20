import { formSendType } from './constants';

export type SendType = (typeof formSendType)[keyof typeof formSendType];
