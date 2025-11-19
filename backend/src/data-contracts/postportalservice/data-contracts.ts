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
   * @example ["b46f0ca2-d2ad-43e8-8d50-3aeb949e3604","fd99a03c-790c-4b87-bc4b-f4f73e4a2df4"]
   */
  partyIds: string[];
}

export interface Problem {
  title?: string;
  detail?: string;
  /** @format uri */
  instance?: string;
  /** @format uri */
  type?: string;
  parameters?: Record<string, object>;
  status?: StatusType;
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
  parameters?: Record<string, object>;
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
  cause?: ThrowableProblem;
  stackTrace?: ConstraintViolationProblemStackTraceInner[];
  message?: string;
  /** @format uri */
  instance?: string;
  /** @format uri */
  type?: string;
  parameters?: Record<string, object>;
  status?: StatusType;
  detail?: string;
  title?: string;
  suppressed?: ConstraintViolationProblemSuppressedInner[];
  localizedMessage?: string;
}

export interface Violation {
  field?: string;
  message?: string;
}

/** Per-recipient delivery capability */
export interface PrecheckRecipient {
  /**
   * Personal identity number of the recipient
   * @example "19111111-1111"
   */
  personalIdentityNumber?: string;
  /**
   * Party ID of the recipient
   * @example "da03b33e-9de2-45ac-8291-31a88de59410"
   */
  partyId?: string;
  /** Possible delivery methods */
  deliveryMethod?: DeliveryMethod;
  /**
   * Reason when delivery method isn't available or an upstream lookup failed
   * @example "Person not found"
   */
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
   * @example ["da03b33e-9de2-45ac-8291-31a88de59410","eb13b33e-9de2-45ac-8291-31a88de59411"]
   */
  partyIds: string[];
}

/** SMS recipient model */
export interface SmsRecipient {
  /**
   * PartyId is the unique identifier for the recipient
   * @example "6d0773d6-3e7f-4552-81bc-f0007af95adf"
   */
  partyId?: string;
  /**
   * Phone number of the recipient, used for SMS notifications
   * @example "+46701234567"
   */
  phoneNumber: string;
}

/** SMS request model */
export interface SmsRequest {
  /**
   * The message to be sent
   * @minLength 1
   * @example "This is the message to be sent"
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
   * @example "<h1>This is the body of the letter</h1>"
   */
  body: string;
  /**
   * The content type of the body
   * @example "text/html"
   */
  contentType?: string;
  /**
   * The party id of the recipient
   * @example "6d0773d6-3e7f-4552-81bc-f0007af95adf"
   */
  partyId?: string;
  /**
   * The subject of the letter
   * @minLength 1
   * @example "This is the subject of the letter"
   */
  subject: string;
}

/** Address model */
export interface Address {
  /**
   * First name of the recipient
   * @minLength 1
   * @example "John"
   */
  firstName: string;
  /**
   * Last name of the recipient
   * @minLength 1
   * @example "Doe"
   */
  lastName: string;
  /**
   * Street address
   * @minLength 1
   * @example "Main Street 1"
   */
  street: string;
  /**
   * Apartment number
   * @example "1101"
   */
  apartmentNumber?: string;
  /**
   * Care of
   * @example "c/o Jane Doe"
   */
  careOf?: string;
  /**
   * Zip code
   * @minLength 1
   * @example "12345"
   */
  zipCode: string;
  /**
   * City
   * @minLength 1
   * @example "Sundsvall"
   */
  city: string;
  /**
   * Country
   * @minLength 1
   * @example "Sweden"
   */
  country: string;
}

/** Letter request model */
export interface LetterRequest {
  /**
   * The subject of the letter
   * @minLength 1
   * @example "This is the subject of the letter"
   */
  subject: string;
  /**
   * The body of the letter
   * @minLength 1
   * @example "This is the body of the letter"
   */
  body: string;
  /**
   * The content type of the body
   * @minLength 1
   * @example "text/plain"
   */
  contentType: string;
  recipients?: Recipient[];
  addresses?: Address[];
}

/** Recipient model */
export interface Recipient {
  /**
   * PartyId is the unique identifier for the recipient
   * @example "6d0773d6-3e7f-4552-81bc-f0007af95adf"
   */
  partyId?: string;
  /**
   * Delivery method for the recipient
   * @example "DIGITAL_MAIL"
   */
  deliveryMethod: RecipientDeliveryMethodEnum;
  /** Address model */
  address?: Address;
}

