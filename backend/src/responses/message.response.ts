import {
  Address as AddressType,
  ESigningSignatory as ESigningSignatoryType,
} from '@/data-contracts/postportalservice/data-contracts';
import { MessageResponse, MessageResponseData } from '@/interfaces/message.interface';
import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Address, Recipient } from './recipient.response';
import { ExtendedRecipient } from '@/interfaces/recipient.interface';

export class ESigningSignatory implements ESigningSignatoryType {
  @IsString()
  @IsOptional()
  partyId?: string;
  @IsString()
  name: string;
  @IsEmail()
  email: string;
}

export class Message implements MessageResponseData {
  @ValidateNested({ each: true })
  @Type(() => Recipient)
  @IsOptional()
  recipients?: ExtendedRecipient[];
  @ValidateNested({ each: true })
  @Type(() => Address)
  @IsOptional()
  addresses?: AddressType[];
  @ValidateNested({ each: true })
  @Type(() => ESigningSignatory)
  @IsOptional()
  signatories?: ESigningSignatoryType[];
  @IsString()
  @IsOptional()
  recipientPersonId?: string;
  @IsBoolean()
  @IsOptional()
  csv?: boolean;
}

export class MessageApiResponse implements MessageResponse {
  @ValidateNested()
  @Type(() => Message)
  data: MessageResponseData;
  @IsString()
  message: string;
}
