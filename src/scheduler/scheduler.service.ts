import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonitorService } from 'src/monitor/monitor.service';
import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateSchedulerConfigDto } from './dto/create-scheduler-config.dto';
import { UpdateSchedulerConfigDto } from './dto/update-scheduler-config.dto';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly monitorService: MonitorService,
  ) {}

  // Cron Job: run every 15 minutes
  @Cron('*/15 * * * *')
  async handleCron() {
    this.logger.log('🚀 Running URL health check job (every 15 min)');
    // console.log('🚀 Running URL health check job (every 1 min)');
    try {
      const urls = await this.prisma.url.findMany({
        where: {
          status: 'active',
        },
        select: {
          id: true,
          url: true,
        },
      });

      this.logger.log(`Found ${urls.length} URLs to check`);

      for (const item of urls) {
        this.logger.log(`Checking URL: ${item.url}`);
        try {
          await this.monitorService.checkUrl(item.url);
          this.logger.log(`✅ Checked: ${item.url}`);
        } catch (err) {
          this.logger.error(`❌ Error checking URL ${item.url}:`, err);
        }
      }

      this.logger.log('🎉 URL health check job complete');
    } catch (err) {
      this.logger.error('❌ Error running URL health check job:', err);
    }
  }


  // POST /scheduler/config
  async createSchedulerConfig(dto: CreateSchedulerConfigDto , ownerId: number) {
    const existing = await this.prisma.schedulerConfig.findFirst();

    if (existing) {
      throw new Error('SchedulerConfig already exists. Use PATCH to update.');
    }

    const config = await this.prisma.schedulerConfig.create({
      data: {
        cronExpr: dto.cronExpr,
        updatedById: ownerId,
      },
    });

    this.logger.log(`Created SchedulerConfig with cronExpr=${dto.cronExpr}`);

    return config;
  }

  // GET /scheduler/config
  async getSchedulerConfig() {
    const config = await this.prisma.schedulerConfig.findFirst();

    if (!config) {
      throw new Error('SchedulerConfig not found');
    }

    return config;
  }

  // PATCH /scheduler/config
  async updateSchedulerConfig(dto: UpdateSchedulerConfigDto , ownerId: number) {
    const config = await this.prisma.schedulerConfig.findFirst();

    if (!config) {
      throw new Error('SchedulerConfig not found');
    }

    const updated = await this.prisma.schedulerConfig.update({
      where: { id: config.id },
      data: {
        cronExpr: dto.cronExpr,
        updatedById: ownerId,
      },
    });

    this.logger.log(`Updated SchedulerConfig to cronExpr=${dto.cronExpr}`);

    return updated;
  }
}
