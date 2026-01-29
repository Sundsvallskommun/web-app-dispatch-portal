import { Host } from '@prisma/client';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateHostDto implements Pick<Host, 'name' | 'municipalityId' | 'idpId'> {
  @IsString()
  name: string;
  @IsInt()
  municipalityId: number;
  @IsInt()
  idpId: number;
}

export class UpdateHostDto implements Partial<Host> {
  @IsString()
  @IsOptional()
  name?: string;
  @IsInt()
  @IsOptional()
  municipalityId?: number;
  @IsInt()
  @IsOptional()
  idpId?: number;
}
