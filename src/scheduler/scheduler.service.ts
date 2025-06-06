import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonitorService } from 'src/monitor/monitor.service';
import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AlertService } from 'src/alert/alert.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly monitorService: MonitorService,
    private readonly alertService: AlertService,
  ) {}

  // Cron Job: run every 15 minutes
  @Cron('*/15 * * * *')
async handleCron() {
  this.logger.log('🚀 Running URL health check job (every 15 min)');

  try {
    const urls = await this.prisma.url.findMany({
      select: {
        id: true,
        url: true,
      },
    });

    // ⭐ Loop serial → await ทีละ URL → ป้องกัน connection pool เต็ม
    for (const url of urls) {
      try {
        this.logger.log(`🔍 Checking URL: ${url.url}`);

        const checkResult = await this.monitorService.checkUrl(url.url);

        await this.alertService.processAlertForUrl(
          url.id,
          checkResult.status,
          checkResult.isSslExpireSoon ?? false,
          checkResult.sslExpireDate,
        );
      } catch (err) {
        this.logger.error(`❌ Error checking URL ${url.url}:`, err);
      }
    }

    this.logger.log('✅ URL health check job complete');
  } catch (error) {
    this.logger.error('❌ Error running URL health check job:', error);
  }
}



}
