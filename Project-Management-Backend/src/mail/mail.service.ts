import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: any;
  private readonly logger = new Logger(MailService.name);
  private smtpUser: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
    const port = Number(this.configService.get<number>('SMTP_PORT')) || 587;
    this.smtpUser = this.configService.get<string>('SMTP_USER') || 'kajal2005dalai@gmail.com';
    const pass = this.configService.get<string>('SMTP_PASSWORD') || 'qouvirdisjaggpkr';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user: this.smtpUser,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 4000,
      socketTimeout: 4000,
      greetingTimeout: 4000,
    });

    // Verify connection on startup without blocking
    this.transporter.verify((error) => {
      if (error) {
        this.logger.warn(`SMTP Notice: Outbound port ${port} unreachable or blocked by hosting environment (${error.message}).`);
      } else {
        this.logger.log('SMTP Server is ready to take our messages');
      }
    });
  }

  async sendInviteEmail(email: string, token: string, role: string) {
    const rawFrontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://task-flow-kappa-peach.vercel.app';
    const frontendUrl = rawFrontendUrl.replace(/\/+$/, ''); // Remove trailing slashes
    const inviteLink = `${frontendUrl}/register?token=${token}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-top: 0;">Welcome to TaskFlow</h2>
        <p style="font-size: 15px; color: #374151;">You have been invited to join our platform with the role: <strong>${role}</strong></p>
        <p style="font-size: 15px; color: #374151;">Please click the button below to complete your registration and set your password:</p>
        <div style="margin: 28px 0;">
          <a href="${inviteLink}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Activate Your Account</a>
        </div>
        <p style="color: #6b7280; font-size: 13px; margin-bottom: 6px;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="color: #4f46e5; font-size: 13px; word-break: break-all;"><a href="${inviteLink}" style="color: #4f46e5;">${inviteLink}</a></p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">This invitation will expire in 7 days.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"TaskFlow" <${this.smtpUser}>`,
        to: email,
        subject: 'You are invited to TaskFlow',
        html: emailHtml,
      });
      this.logger.log(`Invitation email successfully sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send invitation email to ${email}. Error: ${error.message}`);
      throw error;
    }
  }

  async sendForgotPasswordOtp(email: string, otp: string) {
    this.logger.log(`[FORGOT PASSWORD OTP] Generating OTP for ${email}: ${otp}`);
    await this.transporter.sendMail({
      from: `"TaskFlow" <${this.smtpUser}>`,
      to: email,
      subject: 'TaskFlow Password Reset OTP',
      html: `
        <h3>Password Reset Request</h3>
        <p>We received a request to reset your password.</p>
        <p>Your One-Time Password (OTP) is:</p>
        <h2 style="letter-spacing: 3px; font-size: 28px; color: #4F46E5;">${otp}</h2>
        <p>This OTP is valid for 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
    this.logger.log(`Password reset OTP sent to ${email}`);
  }
}
