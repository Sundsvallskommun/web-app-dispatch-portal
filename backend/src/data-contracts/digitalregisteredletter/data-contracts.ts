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

export enum Direction {
  ASC = "ASC",
  DESC = "DESC",
}

/** Request model for checking the statuses of given letters */
export interface LetterStatusRequest {
  /** @minItems 1 */
  letterIds: string[];
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
  stackTrace?: {
    classLoaderName?: string;
    moduleName?: string;
    moduleVersion?: string;
    methodName?: string;
    fileName?: string;
    /** @format int32 */
    lineNumber?: number;
    className?: string;
    nativeMethod?: boolean;
  }[];
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
  suppressed?: {
    stackTrace?: {
      classLoaderName?: string;
      moduleName?: string;
      moduleVersion?: string;
      methodName?: string;
      fileName?: string;
      /** @format int32 */
      lineNumber?: number;
      className?: string;
      nativeMethod?: boolean;
    }[];
    message?: string;
    localizedMessage?: string;
  }[];
  localizedMessage?: string;
}

export interface ThrowableProblem {
  cause?: any;
  stackTrace?: {
    classLoaderName?: string;
    moduleName?: string;
    moduleVersion?: string;
    methodName?: string;
    fileName?: string;
    /** @format int32 */
    lineNumber?: number;
    className?: string;
    nativeMethod?: boolean;
  }[];
  message?: string;
  /** @format uri */
  instance?: string;
  /** @format uri */
  type?: string;
  parameters?: Record<string, any>;
  status?: StatusType;
  title?: string;
  detail?: string;
  suppressed?: {
    stackTrace?: {
      classLoaderName?: string;
      moduleName?: string;
      moduleVersion?: string;
      methodName?: string;
      fileName?: string;
      /** @format int32 */
      lineNumber?: number;
      className?: string;
      nativeMethod?: boolean;
    }[];
    message?: string;
    localizedMessage?: string;
  }[];
  localizedMessage?: string;
}

export interface Violation {
  field?: string;
  message?: string;
}

/** Letter status */
export interface LetterStatus {
  /** Letter ID */
  letterId?: string;
  /** Delivery status of the letter */
  status?: string;
  /** Information about the signing process */
  signingInformation?: string;
}

/** Request to send a digital registered letter */
export interface LetterRequest {
  /** Party ID of the recipient */
  partyId: string;
  /**
   * Subject of the letter
   * @minLength 1
   */
  subject: string;
  /** Support information for the letter */
  supportInfo: SupportInfo;
  /** Information regarding the organizational unit sending the letter */
  organization: Organization;
  /** Content type of the letter body, e.g., 'text/plain' or 'text/html' */
  contentType: string;
  /**
   * Body of the letter
   * @minLength 1
   */
  body: string;
}

export interface Organization {
  /**
   * Unique id for the organization
   * @format int32
   */
  number: number;
  /**
   * Readable name for the organization
   * @minLength 1
   */
  name: string;
}

export interface SupportInfo {
  /**
   * Support text for the letter
   * @minLength 1
   */
  supportText: string;
  /**
   * URL for contact
   * @minLength 1
   */
  contactInformationUrl: string;
  /** Phone number for contact */
  contactInformationPhoneNumber: string;
  /**
   * Email address for contact
   * @format email
   */
  contactInformationEmail: string;
}

export interface Attachment {
  /** Unique identifier for the attachment, used for fetching the attachment content */
  id?: string;
  /** Name of the attachment file */
  fileName?: string;
  /** Content type of the attachment */
  contentType?: string;
}

/** Digital registered letter response */
export interface Letter {
  /** Unique identifier for the letter */
  id?: string;
  /** Letter subject */
  subject?: string;
  /** Municipality ID for the sender of the letter */
  municipalityId?: string;
  /** Status of the letter */
  status?: string;
  /** The letter body */
  body?: string;
  /** Content type of the letter body */
  contentType?: string;
  /**
   * When the letter was sent
   * @format date-time
   */
  created?: string;
  /**
   * When the letter was last updated
   * @format date-time
   */
  updated?: string;
  /** Support information for the letter */
  supportInfo?: SupportInfo;
  attachments?: Attachment[];
}

/** Eligibility request model */
export interface EligibilityRequest {
  partyIds?: string[];
}

/** Paginated response containing a list of letters */
export interface Letters {
  /** PagingAndSortingMetaData model */
  _meta?: PagingAndSortingMetaData;
  letters?: Letter[];
}

/** PagingAndSortingMetaData model */
export interface PagingAndSortingMetaData {
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
  sortBy?: string[];
  /**
   * The sort order direction
   * @example "ASC"
   */
  sortDirection?: Direction;
}

export interface Device {
  /** Ip address used when the letter was signed */
  ipAddress?: string;
}

export interface SigningInfo {
  /** Status of the signing order */
  status?: string;
  /**
   * Timestamp when the letter was signed by receiving party
   * @format date-time
   */
  signed?: string;
  /** The unique Kivra id for the signing order */
  contentKey?: string;
  /** Order reference in Kivra for the signing order */
  orderRef?: string;
  /** The signature made by the receiving party */
  signature?: string;
  /** Online certificate status protocol for the signing order */
  ocspResponse?: string;
  /** Information regarding the signing party */
  user?: User;
  /** Information regarding the device used for the signing order */
  device?: Device;
  /** Information about possible additional verifications that were part of the signing order */
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
