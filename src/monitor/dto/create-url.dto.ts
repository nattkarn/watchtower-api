import { IsString, IsUrl, IsDateString } from 'class-validator';
import { UniqueUrl } from './unique-url.validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Import Swagger decorators

export class CreateUrlDto {
  @ApiProperty({
    description: 'The URL to be created (e.g., https://www.example.com)',
    example: 'https://www.google.com',
  })
  @IsUrl({}, { message: 'URL ไม่ถูกต้อง' })
  @UniqueUrl()
  url: string;

  @ApiProperty({
    description: 'A human-readable label for the URL (e.g., "Google Search")',
    example: 'My Website',
  })
  @IsString()
  label: string;

  @ApiPropertyOptional({
    description: 'The SSL certificate expiration date in ISO format (optional)',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsDateString({}, { message: 'วันที่ SSL ต้องเป็นรูปแบบ ISO' })
  sslExpireDate?: string;
}