import { ApiResponse } from '@/services/api.service';
import { Logotype as LogotypeModel } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Municipality } from './municipality.response';

export class Logotype implements LogotypeModel {
  @IsInt()
  id: number;
  @IsString()
  name: string;
  @IsString()
  filenameLightMode: string;
  @IsString()
  urlLightMode: string;
  @IsString()
  @IsOptional()
  filenameDarkMode: string;
  @IsString()
  @IsOptional()
  urlDarkMode: string;
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  updatedAt: Date;
}

export class LogotypeExtended extends Logotype implements LogotypeModel {
  @ValidateNested({ each: true })
  @Type(() => Municipality)
  municipalities: Municipality[];
}

export class LogotypeApiResponse implements ApiResponse<LogotypeModel> {
  @ValidateNested()
  @Type(() => Logotype)
  data: Logotype;
  @IsString()
  message: string;
}

export class LogotypesApiResponse implements ApiResponse<LogotypeModel[]> {
  @ValidateNested({ each: true })
  @Type(() => Logotype)
  data: Logotype[];
  @IsString()
  message: string;
}
