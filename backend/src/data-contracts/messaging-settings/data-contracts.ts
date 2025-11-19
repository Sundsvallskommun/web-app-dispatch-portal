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

/** Messaging setting value model */
export interface MessagingSettingValue {
  /**
   * Identifier key for the value setting
   * @example "department_name"
   */
  key?: string;
  /**
   * Stored value for the value setting
   * @example "Department 44"
   */
  value?: string;
  /**
   * Type of data for the stored value. Can be one of [STRING|NUMERIC|BOOLEAN]
   * @example "STRING"
   */
  type?: string;
}

/** Messaging settings response model */
export interface MessagingSettings {
  /**
   * Id for the messaging setting instance
   * @example "c9383d10-6fb5-4fc1-bd0a-50bf5a24d5b7"
   */
  id?: string;
  /**
   * Municipality id for municipality that the messaging setting instance belongs to
   * @example "2281"
   */
  municipalityId?: string;
  /**
   * Timestamp when the instance was created
   * @format date-time
   * @example "2025-10-24T15:30:00+02:00"
   */
  created?: string;
  /**
   * Timestamp when the instance was last updated. Null if instance has never been updated.
   * @format date-time
   * @example "2025-10-25T16:30:00+02:00"
   */
  updated?: string;
  /** Values connected to the messaging setting instance */
  values?: MessagingSettingValue[];
}

/** SenderInfo response */
export interface SenderInfoResponse {
  /**
   * Organization number of the organization connected to the information
   * @example "162021005489"
   */
  organizationNumber?: string;
  /**
   * Descriptive support text
   * @example "Kontakta oss via epost eller telefon"
   */
  supportText?: string;
  /**
   * Contact information URL
   * @example "https://sundsvall.se/"
   */
  contactInformationUrl?: string;
  /**
   * Contact information phone number
   * @example "060-19 10 00"
   */
  contactInformationPhoneNumber?: string;
  /**
   * Contact information e-mail address
   * @example "sundsvalls.kommun@sundsvall.se"
   */
  contactInformationEmail?: string;
  /**
   * Name of contact information e-mail sender
   * @example "Sundsvalls kommun"
   */
  contactInformationEmailName?: string;
  /**
   * Name of SMS sender
   * @example "Sundsvall"
   */
  smsSender?: string;
  /**
   * Folder name
   * @example "Foo"
   */
  folderName?: string;
}

/** CallbackEmail response */
export interface CallbackEmailResponse {
  /**
   * Organization number of the organization connected to the information
   * @example "162021005489"
   */
  organizationNumber?: string;
  /**
   * Callback e-mail address
   * @example "no-reply@domain.tld"
   */
  callbackEmail?: string;
}

/** PortalSettings response */
export interface PortalSettingsResponse {
  /**
   * Organization number of the organization connected to the information
   * @example "162021005489"
   */
  organizationNumber?: string;
  /**
   * Municipality ID
   * @example "2281"
   */
  municipalityId?: string;
  /**
   * Department name
   * @example "SKM"
   */
  departmentName?: string;
  /**
   * Method of delivery
   * @example "EMAIL"
   */
  snailMailMethod?: PortalSettingsResponseSnailMailMethodEnum;
  /**
   * Indicates if sms is enabled for the given department
   * @example true
   */
  smsEnabled?: boolean;
  /**
   * Indicates if rek is enabled for the given department
   * @example true
   */
  rekEnabled?: boolean;
}

/**
 * Method of delivery
 * @example "EMAIL"
 */
export enum PortalSettingsResponseSnailMailMethodEnum {
  EMAIL = "EMAIL",
  SC_ADMIN = "SC_ADMIN",
}
