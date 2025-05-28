import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): object {
    return {
      status: 'ok',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    }
  }
}
