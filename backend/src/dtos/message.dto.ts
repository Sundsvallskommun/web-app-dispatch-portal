import { ESigningSignatory } from '@/responses/message.response';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class RequestBodyMail {
  @IsString()
  recipients: string;
  @IsString()
  addresses: string;
  @IsString()
  subject: string;
  @IsString()
  @IsOptional()
  body?: string;
}

export class RequestBodyRecMail {
  @IsString()
  recipientPersonId: string;
  @IsString()
  subject: string;
  @IsString()
  @IsOptional()
  body?: string;
}

export class RequestBodyEsigning {
  @IsString()
  signatories: string;
  @IsString()
  subject: string;
  @IsString()
  document: string;
}

export class EsigningSignatoryList {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ESigningSignatory)
  signatories: ESigningSignatory[];
}

export class RequestBodyCsvMail {
  @IsString()
  csvId: string;
  @IsString()
  subject: string;
  @IsString()
  @IsOptional()
  body?: string;
}

export class RequestBodyCsvSMS {
  @IsString()
  csvId: string;
  @IsString()
  message: string;
}

export class RequestBodySMS {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  recipients: string[];
  @IsString()
  message: string;
}
