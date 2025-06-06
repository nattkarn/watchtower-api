import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('export-csv')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async exportCsv() {
    const csv = await this.reportService.exportCsv();
    // console.log(csv);
    return csv;
  }

  @Post('export-csv-date')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async exportCsvByDate(@Body() body: { fromDate?: string; toDate?: string }) {
    const csv = await this.reportService.exportCsvByDate(body.fromDate, body.toDate);
    console.log(csv);
    return csv;
  }
}
