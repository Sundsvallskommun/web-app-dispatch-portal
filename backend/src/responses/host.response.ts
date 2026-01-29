import { Host as HostModel } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IDP } from './idp.response';
import { ApiResponse } from '@/services/api.service';

export class Host implements HostModel {
  @IsInt()
  id: number;
  @IsString()
  @IsOptional()
  name: string;
  @IsInt()
  municipalityId: number;
  @IsInt()
  idpId: number;
  @ValidateNested()
  @Type(() => IDP)
  @IsOptional()
  idp: IDP;
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  updatedAt: Date;
}

export class HostApiResponse implements ApiResponse<HostModel> {
  @ValidateNested()
  @Type(() => Host)
  data: HostModel;
  @IsString()
  message: string;
}

export class HostsApiResponse implements ApiResponse<HostModel[]> {
  @ValidateNested({ each: true })
  @Type(() => Host)
  data: HostModel[];
  @IsString()
  message: string;
}
