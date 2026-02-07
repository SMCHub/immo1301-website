import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { name, email, phone } = await req.json().catch(() => ({}));

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name und E-Mail sind erforderlich." },
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const phoneLine = phone || "Nicht angegeben";

  try {
    await transporter.sendMail({
      from: `"Immo 1301 Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Neue Webseiten-Anfrage von ${name} – Immo 1301`,
      text:
        `Neue Anfrage über die Immo 1301 Webseite:\n\n` +
        `Name: ${name}\n` +
        `E-Mail: ${email}\n` +
        `Telefon: ${phoneLine}\n\n` +
        `Der Interessent möchte die Webseite erwerben.\n\n` +
        `– Automatisch gesendet über immo1301-website.vercel.app`,
      html:
        `<h2 style="color:#0f3460;">Neue Webseiten-Anfrage</h2>` +
        `<table style="border-collapse:collapse;font-family:sans-serif;">` +
        `<tr><td style="padding:8px 16px 8px 0;font-weight:bold;color:#333;">Name:</td><td style="padding:8px 0;color:#555;">${name}</td></tr>` +
        `<tr><td style="padding:8px 16px 8px 0;font-weight:bold;color:#333;">E-Mail:</td><td style="padding:8px 0;color:#555;"><a href="mailto:${email}">${email}</a></td></tr>` +
        `<tr><td style="padding:8px 16px 8px 0;font-weight:bold;color:#333;">Telefon:</td><td style="padding:8px 0;color:#555;">${phoneLine}</td></tr>` +
        `</table>` +
        `<br><p style="color:#555;">Der Interessent möchte die Webseite <strong>Immo 1301</strong> erwerben.</p>` +
        `<hr style="border:none;border-top:1px solid #eee;margin:20px 0;">` +
        `<p style="color:#999;font-size:12px;">Automatisch gesendet über immo1301-website.vercel.app</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Email konnte nicht gesendet werden." },
      { status: 500 }
    );
  }
}
