import { Municipality as MunicipalityModel } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Logotype } from './logotype.response';
import { ApiResponse } from '@/services/api.service';

export class Municipality implements MunicipalityModel {
  @IsInt()
  id: number;
  @IsInt()
  municipalityId: number;
  @IsString()
  @IsOptional()
  name: string;
  @IsInt()
  @IsOptional()
  logotypeId: number;
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  updatedAt: Date;
}

export class MunicipalityExtended extends Municipality implements MunicipalityModel {
  @ValidateNested()
  @Type(() => Logotype)
  @IsOptional()
  logotype: Logotype;
}

export class MunicipalityApiResponse implements ApiResponse<MunicipalityModel> {
  @ValidateNested()
  @Type(() => MunicipalityExtended)
  data: MunicipalityExtended;
  @IsString()
  message: string;
}

export class MunicipalitiesApiResponse implements ApiResponse<MunicipalityModel[]> {
  @ValidateNested({ each: true })
  @Type(() => MunicipalityExtended)
  data: MunicipalityExtended[];
  @IsString()
  message: string;
}
