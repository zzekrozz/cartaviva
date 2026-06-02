import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, target } = await request.json();
    if (!text || !target) return NextResponse.json({ error: "Faltan texto o idioma." }, { status: 400 });

    if (process.env.TRANSLATION_PROVIDER !== "google" || !process.env.GOOGLE_TRANSLATE_API_KEY) {
      return NextResponse.json({ error: "Traducción automática no configurada. Puedes editar las traducciones manualmente." }, { status: 501 });
    }

    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, target, format: "text" })
    });
    const json = await response.json();
    if (!response.ok) return NextResponse.json({ error: json?.error?.message || "Error de Google Translate." }, { status: 400 });
    return NextResponse.json({ text: json.data?.translations?.[0]?.translatedText || text });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "No se pudo traducir." }, { status: 400 });
  }
}
