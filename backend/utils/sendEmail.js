const nodemailer = require('nodemailer');

const sendEmailNotification = async ({ senderName, email, subject, message }) => {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.log('[EMAIL] SMTP credentials not set, skipping notification delivery.');
    return;
  }

  try {
    // Explicit SMTP configuration with SSL Port 465 for Render & Cloud compatibility
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465 (SSL)
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD.replace(/\s+/g, ''), // Strip spaces if present
      },
      connectionTimeout: 10000, // 10 seconds timeout
    });

    const mailOptions = {
      from: `"Portfolio Hub" <${process.env.SMTP_EMAIL}>`,
      to: process.env.ADMIN_NOTIFY_EMAIL || process.env.SMTP_EMAIL,
      replyTo: email,
      subject: `[New Inquiry] ${subject || 'Portfolio Message'} - ${senderName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1e293b; border-radius: 12px; background-color: #020617; color: #f8fafc;">
          <h2 style="color: #10b981; border-bottom: 1px solid #334155; padding-bottom: 10px;">New Message from Portfolio Hub</h2>
          <p><strong>Sender Name:</strong> ${senderName}</p>
          <p><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #38bdf8;">${email}</a></p>
          <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
          <div style="background-color: #0f172a; padding: 15px; border-radius: 8px; border: 1px solid #334155; margin-top: 15px;">
            <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.5;">${message}</p>
          </div>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 20px;">Direct reply is enabled via your email client.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] New inquiry notification delivered successfully.`);
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send notification email: ${error.message}`);
  }
};

module.exports = sendEmailNotification;