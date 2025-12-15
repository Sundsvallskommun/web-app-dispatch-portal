import { Address as AddressType, RecipientDeliveryMethodEnum } from '@/data-contracts/postportalservice/data-contracts';
import { ExtendedRecipient } from '@/interfaces/recipient.interface';
import { ApiResponse } from '@/services/api.service';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

export class Address implements AddressType {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  street: string;
  @IsString()
  @IsOptional()
  apartmentNumber?: string;
  @IsString()
  @IsOptional()
  careOf?: string;
  @IsString()
  zipCode: string;
  @IsString()
  city: string;
  @IsString()
  country: string;
}

export class Recipient implements ExtendedRecipient {
  @IsString()
  @IsOptional()
  partyId?: string;
  @IsEnum(RecipientDeliveryMethodEnum)
  deliveryMethod: RecipientDeliveryMethodEnum;
  @ValidateNested()
  @Type(() => Address)
  @IsOptional()
  address?: AddressType;
  @IsString()
  @IsOptional()
  reason?: string;
  @IsString()
  @IsOptional()
  personNumber?: string;
}

export class RecipientApiResponse implements ApiResponse<ExtendedRecipient> {
  @ValidateNested()
  @Type(() => Recipient)
  data: ExtendedRecipient;
  @IsString()
  message: string;
}

export class RecipientNameApiResponse implements ApiResponse<string> {
  @IsString()
  data: string;
  @IsString()
  message: string;
}
