import { Organization as OrganizationModel } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Validate, ValidateNested } from 'class-validator';
import { Municipality } from './municipality.response';
import { Logotype } from './logotype.response';
import { ApiResponse } from '@/services/api.service';

export class Organization implements OrganizationModel {
  @IsInt()
  id: number;
  @IsString()
  host: string;
  @IsInt()
  orgId: number;
  @IsString()
  @IsOptional()
  name: string;
  @IsInt()
  @IsOptional()
  logotypeId: number;
  @IsInt()
  @IsOptional()
  municipalityId: number;
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  updatedAt: Date;
}

export class OrganizationExtended extends Organization implements OrganizationModel {
  @ValidateNested()
  @Type(() => Municipality)
  municipality: Municipality;
  @ValidateNested()
  @Type(() => Logotype)
  logotype: Logotype;
}

export class OrganizationApiResponse implements ApiResponse<OrganizationModel> {
  @ValidateNested()
  @Type(() => OrganizationExtended)
  data: OrganizationExtended;
  @IsString()
  message: string;
}

export class OrganizationsApiResponse implements ApiResponse<OrganizationModel[]> {
  @ValidateNested({ each: true })
  @Type(() => OrganizationExtended)
  data: OrganizationExtended[];
  @IsString()
  message: string;
}
