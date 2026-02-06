import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

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

export class RequestBodyCsvMail {
  @IsString()
  csvId: string;
  @IsString()
  subject: string;
  @IsString()
  @IsOptional()
  body?: string;
}

export class RequestBodySMS {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  recipients: string[];
  @IsString()
  message: string;
}
