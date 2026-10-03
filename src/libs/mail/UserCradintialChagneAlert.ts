import { MailService } from './mail.service';

/**
 * Helper to simulate SMS alerts (demo ready)
 */
function sendSmsMock(phoneNumber: string, message: string) {
  console.log(`[SMS Alert MOCK] Sending SMS to ${phoneNumber}: "${message}"`);
}

/**
 * HTML Template generator for security alerts
 */
function getAlertTemplate(title: string, message: string): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Alert - Biddaneer</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 40px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <!-- Top Accent Bar -->
            <tr>
              <td height="6" style="background-image: linear-gradient(90deg, #ef4444 0%, #b91c1c 100%); background-color: #ef4444;"></td>
            </tr>
            <!-- Body Content -->
            <tr>
              <td style="padding: 40px 35px 30px 35px;">
                <!-- Header / Logo -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                  <tr>
                    <td align="center">
                      <span style="font-size: 26px; font-weight: 800; color: #b91c1c; letter-spacing: 0.5px;">Biddaneer</span>
                      <div style="font-size: 11px; font-weight: 600; color: #d97706; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Security Alert</div>
                    </td>
                  </tr>
                </table>
                
                <!-- Title -->
                <h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700; color: #0f172a; text-align: center;">${title}</h2>
                <p style="margin: 0 0 25px 0; font-size: 14px; line-height: 1.6; color: #475569; text-align: center;">${message}</p>
                
                <!-- Notice Box -->
                <p style="margin: 0 0 30px 0; font-size: 12px; line-height: 1.5; color: #64748b; text-align: center; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 10px; padding: 12px;">আপনি যদি এই পরিবর্তনটি না করে থাকেন, দয়া করে অবিলম্বে আমাদের সাপোর্ট টিমে যোগাযোগ করুন বা আপনার পাসওয়ার্ড পরিবর্তন করুন।</p>
                
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 25px;">
                
                <!-- Help and Support -->
                <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #94a3b8; text-align: center;">যেকোনো সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন <a href="mailto:support@biddaneer.com" style="color: #ef4444; text-decoration: none; font-weight: 600;">support@biddaneer.com</a> এ।</p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding: 20px 35px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="margin: 0; font-size: 11px; color: #94a3b8;">&copy; 2026 Biddaneer. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Send password change alert
 */
export async function sendPasswordChangeAlert(
  mailService: MailService,
  email: string,
  phoneNumber?: string,
  name?: string,
) {
  const tutorName = name || 'ব্যবহারকারী';
  const emailTitle = 'পাসওয়ার্ড পরিবর্তনের অ্যালার্ট';
  const emailMessage = `প্রিয় ${tutorName}, আপনার অ্যাকাউন্টের পাসওয়ার্ড সম্প্রতি পরিবর্তন করা হয়েছে। নিরাপত্তা নিশ্চিত করতে আমরা আপনাকে অবহিত করছি।`;

  // Send Email Alert
  const htmlContent = getAlertTemplate(emailTitle, emailMessage);
  await mailService.sendEmail(
    email,
    'Security Alert: Password Changed',
    htmlContent,
    'Biddaneer Security',
  );

  // Send SMS Alert
  if (phoneNumber) {
    const smsMessage = `Biddaneer Security: Dear ${tutorName}, your account password has been changed. If you did not make this change, contact support immediately.`;
    sendSmsMock(phoneNumber, smsMessage);
  }
}

/**
 * Send email change alert
 */
export async function sendEmailChangeAlert(
  mailService: MailService,
  oldEmail: string,
  newEmail: string,
  phoneNumber?: string,
  name?: string,
) {
  const tutorName = name || 'ব্যবহারকারী';
  const emailTitle = 'ইমেইল ঠিকানা পরিবর্তনের অ্যালার্ট';
  const emailMessage = `প্রিয় ${tutorName}, আপনার অ্যাকাউন্টের পূর্ববর্তী ইমেইল ঠিকানা (${oldEmail}) পরিবর্তন করে নতুন ইমেইল ঠিকানা (${newEmail}) সেট করা হয়েছে।`;

  // Send Email Alert to the PREVIOUS email
  const htmlContent = getAlertTemplate(emailTitle, emailMessage);
  await mailService.sendEmail(
    oldEmail,
    'Security Alert: Email Address Changed',
    htmlContent,
    'Biddaneer Security',
  );

  // Send SMS Alert to tutor's phone
  if (phoneNumber) {
    const smsMessage = `Biddaneer Security: Dear ${tutorName}, your account email has been changed from ${oldEmail} to ${newEmail}. If you did not make this change, contact support.`;
    sendSmsMock(phoneNumber, smsMessage);
  }
}

/**
 * Send phone change alert
 */
export async function sendPhoneChangeAlert(
  mailService: MailService,
  email: string,
  oldPhone: string,
  newPhone: string,
  name?: string,
) {
  const tutorName = name || 'ব্যবহারকারী';
  const emailTitle = 'মোবাইল নম্বর পরিবর্তনের অ্যালার্ট';
  const emailMessage = `প্রিয় ${tutorName}, আপনার অ্যাকাউন্টের পূর্ববর্তী মোবাইল নম্বর (${oldPhone}) পরিবর্তন করে নতুন মোবাইল নম্বর (${newPhone}) সেট করা হয়েছে।`;

  // Send Email Alert to user's email
  const htmlContent = getAlertTemplate(emailTitle, emailMessage);
  await mailService.sendEmail(
    email,
    'Security Alert: Phone Number Changed',
    htmlContent,
    'Biddaneer Security',
  );

  // Send SMS Alert to the PREVIOUS phone number
  const smsMessage = `Biddaneer Security: Dear ${tutorName}, your account phone number has been changed from ${oldPhone} to ${newPhone}. If you did not make this change, contact support.`;
  sendSmsMock(oldPhone, smsMessage);
}
