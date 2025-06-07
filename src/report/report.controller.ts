import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExportCsvByDateDto } from './dto/export-csv-date.dto'; // 👈 1. Import DTO

@ApiTags('Report') // 👈 2. จัดกลุ่ม API
@ApiBearerAuth() // 👈 3. ระบุว่าทุก endpoint ในนี้ต้องใช้ Bearer Token
@UseGuards(JwtAuthGuard) // ใช้ Guard กับทุก route ใน Controller นี้
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('export-csv')
  @HttpCode(200)
  // --- Swagger ---
  @ApiOperation({ summary: 'Export all data to a CSV string' })
  @ApiResponse({
    status: 200,
    description: 'Returns a string containing the data in CSV format.',
    content: { 'text/csv': { schema: { type: 'string' } } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // ---------------
  async exportCsv() {
    const csv = await this.reportService.exportCsv();
    return csv;
  }

  @Post('export-csv-date')
  @HttpCode(200)
  // --- Swagger ---
  @ApiOperation({ summary: 'Export data within a date range to a CSV string' })
  @ApiBody({ type: ExportCsvByDateDto }) // 👈 4. ระบุ Body DTO
  @ApiResponse({
    status: 200,
    description: 'Returns a string containing the filtered data in CSV format.',
    content: { 'text/csv': { schema: { type: 'string' } } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // ---------------
  async exportCsvByDate(@Body() body: ExportCsvByDateDto) { // 👈 5. ใช้ DTO ที่สร้างไว้
    const csv = await this.reportService.exportCsvByDate(
      body.fromDate,
      body.toDate,
    );
    // console.log(csv);
    return csv;
  }
}