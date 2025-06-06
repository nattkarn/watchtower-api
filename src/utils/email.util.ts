import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async sendEmailNotify(subject: string, message: string, recipients: string[]) {
    console.log('send email');
    try {
      console.log(`sending email to: ${recipients.join(', ')}, subject: ${subject}`);
      const result = await this.transporter.sendMail({
        from: `"Watchtower Alerts" <${process.env.EMAIL_USER}>`,
        to: recipients, // array of recipients
        subject: subject,
        text: message,
      });
  
      this.logger.log(`📧 Email sent to: ${recipients.join(', ')}, messageId: ${result.messageId}`);
    } catch (error) {
      this.logger.error('❌ Error sending email:', error);
    }
  }

  async testEmail() {
    await this.sendEmailNotify(
      'Test Email',
      'This is a test email from Watchtower.',
      ['nattkarn.p@hotmail.com'],
    );
  }
}
