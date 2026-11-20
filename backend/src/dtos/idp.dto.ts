import { IDP } from '@prisma-generated/postgresql';
import { IsOptional, IsString } from 'class-validator';

export class CreateIdpDto implements Pick<IDP, 'name' | 'entryPoint' | 'idpCert'> {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  entryPoint: string;
  @IsString()
  idpCert: string;
}

export class UpdateIdpDto implements Partial<IDP> {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  entryPoint?: string;
  @IsString()
  @IsOptional()
  idpCert?: string;
}
