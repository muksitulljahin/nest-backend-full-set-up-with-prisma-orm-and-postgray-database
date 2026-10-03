import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';
import axios from 'axios';
import envConfig from 'src/config/config';
import { UserRole } from 'src/libs/globalEnum/user-roles.enum';
import { getAdminOtpTemplate } from './mailAdmin.tamplate';
import { getTeacherOtpTemplate } from './mailTeacher.tamplate';
import { getStudentOtpTemplate } from './mailStudent.tamplate';

@Injectable()
export class MailService {
  // Commented out direct SMTP transporter due to Render Free Tier port blocking (25, 465, 587)
  /*
  private transporter = nodemailer.createTransport({
    host: 'my.mailbux.com',
    port: 465,
    secure: true,
    auth: {
      user: envConfig.MAILBUX_USER,
      pass: envConfig.MAILBUX_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  */

  // Commented out Resend integration due to limit constraints
  /*
  private resend = new Resend(envConfig.RESEND_API_KEY);

  async sendOtp(
    email: string,
    otp: string,
    role: 'admin' | 'student' | 'teacher' = 'student',
  ) {
    if (envConfig.NODE_ENV === 'development') {
      console.log(`[Dev] OTP for ${email}: ${otp} (${role})`);
      return;
    }

    let htmlTemplate = '';
    let subject = `Biddaneer ${role}} Account Verification Code`;

    switch (role) {
      case 'admin':
        htmlTemplate = getAdminOtpTemplate(otp);
        subject = 'Biddaneer Admin Verification Code';
        break;
      case 'teacher':
        htmlTemplate = getTeacherOtpTemplate(otp);
        subject = 'Biddaneer Teacher Verification Code';
        break;
      case 'student':
      default:
        htmlTemplate = getStudentOtpTemplate(otp);
        subject = 'Biddaneer Student Verification Code';
        break;
    }

    try {
      const { error } = await this.resend.emails.send({
        from: envConfig.MAILBUX_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject,
        html: htmlTemplate,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Resend API SMTP error:', error.message);
      throw new Error('Failed to send OTP');
    }
  }
  */

  // brabo
  async sendOtp(
    email: string,
    otp: string,
    role: UserRole | 'admin' | 'student' | 'teacher' = 'student',
  ) {
    if (envConfig.NODE_ENV === 'development') {
      console.log(`[Dev] OTP for ${email}: ${otp} (${role})`);
      return;
    }

    const normalizedRole = role.toUpperCase();
    let htmlTemplate = '';
    let subject = `Biddaneer ${role} Account Verification Code`;

    switch (normalizedRole) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
      case UserRole.STAFF:
      case UserRole.SUPPORT:
        htmlTemplate = getAdminOtpTemplate(otp);
        subject = 'Biddaneer Admin Verification Code';
        break;
      case UserRole.TEACHER:
        htmlTemplate = getTeacherOtpTemplate(otp);
        subject = 'Biddaneer Teacher Verification Code';
        break;
      case UserRole.STUDENT:
      default:
        htmlTemplate = getStudentOtpTemplate(otp);
        subject = 'Biddaneer Student Verification Code';
        break;
    }

    const isAdminRole =
      normalizedRole === UserRole.ADMIN ||
      normalizedRole === UserRole.SUPER_ADMIN ||
      normalizedRole === UserRole.STAFF ||
      normalizedRole === UserRole.SUPPORT;

    try {
      if (isAdminRole && envConfig.RESEND_API_KEY) {
        // Send using Resend API (100 emails/day free tier - perfect for Admins)
        await axios.post(
          'https://api.resend.com/emails',
          {
            from: `Biddaneer <${envConfig.MAILBUX_FROM_EMAIL}>`,
            to: email,
            subject: subject,
            html: htmlTemplate,
          },
          {
            headers: {
              Authorization: `Bearer ${envConfig.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
          },
        );
      } else {
        // Send using Brevo API (300 emails/day free tier - perfect for Student/Teacher)
        // Also acts as fallback if RESEND_API_KEY is not set for admin
        await this.sendEmail(email, subject, htmlTemplate);
      }
    } catch (error) {
      console.error(
        `Email API error (${role}):`,
        error.response?.data || error.message,
      );
      throw new Error('Failed to send OTP');
    }
  }

  async sendEmail(
    email: string,
    subject: string,
    htmlContent: string,
    senderName = 'Biddaneer',
  ) {
    if (envConfig.NODE_ENV === 'development') {
      console.log(`[Dev Mail] To: ${email} | Subject: ${subject}`);
      return;
    }

    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: senderName,
          email: envConfig.MAILBUX_FROM_EMAIL,
        },
        to: [{ email }],
        subject: subject,
        htmlContent: htmlContent,
      },
      {
        headers: {
          accept: 'application/json',
          'api-key': envConfig.BREVO_API_KEY,
          'content-type': 'application/json',
        },
      },
    );
  }
}
