import dotenv from 'dotenv';
import { Resend } from 'resend';
dotenv.config();

// יצירת המופע
const resend = new Resend(process.env.RESEND_API_KEY);

// ייצוא מודרני
export default resend;