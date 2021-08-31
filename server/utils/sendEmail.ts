const nodemailer = require('nodemailer');

import {
  smtpHost,
  smtpPort,
  smtpEmail,
  smtpPassword,
  fromName,
  fromEmail,
} from '../config/keys';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
  });

  const message = {
    from: `${fromName} <${fromEmail}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
