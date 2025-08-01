import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message, captchaToken } = await request.json();
    
    // Verify CAPTCHA token
    const captchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
    });

    const captchaData = await captchaResponse.json();
    console.log("CAPTCHA response:", captchaData);

    if (!captchaData.success) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Send email to business owner
    const ownerResponse = await resend.emails.send({
      from: 'noreply@soundschoolmidis.com',
      to: "schoolsound18@gmail.com",
      subject: "New message from contact form - Soundschool",
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 600px; margin: auto;">
          <h2 style="color: #6366f1;">New message from contact form</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="background: white; padding: 16px; border-radius: 4px; border-left: 4px solid #6366f1;">${message}</p>
          <p style="margin-top: 24px; color: #666; font-size: 14px;">
            This message was sent from the contact form on soundschoolmidis.com
          </p>
        </div>
      `,
    });
    console.log("Owner email response:", ownerResponse);

    if (ownerResponse.error) {
      return NextResponse.json(
        { error: 'Failed to send email to business owner' },
        { status: 500 }
      );
    }

    // Send confirmation email to the sender
    const senderResponse = await resend.emails.send({
      from: 'noreply@soundschoolmidis.com',
      to: email,
      subject: 'Thank you for your message - Soundschool',
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 600px; margin: auto;">
          <h2 style="color: #6366f1;">Thank you for your message</h2>
          <p>Hi ${name},</p>
          <p>Thank you for contacting Soundschool. We have received your message and will get back to you as soon as possible.</p>
          <p>Best regards<br>The Soundschool Team</p>
        </div>
      `,
    });
    console.log("Sender email response:", senderResponse);

    if (senderResponse.error) {
      console.error("Failed to send confirmation email:", senderResponse.error);
      // Don't fail the entire request if confirmation email fails
      // The owner still gets the message, which is the most important part
      console.log("Warning: Could not send confirmation email, but owner notification was sent successfully");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
} 