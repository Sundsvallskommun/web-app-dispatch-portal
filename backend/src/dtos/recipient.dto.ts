import { IsString } from 'class-validator';

export class RecipientDto {
  @IsString()
  personNumber: string;
}

export class OrgRecipientDto {
  @IsString()
  orgNumber: string;
}