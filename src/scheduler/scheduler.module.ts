import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MonitorModule } from 'src/monitor/monitor.module';
import { AlertModule } from 'src/alert/alert.module';
import { MonitorService } from 'src/monitor/monitor.service';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot(), MonitorModule, AlertModule],
  controllers: [SchedulerController],
  providers: [SchedulerService, MonitorService],

})
export class SchedulerModule {}
