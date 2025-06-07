// src/report/dto/export-csv-date.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class ExportCsvByDateDto {
  @ApiPropertyOptional({
    description: 'The start date for the report (ISO 8601 format)',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'The end date for the report (ISO 8601 format)',
    example: '2025-06-07T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}