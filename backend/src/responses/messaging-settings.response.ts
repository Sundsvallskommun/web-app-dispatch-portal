import {
  MessagingSettingValueRequest as IMessagingSettingValueRequest,
  MessagingSettingsRequest as IMessagingSettingsRequest,
  MessagingSettingValue as IMessagingSettingValue,
  MessagingSettings as IMessagingSettings,
} from '@/data-contracts/messaging-settings/data-contracts';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiResponse } from '@services/api.service';
import { Type } from 'class-transformer';

export class MessagingSettingValueRequest implements IMessagingSettingValueRequest {
  @IsString()
  key: string;
  @IsString()
  value: string;
  @IsString()
  type: string;
}

export class MessagingSettingsRequest implements IMessagingSettingsRequest {
  @ValidateNested({ each: true })
  @Type(() => MessagingSettingValueRequest)
  values: MessagingSettingValueRequest[];
}

export class MessagingSettingValue implements IMessagingSettingValue {
  @IsString()
  @IsOptional()
  key?: string;
  @IsString()
  @IsOptional()
  value?: string;
  @IsString()
  @IsOptional()
  type?: string;
}

export class MessagingSettings implements IMessagingSettings {
  @IsString()
  @IsOptional()
  id?: string;
  @IsString()
  @IsOptional()
  municipalityId?: string;
  @IsString()
  @IsOptional()
  created?: string;
  @IsString()
  @IsOptional()
  updated?: string;
  @ValidateNested({ each: true })
  @Type(() => MessagingSettingValue)
  values?: MessagingSettingValue[];
}

export class MessagingSettingApiResponse implements ApiResponse<MessagingSettings> {
  @ValidateNested()
  @Type(() => MessagingSettings)
  data: MessagingSettings;
  @IsString()
  message: string;
}

export class MessagingSettingsApiResponse implements ApiResponse<MessagingSettings[]> {
  @ValidateNested({ each: true })
  @Type(() => MessagingSettings)
  data: MessagingSettings[];
  @IsString()
  message: string;
}
