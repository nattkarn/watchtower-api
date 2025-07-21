import { ApiProperty } from '@nestjs/swagger'; // 👈 1. Import ApiProperty
import { IsString, Matches } from 'class-validator';

export class CreateSchedulerConfigDto {
  // 👇 2. เพิ่ม @ApiProperty เพื่ออธิบาย field นี้
  @ApiProperty({
    description: "The cron expression that defines the schedule (e.g., '0 * * * *')",
    example: '0 22 * * 1-5', // ตัวอย่าง: รันตอน 22:00 น. ทุกวันจันทร์ถึงศุกร์
    pattern:
      '/^(\\*|([0-9]|[1-5][0-9]))(\\s+(\\*|([0-9]|1[0-9]|2[0-3]))){1}(\\s+(\\*|([1-9]|[1-2][0-9]|3[0-1]))){1}(\\s+(\\*|([1-9]|1[0-2]))){1}(\\s+(\\*|([0-6]))){1}$/',
  })
  @IsString()
  @Matches(
    /^(\*|([0-9]|[1-5][0-9]))(\s+(\*|([0-9]|1[0-9]|2[0-3]))){1}(\s+(\*|([1-9]|[1-2][0-9]|3[0-1]))){1}(\s+(\*|([1-9]|1[0-2]))){1}(\s+(\*|([0-6]))){1}$/,
    {
      message: 'Invalid cron expression format',
    },
  )
  cronExpr: string;
}