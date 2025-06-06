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

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('manual-check')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async manualCheck() {
    await this.schedulerService.handleCron(); // reuse cron logic
    return { message: 'Manual health check triggered.' };
  }
}
