import { Controller, Get, UseGuards, HttpCode } from '@nestjs/common';
import { AlertService } from './alert.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiTags,           // For grouping endpoints
  ApiOperation,      // For summarizing the operation
  ApiResponse,       // For documenting responses
  ApiBearerAuth      // For indicating JWT authentication
} from '@nestjs/swagger';

@ApiTags('Alerts') // Groups all endpoints under the 'Alerts' tag in Swagger UI
@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get('test-email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth() // Indicates that this endpoint requires a JWT token in the Authorization header
  @ApiOperation({
    summary: 'Send a test email',
    description: 'Triggers a test email to be sent by the system. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Test email successfully sent.',
    schema: {
      example: { message: 'Test email sent.' } // Example response body
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid JWT token.',
  })
  async testEmail() {
    await this.alertService.testEmail();
    return { message: 'Test email sent.' };
  }
}