import nodemailer from 'nodemailer';
import 'dotenv/config';

export const transporter = nodemailer.createTransport({
  service: 'gmail', // O Nodemailer já sabe as portas e hosts do Gmail automaticamente
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log('📧 Serviço de E-mail (Gmail) configurado e pronto para envio.');