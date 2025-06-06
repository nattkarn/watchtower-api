import {
  Controller,
  Body,
  Request,
  Get,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { Post, Patch } from '@nestjs/common';
import { CreateSchedulerConfigDto } from './dto/create-scheduler-config.dto';
import { UpdateSchedulerConfigDto } from './dto/update-scheduler-config.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('config')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  async createConfig(
    @Body() body: CreateSchedulerConfigDto,
    @Request() req: any,
  ) {
    return this.schedulerService.createSchedulerConfig(body, req.user.userid);
  }

  @Get('config')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  async getConfig() {
    return this.schedulerService.getSchedulerConfig();
  }

  @Patch('config')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  async updateConfig(
    @Body() body: UpdateSchedulerConfigDto,
    @Request() req: any,
  ) {
    return this.schedulerService.updateSchedulerConfig(body, req.user.userid);
  }
}
