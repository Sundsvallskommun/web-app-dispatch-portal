import { Address as AddressType } from '@/data-contracts/postportalservice/data-contracts';
import { MessageResponse, MessageResponseData } from '@/interfaces/message.interface';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Address, Recipient } from './recipient.response';
import { ExtendedRecipient } from '@/interfaces/recipient.interface';

export class Message implements MessageResponseData {
  @ValidateNested({ each: true })
  @Type(() => Recipient)
  @IsOptional()
  recipients?: ExtendedRecipient[];
  @ValidateNested({ each: true })
  @Type(() => Address)
  @IsOptional()
  addresses?: AddressType[];
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
