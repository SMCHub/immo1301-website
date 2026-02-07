import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Immo 1301 Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Kaufanfrage – immo1301.ch Webseite",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
          <h2 style="color:#0f3460;">Neue Kaufanfrage</h2>
          <p>Jemand hat Interesse an der Webseite <strong>immo1301.ch</strong> gezeigt und möchte diese erwerben.</p>
          <p style="color:#666;font-size:14px;">Gesendet über den Verkaufsbanner auf der Webseite.</p>
        </div>
      `,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
