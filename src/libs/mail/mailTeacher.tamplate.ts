export const getTeacherOtpTemplate = (otp: string): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biddaneer Teacher Verification Code</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 40px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
            <!-- Top Accent Bar -->
            <tr>
              <td height="6" style="background-image: linear-gradient(90deg, #10b981 0%, #047857 100%); background-color: #059669;"></td>
            </tr>
            <!-- Body Content -->
            <tr>
              <td style="padding: 40px 35px 30px 35px;">
                <!-- Header / Logo -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                  <tr>
                    <td align="center">
                      <span style="font-size: 26px; font-weight: 800; color: #047857; letter-spacing: 0.5px;">Biddaneer</span>
                      <div style="font-size: 11px; font-weight: 600; color: #d97706; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Teacher Portal</div>
                    </td>
                  </tr>
                </table>
                
                <!-- Greeting & Instruction -->
                <h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700; color: #0f172a; text-align: center;">ইমেইল ভেরিফিকেশন কোড</h2>
                <p style="margin: 0 0 25px 0; font-size: 14px; line-height: 1.6; color: #475569; text-align: center; font-family: 'Inter', 'Kalpurush', sans-serif;">Biddaneer প্ল্যাটফর্মে শিক্ষক হিসেবে যুক্ত হওয়ার জন্য আপনাকে অভিনন্দন। আপনার শিক্ষক প্রোফাইলটি ভেরিফাই করতে নিচের ওটিপি (OTP) কোডটি ব্যবহার করুন।</p>
                
                <!-- OTP Box -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                  <tr>
                    <td align="center">
                      <div style="background-color: #ecfdf5; border: 1px dashed #a7f3d0; border-radius: 12px; padding: 20px 30px; display: inline-block;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #059669; text-shadow: 0 1px 1px rgba(0,0,0,0.05);">${otp}</span>
                      </div>
                    </td>
                  </tr>
                </table>
                
                <!-- Expiry Note -->
                <p style="margin: 0 0 30px 0; font-size: 12px; line-height: 1.5; color: #64748b; text-align: center;">এই ওটিপি কোডটির মেয়াদ মাত্র <strong style="color: #ef4444;">৩ মিনিট</strong>।<br>আপনি যদি এই রিকোয়েস্টটি না করে থাকেন, তবে এই ইমেইলটি উপেক্ষা করুন।</p>
                
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 25px;">
                
                <!-- Help and Support -->
                <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #94a3b8; text-align: center;">যেকোনো সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন <a href="mailto:support@biddaneer.com" style="color: #10b981; text-decoration: none; font-weight: 600;">support@biddaneer.com</a> এ।</p>
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
};
