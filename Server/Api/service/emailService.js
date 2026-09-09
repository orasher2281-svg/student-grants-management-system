import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM, 
      to: to,
      subject: subject,
      html: htmlContent
    });
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};