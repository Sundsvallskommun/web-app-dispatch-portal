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

/** Messaging setting value request model */
export interface MessagingSettingValueRequest {
  /**
   * Identifier key for the value setting
   * @minLength 1
   */
  key: string;
  /**
   * Stored value for the value setting
   * @minLength 1
   */
  value: string;
  /**
   * Type of data for the stored value. Can be one of [STRING|NUMERIC|BOOLEAN]
   * @minLength 1
   */
  type: string;
}

/** Messaging settings request model */
export interface MessagingSettingsRequest {
  /**
   * Values for the messaging setting
   * @minItems 1
   */
  values: MessagingSettingValueRequest[];
}

/** Messaging setting value model */
export interface MessagingSettingValue {
  /** Identifier key for the value setting */
  key?: string;
  /** Stored value for the value setting */
  value?: string;
  /** Type of data for the stored value. Can be one of [STRING|NUMERIC|BOOLEAN] */
  type?: string;
}

/** Messaging settings response model */
export interface MessagingSettings {
  /** Id for the messaging setting instance */
  id?: string;
  /** Municipality id for municipality that the messaging setting instance belongs to */
  municipalityId?: string;
  /**
   * Timestamp when the instance was created
   * @format date-time
   */
  created?: string;
  /**
   * Timestamp when the instance was last updated. Null if instance has never been updated.
   * @format date-time
   */
  updated?: string;
  /** Values connected to the messaging setting instance */
  values?: MessagingSettingValue[];
}
