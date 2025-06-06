import { Controller, Get, UseGuards, HttpCode } from '@nestjs/common';
import { AlertService } from './alert.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get('test-email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async testEmail() {
    await this.alertService.testEmail();
    return { message: 'Test email sent.' };
  }
}
