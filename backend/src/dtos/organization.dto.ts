import { Organization } from '@prisma/client';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto implements Partial<Organization> {
  @IsInt()
  orgId: number;
  @IsString()
  host: string;
  @IsString()
  @IsOptional()
  name?: string;
  @IsInt()
  @IsOptional()
  logotypeId?: number;
  @IsInt()
  municipalityId: number;
}

export class UpdateOrganizationDto implements Partial<Organization> {
  @IsInt()
  @IsOptional()
  orgId?: number;
  @IsString()
  @IsOptional()
  host?: string;
  @IsString()
  @IsOptional()
  name?: string;
  @IsInt()
  @IsOptional()
  logotypeId?: number;
  @IsInt()
  @IsOptional()
  municipalityId?: number;
}
