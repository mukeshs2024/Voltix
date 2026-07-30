import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, source, severity } = body;

    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: title, message' },
        { status: 400 }
      );
    }

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Assuming Gmail as requested
      auth: {
        user: process.env.GMAIL_USER, // The user's Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // The App Password
      },
    });

    const mailOptions = {
      from: `"Voltix Alerts" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Sending alert to themselves
      subject: `[Voltix Alert - ${severity || 'INFO'}] ${title}`,
      text: `Source: ${source || 'System'}\nSeverity: ${severity || 'INFO'}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 600px;">
          <h2 style="color: ${severity === 'CRITICAL' || severity === 'ERROR' ? '#e53e3e' : '#3182ce'}; margin-top: 0;">Voltix System Alert</h2>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Severity:</strong> <span style="background-color: ${severity === 'CRITICAL' || severity === 'ERROR' ? '#fed7d7' : '#ebf8ff'}; color: ${severity === 'CRITICAL' || severity === 'ERROR' ? '#c53030' : '#2b6cb0'}; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold;">${severity || 'INFO'}</span></p>
          <p><strong>Source:</strong> ${source || 'System'}</p>
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; border-left: 4px solid #a0aec0; margin-top: 20px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #718096; margin-top: 30px; border-top: 1px solid #edf2f7; padding-top: 10px;">
            Automated message from your Voltix Dashboard.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Alert email sent successfully.' });
  } catch (error: any) {
    console.error('Error sending alert email:', error);
    return NextResponse.json(
      { error: 'Failed to send alert email', details: error.message },
      { status: 500 }
    );
  }
}
