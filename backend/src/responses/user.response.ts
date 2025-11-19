import { AdminUserData } from '@/interfaces/user.interface';
import { ApiResponse } from '@/services/api.service';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class AdminUser implements AdminUserData {
  @IsString()
  name: string;
  @IsString()
  givenName: string;
  @IsString()
  surname: string;
  @IsString()
  username: string;
}

export class AdminUserApiResponse implements ApiResponse<AdminUserData> {
  @ValidateNested()
  @Type(() => AdminUser)
  data: AdminUserData;
  @IsString()
  message: string;
}
