import { ApiResponse } from '@/services/api.service';
import { IDP as IDPModel } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

export class IDP implements IDPModel {
  @IsInt()
  id: number;
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  entryPoint: string;
  @IsString()
  idpCert: string;
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  updatedAt: Date;
}

export class IDPApiResponse implements ApiResponse<IDPModel> {
  @ValidateNested()
  @Type(() => IDP)
  data: IDPModel;
  @IsString()
  message: string;
}

export class IDPsApiResponse implements ApiResponse<IDPModel[]> {
  @ValidateNested({ each: true })
  @Type(() => IDP)
  data: IDPModel[];
  @IsString()
  message: string;
}
