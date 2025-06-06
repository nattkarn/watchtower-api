import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SSL,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async sendEmailNotify(subject: string, message: string, recipients: string[]) {
    try {
      await this.transporter.sendMail({
        from: `"Watchtower Alerts" <${process.env.EMAIL_USER}>`,
        to: recipients, // array of recipients
        subject: subject,
        text: message,
      });

      this.logger.log(`📧 Email sent to: ${recipients.join(', ')}`);
    } catch (error) {
      this.logger.error('❌ Error sending email:', error);
    }
  }
}
