import {
  Controller,
  Body,
  Request,
  Get,
  UseGuards,
  HttpCode,
  Post,
} from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'; // 👈 1. Import decorators

@ApiTags('Scheduler') // 👈 2. จัดกลุ่ม Endpoint
@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('manual-check')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  // --- Swagger Documentation ---
  @ApiOperation({ summary: 'Trigger a manual health check' }) // 👈 3. เพิ่มคำอธิบาย
  @ApiBearerAuth() // 👈 4. ระบุว่าต้องใช้ Bearer Token
  @ApiResponse({
    status: 200,
    description: 'The health check was successfully triggered.',
    schema: {
      example: { message: 'Manual health check triggered.' }, // ตัวอย่าง response
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid JWT token.',
  })
  // -----------------------------
  async manualCheck() {
    await this.schedulerService.handleCron(); // reuse cron logic
    return { message: 'Manual health check triggered.' };
  }
}