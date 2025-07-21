import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountStatus, Role } from 'src/user/dto/create-user.dto';
import { EmailService } from 'src/utils/email.util';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async processAlertForUrl(
    urlId: number,
    newStatus: string,
    previousStatus: string,
    isSslExpireSoon: boolean,
    sslExpireDate?: string,
  ) {
    // console.log('processAlertForUrl urlId', urlId)
    // console.log('processAlertForUrl newStatus', newStatus)
    // console.log('processAlertForUrl isSslExpireSoon', isSslExpireSoon)
    // console.log('processAlertForUrl sslExpireDate', sslExpireDate)
    
    const url = await this.prisma.url.findUnique({
      where: { id: urlId },
      include: { owner: true },
    });

    if (!url) {
      this.logger.warn(`⚠️ URL not found for id=${urlId}`);
      return;
    }

    // Load admin emails

    const roleAdmin = await this.prisma.role.findUnique({
      where: {
        id: Role.ADMIN,
      },
      select: { id: true },
      
    });
    
    const adminEmails = await this.prisma.user.findMany({
      where: {
        roleId: roleAdmin?.id,
        status: AccountStatus.ACTIVE,
      },
      select: { email: true },
    });

    console.log('adminEmails', adminEmails)
    const emailList = adminEmails.map((user) => user.email);

    // 1️⃣ Check for status change (insert log every time if status changed)
    // console.log('url.status', url.status)
    // console.log('newStatus', newStatus)
    if (previousStatus !== newStatus) {
      console.log('call alert')
      const subject = `[ALERT] URL Status Changed: ${url.url}`;
      const message = `URL: ${url.url}\nStatus changed from ${url.status?.toUpperCase()} → ${newStatus?.toUpperCase()}\nLast checked: ${new Date().toISOString()}`;

      await this.emailService.sendEmailNotify(subject, message, emailList);

      await this.prisma.alertLog.create({
        data: {
          urlId: url.id,
          type: 'status-change',
          message: `Status changed from ${url.status} to ${newStatus}`,
        },
      });

      this.logger.log(`✅ Status change alert sent for URL: ${url.url}`);
    }

    // 2️⃣ Check for SSL expire soon → alert + log
    const existingSslExpireLog = await this.prisma.alertLog.findFirst({
      where: {
        urlId: url.id,
        type: 'ssl-expire',
      },
    });

    if (isSslExpireSoon && !existingSslExpireLog) {
      const subject = `[ALERT] SSL Expiring Soon: ${url.url}`;
      const message = `URL: ${url.url}\nSSL Expiring Soon!\nExpires on: ${sslExpireDate}\nLast checked: ${new Date().toISOString()}`;

      await this.emailService.sendEmailNotify(subject, message, emailList);

      await this.prisma.alertLog.create({
        data: {
          urlId: url.id,
          type: 'ssl-expire',
          message: `SSL Expiring on: ${sslExpireDate}`,
        },
      });

      this.logger.log(`✅ SSL expire alert sent for URL: ${url.url}`);
    }

    // 3️⃣ Auto clear SSL-expire log if SSL renewed (> 7 days)
    if (!isSslExpireSoon && existingSslExpireLog) {
      await this.prisma.alertLog.delete({
        where: {
          id: existingSslExpireLog.id,
        },
      });

      this.logger.log(`✅ Cleared old SSL-expire log for URL: ${url.url}`);
    }
  }

  async testEmail() {
    await this.emailService.testEmail();
    return { message: 'Test email sent.' };
  }

}
