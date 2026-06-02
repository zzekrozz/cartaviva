import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { welcomeEmail } from "@/lib/email/templates";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Solo disponible en desarrollo." }, { status: 403 });
  const { to } = await request.json();
  if (!to) return NextResponse.json({ error: "Falta destinatario." }, { status: 400 });
  const result = await sendEmail(welcomeEmail(to));
  return NextResponse.json({ ok: true, result });
}
