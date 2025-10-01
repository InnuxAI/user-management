import nodemailer from 'nodemailer';

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Innux - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #333;">Your verification code is:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #4f46e5; letter-spacing: 8px; background-color: white; padding: 10px 20px; border-radius: 8px; border: 2px dashed #4f46e5;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #666;">
              This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </p>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center;">
            © 2025 Innux AI. All rights reserved.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

// Send admin email to users
export async function sendAdminEmail(email: string, subject: string, body: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="color: #dc3545; margin-top: 0;">Message from Administrator</h3>
            <div style="background-color: white; padding: 15px; border-radius: 6px;">
              ${body.split('\n').map(line => `<p style="margin: 10px 0;">${line}</p>`).join('')}
            </div>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center;">
            © 2025 Innux AI. All rights reserved.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Admin email sending error:', error);
    return false;
  }
}

// Check if email is Gmail
export function isGmailEmail(email: string): boolean {
  return email.toLowerCase().endsWith('@gmail.com');
}
