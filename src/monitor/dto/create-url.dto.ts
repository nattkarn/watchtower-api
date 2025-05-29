import { IsString, IsUrl, IsDateString } from 'class-validator';
import { UniqueUrl } from './unique-url.validator';

export class CreateUrlDto {
  @IsUrl({}, { message: 'URL ไม่ถูกต้อง' })
  @UniqueUrl()
  url: string;

  @IsString()
  label: string;

  @IsDateString({}, { message: 'วันที่ SSL ต้องเป็นรูปแบบ ISO' })
  sslExpireDate?: string;
}