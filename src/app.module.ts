import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MonitorModule } from './monitor/monitor.module';
<<<<<<< Updated upstream
=======
import { ReportModule } from './report/report.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { AlertModule } from './alert/alert.module';
>>>>>>> Stashed changes
@Module({
  imports: [
    
    
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env',
      }
    ),
    
<<<<<<< Updated upstream
    PrismaModule, UserModule, AuthModule, MonitorModule],
=======
    PrismaModule, UserModule, AuthModule, MonitorModule, ReportModule, SchedulerModule, AlertModule],
>>>>>>> Stashed changes
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
