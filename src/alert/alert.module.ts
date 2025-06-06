import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailService } from 'src/utils/email.util';

@Module({
  imports: [PrismaModule],
  controllers: [AlertController],
  providers: [AlertService, EmailService],
  exports: [AlertService],
})
export class AlertModule {}
