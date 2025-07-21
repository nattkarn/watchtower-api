import { IsNotEmpty, IsString, IsUrl } from "class-validator";
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

export class CheckUrlDto {
  @ApiProperty({
    description: 'The URL to be checked for its status or existence.',
    example: 'https://www.example.com/check',
  })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  url: string;
}