import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MonitorModule } from './monitor/monitor.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { AlertModule } from './alert/alert.module';
import { ReportModule } from './report/report.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    
    
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env',
      }
    ),
    ThrottlerModule.forRoot({
      // if skipThrottle use @SkipThrottle() in controller
      throttlers: [
        {
          ttl: 60000, // 60 seconds
          limit: 10, // 10 requests per minute
        },
      ],
    }),
    PrismaModule, UserModule, AuthModule, MonitorModule, SchedulerModule, AlertModule, ReportModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
}],
})
export class AppModule {}
