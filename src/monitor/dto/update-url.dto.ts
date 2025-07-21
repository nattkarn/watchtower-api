import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // 👈 1. Import decorators
import { IsString, IsDateString, IsOptional, IsIn, IsUrl } from 'class-validator';

export class UpdateUrlDto {
  @ApiProperty({
    description: 'The custom name or label for the URL',
    example: 'My Company Website',
  })
  @IsString()
  label: string;

  @ApiPropertyOptional({
    description: 'The URL to monitor',
    example: 'https://google.com',
  })
  @IsString()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({
    description: 'The SSL certificate expiration date (in ISO 8601 format)',
    example: '2025-12-31T17:00:00.000Z',
  })
  @IsDateString({}, { message: 'วันที่ SSL ต้องเป็นรูปแบบ ISO' })
  @IsOptional() // 👈 2. เพิ่ม IsOptional เพื่อให้สอดคล้องกับ '?'
  sslExpireDate?: string;

  @ApiProperty({
    description: 'The monitoring status of the URL',
    enum: ['active', 'inactive'], // 👈 3. กำหนดค่าที่เป็นไปได้
    example: 'active',
  })
  @IsString()
  @IsIn(['active', 'inactive'], {
    message: 'Status must be either "active" or "inactive"',
  })
  status: string;
}