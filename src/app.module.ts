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
@Module({
  imports: [
    
    
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env',
      }
    ),
    
    PrismaModule, UserModule, AuthModule, MonitorModule, SchedulerModule, AlertModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
