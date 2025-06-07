import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // Import Swagger decorators

@ApiTags('System') // Groups all endpoints under the 'System' tag
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health-check')
  @HttpCode(200)
  @SkipThrottle() // This decorator is from @nestjs/throttler, ensuring no rate limiting
  @ApiOperation({
    summary: 'Perform a system health check',
    description: 'Checks the basic operational status of the application. This endpoint is not rate-limited.',
  })
  @ApiResponse({
    status: 200,
    description: 'The application is healthy.',
    schema: {
      example: { status: 'ok' } // Example response for a healthy application
    }
  })
  @ApiResponse({
    status: 500,
    description: 'The application is experiencing issues.',
    schema: {
      example: { status: 'error', message: 'Database connection failed' } // Example for an unhealthy application
    }
  })
  healthCheck(): object {
    return this.appService.healthCheck();
  }
}