/** Letter CSV request model */
export interface LetterCsvRequest {
  /**
   * The subject of the letter
   * @minLength 1
   * @example "This is the subject of the letter"
   */
  subject: string;
  /**
   * The body of the letter
   * @minLength 1
   * @example "This is the body of the letter"
   */
  body: string;
  /**
   * The content type of the body
   * @minLength 1
   * @example "text/plain"
   */
  contentType: string;
}

/** Statistics model */
export interface Statistics {
  /**
   * Entity id
   * @example "f40e6975-a82a-4167-8622-4b0e71ab8d92"
   */
  id?: string;
  /**
   * Entity name
   * @example "Test Department"
   */
  name?: string;
  /**
   * Number of snail mail sent
   * @format int64
   * @example 50
   */
  snailMail?: number;
  /**
   * Number of digital mail sent
   * @format int64
   * @example 30
   */
  digitalMail?: number;
  /**
   * Number of text messages
   * @format int64
   * @example 20
   */
  sms?: number;
  /**
   * Number of registered letters sent
   * @format int64
   * @example 5
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
  /**
   * Message ID
   * @example "123456"
   */
  messageId?: string;
  /**
   * The subject
   * @example "Viktig information"
   */
  subject?: string;
  /**
   * Type of message
   * @example "SMS|LETTER|DIGITAL_REGISTERED_LETTER"
   */
  type?: string;
  /**
   * When the message was sent
   * @format date-time
   */
  sentAt?: string;
  /** Signing status model */
  signingStatus?: SigningStatus;
  /**
   * Total number of recipients to whom the message has been sent
   * @format int32
   * @example 12
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
  /**
   * Present state for the letter
   * @example "NEW|SENT|SIGNED|EXPIRED|FAILED - Client Error|FAILED - Server Error|FAILED - Unknown Error"
   */
  letterState?: string;
  /**
   * Present state for the signing process
   * @example "PENDING|COMPLETED|FAILED"
   */
  signingProcessState?: string;
}

/** List of attachment details */
export interface AttachmentDetails {
  /**
   * Attachment ID
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  attachmentId?: string;
  /**
   * File name of the attachment
   * @example "document.pdf"
   */
  fileName?: string;
  /**
   * MIME type of the attachment
   * @example "application/pdf"
   */
  contentType?: string;
}

/** Message details model */
export interface MessageDetails {
  /**
   * Message subject
   * @example "This is a subject"
   */
  subject?: string;
  /**
   * Message body
   * @example "This is the message body"
   */
  body?: string;
  /**
   * When the message was sent
   * @format date-time
   */
  sentAt?: string;
  /** Signing status model */
  signingStatus?: SigningStatus;
  attachments?: AttachmentDetails[];
  recipients?: RecipientDetails[];
}

/** List of recipient details */
export interface RecipientDetails {
  /**
   * Name of the recipient
   * @example "John Doe"
   */
  name?: string;
  /**
   * The recipients party ID
   * @example "1234567890"
   */
  partyId?: string;
  /**
   * Mobile number
   * @example "+46701234567"
   */
  mobileNumber?: string;
  /**
   * Street address
   * @example "Main Street 5"
   */
  streetAddress?: string;
  /**
   * Zip code
   * @example "85751"
   */
  zipCode?: string;
  /**
   * City
   * @example "Sundsvall"
   */
  city?: string;
  /**
   * Message type
   * @example "SNAIL_MAIL|DIGITAL_MAIL|SMS"
   */
  messageType?: string;
  /**
   * Status of the message to this recipient
   * @example "SENT|NOT_SENT|FAILED"
   */
  status?: string;
}

/** Information about the device used when signing the letter */
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

/** Step-up information for the signing order */
export interface StepUp {
  /** Whether an MRTD check was performed before the order was completed */
  mrtd?: boolean;
}

/** Information about the user that signed the letter */
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

/**
 * Delivery method for the recipient
 * @example "DIGITAL_MAIL"
 */
export enum RecipientDeliveryMethodEnum {
  DIGITAL_MAIL = "DIGITAL_MAIL",
  SNAIL_MAIL = "SNAIL_MAIL",
  DELIVERY_NOT_POSSIBLE = "DELIVERY_NOT_POSSIBLE",
}
