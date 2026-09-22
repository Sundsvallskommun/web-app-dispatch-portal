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
  title?: string;
  detail?: string;
  /** @format int32 */
  status?: number;
}

export interface ConstraintViolationProblem {
  cause?: ThrowableProblem;
  stackTrace?: ConstraintViolationProblemStackTraceInner[];
  /** @format uri */
  type?: string | null;
  status?: StatusType;
  violations?: Violation[];
  title?: string | null;
  message?: string | null;
  /** @format uri */
  instance?: string | null;
  parameters?: Record<string, any>;
  detail?: string | null;
  suppressed?: ConstraintViolationProblemSuppressedInner[];
  localizedMessage?: string | null;
}

export interface ConstraintViolationProblemStackTraceInner {
  classLoaderName?: string | null;
  moduleName?: string | null;
  moduleVersion?: string | null;
  methodName?: string | null;
  fileName?: string | null;
  /** @format int32 */
  lineNumber?: number | null;
  className?: string | null;
  nativeMethod?: boolean | null;
}

export interface ConstraintViolationProblemSuppressedInner {
  stackTrace?: ConstraintViolationProblemStackTraceInner[];
  message?: string | null;
  localizedMessage?: string | null;
}

export interface StatusType {
  /** @format int32 */
  statusCode?: number | null;
  reasonPhrase?: string | null;
}

export interface ThrowableProblem {
  cause?: null;
  stackTrace?: ConstraintViolationProblemStackTraceInner[];
  message?: string | null;
  /** @format uri */
  instance?: string | null;
  /** @format uri */
  type?: string | null;
  parameters?: Record<string, any>;
  title?: string | null;
  detail?: string | null;
  status?: StatusType;
  suppressed?: ConstraintViolationProblemSuppressedInner[];
  localizedMessage?: string | null;
}

export interface Violation {
  field?: string | null;
  message?: string | null;
}

/** Per-recipient delivery capability */
export interface PrecheckRecipient {
  /** Personal identity number of the recipient */
  personalIdentityNumber?: string;
  /** Party ID of the recipient */
  partyId?: string;
  /** Delivery method for the recipient */
  deliveryMethod?: PrecheckRecipientDeliveryMethodEnum;
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

/** SMS CSV request model */
export interface SmsCsvRequest {
  /**
   * The message to be sent
   * @minLength 1
   */
  message: string;
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
  /** First name of the recipient. Required together with lastName if organizationName is not provided. */
  firstName?: string;
  /** Last name of the recipient. Required together with firstName if organizationName is not provided. */
  lastName?: string;
  /** Organization name of the recipient. Required if firstName and lastName are not provided. */
  organizationName?: string;
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
  /** Country. Optional; typically omitted for domestic mail. */
  country?: string;
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

/** E-signing request model */
export interface ESigningRequest {
  /**
   * The subject of the notification sent to the signatories
   * @minLength 1
   */
  subject: string;
  /** The body of the notification sent to the signatories */
  body?: string;
  /** The language used for the signing instance. Swedish is used if not provided */
  language?: string;
  /**
   * Optional date and time when the signing request expires
   * @format date-time
   */
  expires?: string;
  /** @minItems 1 */
  signatories: ESigningSignatory[];
}

/** A signatory that should sign the document */
export interface ESigningSignatory {
  /** The party id of the signatory */
  partyId?: string;
  /**
   * The name of the signatory
   * @minLength 1
   */
  name: string;
  /**
   * The email address of the signatory
   * @format email
   * @minLength 1
   */
  email: string;
}

/** The signatory that acted in a signing event */
export interface EventSignatory {
  /** The party id of the signatory */
  partyId?: string;
  /** The normalized action taken by the signatory */
  action?: EventSignatoryActionEnum;
  /** The reason given for the action, when provided */
  reason?: string;
}

/** A signed document received in a signing event */
export interface SignedDocument {
  /** Descriptive name of the document */
  name?: string;
  /** The document file name including extension */
  fileName?: string;
  /** The document mime type */
  mimeType?: string;
  /**
   * Base64-encoded content of the signed document
   * @minLength 1
   */
  content: string;
}

/** A provider-neutral signing event delivered by api-service-e-signing */
export interface SigningEvent {
  /** The consumer's own reference echoed back by the provider (the Postportalen message id) */
  customerReference?: string;
  /**
   * The signing provider's case id
   * @minLength 1
   */
  providerCaseId: string;
  /** The id of the signing provider that produced the event */
  provider?: string;
  /** The normalized event type */
  eventType?: SigningEventEventTypeEnum;
  /** The normalized case status */
  status?: SigningEventStatusEnum;
  /** The acting signatory, present on signatory events */
  signatory?: EventSignatory;
  /** The signed document, present only on a completed event */
  signedDocument?: SignedDocument;
  /**
   * When the event occurred at the provider
   * @format date-time
   */
  occurredAt?: string;
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
   */
  page?: number;
  /**
   * Displayed objects per page
   * @format int32
   */
  limit?: number;
  /**
   * Displayed objects on current page
   * @format int32
   */
  count?: number;
  /**
   * Total amount of hits based on provided search parameters
   * @format int64
   */
  totalRecords?: number;
  /**
   * Total amount of pages based on provided search parameters
   * @format int32
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
export enum PrecheckRecipientDeliveryMethodEnum {
  DIGITAL_MAIL = "DIGITAL_MAIL",
  SNAIL_MAIL = "SNAIL_MAIL",
  DELIVERY_NOT_POSSIBLE = "DELIVERY_NOT_POSSIBLE",
}

/** Delivery method for the recipient */
export enum RecipientDeliveryMethodEnum {
  DIGITAL_MAIL = "DIGITAL_MAIL",
  SNAIL_MAIL = "SNAIL_MAIL",
  DELIVERY_NOT_POSSIBLE = "DELIVERY_NOT_POSSIBLE",
}

/** The normalized action taken by the signatory */
export enum EventSignatoryActionEnum {
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
}

/** The normalized event type */
export enum SigningEventEventTypeEnum {
  CASE_CREATED = "CASE_CREATED",
  SIGNATORY_APPROVED = "SIGNATORY_APPROVED",
  SIGNATORY_DECLINED = "SIGNATORY_DECLINED",
  CASE_COMPLETED = "CASE_COMPLETED",
  CASE_WITHDRAWN = "CASE_WITHDRAWN",
  CASE_EXPIRED = "CASE_EXPIRED",
  CASE_HALTED = "CASE_HALTED",
  CASE_REACTIVATED = "CASE_REACTIVATED",
}

/** The normalized case status */
export enum SigningEventStatusEnum {
  INITIATED = "INITIATED",
  PENDING = "PENDING",
  SIGNED = "SIGNED",
  EXPIRED = "EXPIRED",
  FAILED = "FAILED",
}
