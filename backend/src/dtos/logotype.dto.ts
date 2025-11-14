import { Logotype } from '@prisma/client';
import { IsBooleanString, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateLogotypeDto implements Partial<Logotype> {
  @IsString()
  @IsOptional()
  name?: string;
  @IsOptional()
  @IsBooleanString()
  removeDarkMode?: boolean;
}

export class CreateLogotypeDto {
  @IsObject()
  logotypeLightMode: File;
  @IsObject()
  @IsOptional()
  logotypeDarkMode?: File;
}
