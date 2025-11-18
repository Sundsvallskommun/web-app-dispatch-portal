import { Municipality } from '@prisma/client';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMunicipalityDto implements Partial<Municipality> {
  @IsInt()
  municipalityId: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsInt()
  @IsOptional()
  logotypeId?: number;
}

export class UpdateMunicipalityDto implements Partial<Municipality> {
  @IsInt()
  @IsOptional()
  municipalityId?: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsInt()
  @IsOptional()
  logotypeId?: number;
}
