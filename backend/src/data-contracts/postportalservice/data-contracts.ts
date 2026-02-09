/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Possible delivery methods */
export enum DeliveryMethod {
  DIGITAL_MAIL = "DIGITAL_MAIL",
  SNAIL_MAIL = "SNAIL_MAIL",
  DELIVERY_NOT_POSSIBLE = "DELIVERY_NOT_POSSIBLE",
}

/** Precheck request model */
export interface PrecheckRequest {
  /**
   * List of party ids to precheck
   * @minItems 1
   */
  partyIds: string[];
}

export interface Problem {
  /** @format uri */
  instance?: string;
  /** @format uri */
  type?: string;
  parameters?: Record<string, any>;
  status?: StatusType;
  title?: string;
  detail?: string;
}

export interface StatusType {
  /** @format int32 */
  statusCode?: number;
  reasonPhrase?: string;
}

export interface ConstraintViolationProblem {
  cause?: ThrowableProblem;
  stackTrace?: ConstraintViolationProblemStackTraceInner[];
  /** @format uri */
  type?: string;
  status?: StatusType;
  violations?: Violation[];
  title?: string;
  message?: string;
  /** @format uri */
  instance?: string;
  parameters?: Record<string, any>;
  detail?: string;
  suppressed?: ConstraintViolationProblemSuppressedInner[];
  localizedMessage?: string;
}

export interface ConstraintViolationProblemStackTraceInner {
  classLoaderName?: string;
  moduleName?: string;
  moduleVersion?: string;
  methodName?: string;
  fileName?: string;
  /** @format int32 */
  lineNumber?: number;
  className?: string;
  nativeMethod?: boolean;
}

export interface ConstraintViolationProblemSuppressedInner {
  stackTrace?: ConstraintViolationProblemStackTraceInner[];
  message?: string;
  localizedMessage?: string;
}

export interface ThrowableProblem {
  cause?: any;
  stackTrace?: ConstraintViolationProblemStackTraceInner[];
  message?: string;
  /** @format uri */
  instance?: string;
  /** @format uri */
  type?: string;
  parameters?: Record<string, any>;
  title?: string;
  detail?: string;
  status?: StatusType;
  suppressed?: ConstraintViolationProblemSuppressedInner[];
  localizedMessage?: string;
}

export interface Violation {
  field?: string;
  message?: string;
}

/** Per-recipient delivery capability */
export interface PrecheckRecipient {
  /** Personal identity number of the recipient */
  personalIdentityNumber?: string;
  /** Party ID of the recipient */
  partyId?: string;
  /** Delivery method for the recipient */
  deliveryMethod?: DeliveryMethod;
  /** Reason when delivery method isn't available or an upstream lookup failed */
  reason?: string;
}

/** Result of precheck for given recipients */
export interface PrecheckResponse {
  /** Per-recipient result */
  recipients?: PrecheckRecipient[];
}

/** Kivra eligibility request model */
export interface KivraEligibilityRequest {
  /**
   * List of party IDs to check for Kivra eligibility
   * @minItems 1
   */
  partyIds: string[];
}

/** Model used as response when validating csv format and duplicate entries */
export interface PrecheckCsvResponse {
  duplicateEntries?: Record<string, number>;
  /** @uniqueItems true */
  rejectedEntries?: string[];
}

/** SMS recipient model */
export interface SmsRecipient {
  /** PartyId is the unique identifier for the recipient */
  partyId?: string;
  /** Phone number of the recipient, used for SMS notifications */
  phoneNumber: string;
}

/** SMS request model */
export interface SmsRequest {
  /**
   * The message to be sent
   * @minLength 1
   */
  message: string;
  /** @minItems 1 */
  recipients: SmsRecipient[];
}

/** Digital registered letter request model */
export interface DigitalRegisteredLetterRequest {
  /**
   * The body of the letter in HTML format
   * @minLength 1
   */
  body: string;
  /** The content type of the body */
  contentType?: string;
  /** The party id of the recipient */
  partyId?: string;
  /**
   * The subject of the letter
   * @minLength 1
   */
  subject: string;
}

/** Address model */
export interface Address {
  /**
   * First name of the recipient
   * @minLength 1
   */
  firstName: string;
  /**
   * Last name of the recipient
   * @minLength 1
   */
  lastName: string;
  /**
   * Street address
   * @minLength 1
   */
  street: string;
  /** Apartment number */
  apartmentNumber?: string;
  /** Care of */
  careOf?: string;
  /**
   * Zip code
   * @minLength 1
   */
  zipCode: string;
  /**
   * City
   * @minLength 1
   */
  city: string;
  /**
   * Country
   * @minLength 1
   */
  country: string;
}

/** Letter request model */
export interface LetterRequest {
  /**
   * The subject of the letter
   * @minLength 1
   */
  subject: string;
  /** The body of the letter */
  body?: string;
  /** The content type of the body */
  contentType?: string;
  recipients?: Recipient[];
  addresses?: Address[];
}

/** Recipient model */
export interface Recipient {
  /** PartyId is the unique identifier for the recipient */
  partyId?: string;
  /** Delivery method for the recipient */
  deliveryMethod: RecipientDeliveryMethodEnum;
  /** Address details for the recipient, used for SNAIL_MAIL delivery method */
  address?: Address;
}

