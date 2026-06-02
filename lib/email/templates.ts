import { BRAND_NAME } from "@/lib/brand";
import type { EmailPayload } from "@/lib/email/sendEmail";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function frame(brandName: string, title: string, body: string, ctaText = "Abrir panel", ctaUrl = `${appUrl}/dashboard`) {
  return `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;padding:28px;background:#fffaf3;color:#221812"><div style="background:white;border-radius:24px;padding:28px;border:1px solid #eadfce"><p style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#e85d04;font-weight:700">${brandName}</p><h1 style="font-size:28px;margin:8px 0 12px">${title}</h1><div style="line-height:1.7;color:#6b594a">${body}</div><a href="${ctaUrl}" style="display:inline-block;margin-top:18px;background:#221812;color:white;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:700">${ctaText}</a></div></div>`;
}

function base(to: string, subject: string, title: string, body: string, ctaText?: string, ctaUrl?: string): EmailPayload {
  return {
    to,
    subject,
    text: `${title}\n\n${body.replace(/<[^>]*>/g, " ")}\n\n${ctaUrl || appUrl}`,
    html: frame(BRAND_NAME, title, body, ctaText, ctaUrl)
  };
}

export const welcomeEmail = (to: string) => base(to, `Bienvenido a ${BRAND_NAME}: empieza tu carta digital`, `Bienvenido a ${BRAND_NAME}`, "Ya puedes crear tu carta digital, añadir productos, publicar tu QR y compartirla con clientes.");
export const menuPublishedEmail = (to: string, url: string) => base(to, "Tu carta digital ya está publicada", "Carta publicada", `Tu carta ya está visible. Enlace: ${url}`, "Ver carta", url);
export const proposalEmail = (to: string, url: string) => base(to, "Hemos preparado una propuesta de carta digital", "Propuesta lista", `Hemos preparado una vista de ejemplo para tu restaurante. Puedes verla aquí: ${url}`, "Ver propuesta", url);
export const trialStartedEmail = (to: string, plan: string) => base(to, `Tu prueba de ${BRAND_NAME} ya está activa`, "Prueba activa", `Has iniciado la prueba del plan ${plan}.`);
export const trialEndingEmail = (to: string) => base(to, "Tu prueba termina pronto", "Tu prueba termina pronto", "Puedes continuar con el plan elegido o volver al plan gratis permanente.");
export const subscriptionActiveEmail = (to: string, plan: string) => base(to, `Tu plan de ${BRAND_NAME} está activo`, "Suscripción activa", `Tu plan ${plan || "seleccionado"} está activo.`);
export const paymentFailedEmail = (to: string) => base(to, "No hemos podido procesar tu pago", "Pago fallido", "Revisa tu método de pago desde el portal de Stripe para mantener tu carta activa.");
export const discountReminderEmail = (to: string) => base(to, "Últimos días para activar el 50% durante 3 meses", "Oferta de bienvenida", "Activa tu plan antes de que termine la prueba y conserva el 50% durante 3 meses.");
export const quarterlyPlanActiveEmail = (to: string, plan: string) => base(to, "Tu plan trimestral está activo", "Plan trimestral activo", `Has activado ${plan}: paga 2 meses y usa 3.`);
export const yearlyPlanActiveEmail = (to: string, plan: string) => base(to, "Tu plan anual está activo", "Plan anual activo", `Has activado ${plan}: paga 10 meses y usa 12.`);

export function setupRequestReceivedEmail({ brandName, restaurantName }: { brandName: string; restaurantName: string }) {
  return frame(brandName, "Hemos recibido tu solicitud", `Tenemos la solicitud de montaje para <strong>${restaurantName}</strong>. Te contactaremos para preparar la carta digital, revisar fotos y organizar el QR.`, "Abrir MesaCarta", appUrl);
}

export function setupRequestAdminEmail({ brandName, payload }: { brandName: string; payload: Record<string, string> }) {
  const rows = Object.entries(payload).map(([key, value]) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;font-weight:700">${key}</td><td style="padding:6px 10px;border-bottom:1px solid #eee">${value || "-"}</td></tr>`).join("");
  return frame(brandName, "Nueva solicitud de montaje", `<table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>`, "Abrir dashboard", `${appUrl}/dashboard`);
}
