import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health-check')
  @HttpCode(200)
  @SkipThrottle()
  healthCheck(): object {
    return this.appService.healthCheck();
  }
}