/** Letter CSV request model */
export interface LetterCsvRequest {
  /**
   * The subject of the letter
   * @minLength 1
   */
  subject: string;
  /**
   * The body of the letter
   * @minLength 1
   */
  body: string;
  /**
   * The content type of the body
   * @minLength 1
   */
  contentType: string;
}

/** Statistics model */
export interface Statistics {
  /** Entity id */
  id?: string;
  /** Entity name */
  name?: string;
  /**
   * Number of snail mail sent
   * @format int64
   */
  snailMail?: number;
  /**
   * Number of digital mail sent
   * @format int64
   */
  digitalMail?: number;
  /**
   * Number of text messages
   * @format int64
   */
  sms?: number;
  /**
   * Number of registered letters sent
   * @format int64
   */
  digitalRegisteredLetter?: number;
}

export interface Pageable {
  /**
   * @format int32
   * @min 0
   */
  page?: number;
  /**
   * @format int32
   * @min 1
   */
  size?: number;
  sort?: string[];
}

/** Message model */
export interface Message {
  /** Message ID */
  messageId?: string;
  /** The subject */
  subject?: string;
  /** Type of message */
  type?: string;
  /**
   * When the message was sent
   * @format date-time
   */
  sentAt?: string;
  /** Status for signing process. Only applicable for message type DIGITAL_REGISTERED_LETTER */
  signingStatus?: SigningStatus;
  /**
   * Total number of recipients to whom the message has been sent
   * @format int32
   */
  numberOfRecipients?: number;
}

/** Messages model */
export interface Messages {
  messages?: Message[];
  /** PagingMetaData model */
  _meta?: PagingMetaData;
}

/** PagingMetaData model */
export interface PagingMetaData {
  /**
   * Current page
   * @format int32
   * @example 5
   */
  page?: number;
  /**
   * Displayed objects per page
   * @format int32
   * @example 20
   */
  limit?: number;
  /**
   * Displayed objects on current page
   * @format int32
   * @example 13
   */
  count?: number;
  /**
   * Total amount of hits based on provided search parameters
   * @format int64
   * @example 98
   */
  totalRecords?: number;
  /**
   * Total amount of pages based on provided search parameters
   * @format int32
   * @example 23
   */
  totalPages?: number;
}

/** Signing status model */
export interface SigningStatus {
  /** Present state for the letter */
  letterState?: string;
  /** Present state for the signing process */
  signingProcessState?: string;
}

export interface AttachmentDetails {
  /** Attachment ID */
  attachmentId?: string;
  /** File name of the attachment */
  fileName?: string;
  /** MIME type of the attachment */
  contentType?: string;
}

/** Message details model */
export interface MessageDetails {
  /** Message subject */
  subject?: string;
  /** Message body */
  body?: string;
  /**
   * When the message was sent
   * @format date-time
   */
  sentAt?: string;
  /** Status for signing process. Only applicable for message type DIGITAL_REGISTERED_LETTER */
  signingStatus?: SigningStatus;
  attachments?: AttachmentDetails[];
  recipients?: RecipientDetails[];
}

export interface RecipientDetails {
  /** Name of the recipient */
  name?: string;
  /** The recipients party ID */
  partyId?: string;
  /** The recipients legal ID */
  legalId?: string;
  /** Mobile number */
  mobileNumber?: string;
  /** Street address */
  streetAddress?: string;
  /** Zip code */
  zipCode?: string;
  /** City */
  city?: string;
  /** Message type */
  messageType?: string;
  /** Status of the message to this recipient */
  status?: string;
}

export interface Device {
  /** Ip address used when the letter was signed */
  ipAddress?: string;
}

/** SigningInformation model */
export interface SigningInformation {
  /** Status of the signing order */
  status?: string;
  /**
   * Timestamp when the letter was signed by receiving party
   * @format date-time
   */
  signedAt?: string;
  /** The unique Kivra id for the signing order */
  contentKey?: string;
  /** Order reference in Kivra for the signing order */
  orderReference?: string;
  /** The signature made by the receiving party */
  signature?: string;
  /** Online certificate status protocol for the signing order */
  ocspResponse?: string;
  /** Information about the user that signed the letter */
  user?: User;
  /** Information about the device used when signing the letter */
  device?: Device;
  /** Step-up information for the signing order */
  stepUp?: StepUp;
}

export interface StepUp {
  /** Whether an MRTD check was performed before the order was completed */
  mrtd?: boolean;
}

export interface User {
  /** Personal identity number for the signing party */
  personalIdentityNumber?: string;
  /** Full name of the signing party */
  name?: string;
  /** First name of the signing party */
  givenName?: string;
  /** Last name of the signing party */
  surname?: string;
}

/** Delivery method for the recipient */
export enum RecipientDeliveryMethodEnum {
  DIGITAL_MAIL = "DIGITAL_MAIL",
  SNAIL_MAIL = "SNAIL_MAIL",
  DELIVERY_NOT_POSSIBLE = "DELIVERY_NOT_POSSIBLE",
}
