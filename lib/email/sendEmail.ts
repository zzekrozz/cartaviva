export type EmailPayload = { to: string; subject: string; html: string; text?: string };

export async function sendEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.info("Email preparado pero no enviado. Faltan RESEND_API_KEY o RESEND_FROM_EMAIL.", payload.subject);
    return { skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, ...payload })
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json?.message || "No se pudo enviar el email.");
  return json;
}
