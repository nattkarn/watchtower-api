import { IsString, IsDateString, IsOptional, IsIn } from 'class-validator';

export class UpdateUrlDto {
  @IsString()
  label: string;

  @IsDateString({}, { message: 'วันที่ SSL ต้องเป็นรูปแบบ ISO' })
  sslExpireDate?: string;

  @IsString()
  @IsIn(['active', 'inactive'], {
    message: 'Status must be either "active" or "inactive"',
  })
  status: string;
}
