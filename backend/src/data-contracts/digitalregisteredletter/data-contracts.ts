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

/**
 * The sort order direction
 * @example "ASC"
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
  detail?: string;
  /** @format uri */
  instance?: string;
  parameters?: Record<string, object>;
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
  message?: string;
  title?: string;
  detail?: string;
  /** @format uri */
  instance?: string;
  /** @format uri */
  type?: string;
  parameters?: Record<string, object>;
  status?: StatusType;
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
  /**
   * Letter ID
   * @example "43a32404-28ee-480f-a095-00d48109afab"
   */
  letterId?: string;
  /**
   * Delivery status of the letter. NOT_FOUND if the letter could not be found
   * @example "NEW"
   */
  status?: string;
  /**
   * Information about the signing process. NOT_FOUND if there is no signing information available
   * @example "COMPLETED"
   */
  signingInformation?: string;
}

/** Request to send a digital registered letter */
export interface LetterRequest {
  /**
   * Party ID of the recipient
   * @example "7ca29702-a07f-4e13-a66a-4ebc27929cfd"
   */
  partyId: string;
  /**
   * Subject of the letter
   * @minLength 1
   * @example "Important Notification"
   */
  subject: string;
  /** Support information for the letter */
  supportInfo: SupportInfo;
  /** Information regarding the organizational unit sending the letter */
  organization: Organization;
  /**
   * Content type of the letter body, e.g., 'text/plain' or 'text/html'
   * @example "text/plain"
   */
  contentType: string;
  /**
   * Body of the letter
   * @minLength 1
   * @example "This is the content of the letter. Plain-text body"
   */
  body: string;
}

/** Information regarding the organizational unit sending the letter */
export interface Organization {
  /**
   * Unique id for the organization
   * @format int32
   * @example 44
   */
  number: number;
  /**
   * Readable name for the organization
   * @minLength 1
   * @example "Department 44"
   */
  name: string;
}

/** Support information for the letter */
export interface SupportInfo {
  /**
   * Support text for the letter
   * @minLength 1
   * @example "For support, please contact us at the information below."
   */
  supportText: string;
  /**
   * URL for contact
   * @minLength 1
   * @example "https://example.com/support"
   */
  contactInformationUrl: string;
  /**
   * Phone number for contact
   * @example "+46123456789"
   */
  contactInformationPhoneNumber: string;
  /**
   * Email address for contact
   * @format email
   * @example "support@email.com"
   */
  contactInformationEmail: string;
}

/** List of attachments for the letter */
export interface Attachment {
  /**
   * Unique identifier for the attachment, used for fetching the attachment content
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  id?: string;
  /**
   * Name of the attachment file
   * @example "document.pdf"
   */
  fileName?: string;
  /**
   * Content type of the attachment
   * @example "application/pdf"
   */
  contentType?: string;
}

/** Digital registered letter response */
export interface Letter {
  /**
   * Unique identifier for the letter
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * Letter subject
   * @example "Important Notification"
   */
  subject?: string;
  /**
   * Municipality ID for the sender of the letter
   * @example "2281"
   */
  municipalityId?: string;
  /** Status of the letter */
  status?: string;
  /** The letter body */
  body?: string;
  /**
   * Content type of the letter body
   * @example "text/html"
   */
  contentType?: string;
  /**
   * When the letter was sent
   * @format date-time
   * @example "2023-10-09T12:34:56Z"
   */
  created?: string;
  /**
   * When the letter was last updated
   * @format date-time
   * @example "2023-10-09T12:34:56Z"
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
  /** The sort order direction */
  sortDirection?: Direction;
}

/** Information regarding the device used for the signing order */
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

/** Information about possible additional verifications that were part of the signing order */
export interface StepUp {
  /** Whether an MRTD check was performed before the order was completed */
  mrtd?: boolean;
}

/** Information regarding the signing party */
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
