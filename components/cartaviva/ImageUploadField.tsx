"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";
import { compressImage, formatBytes, safeFileName, type ImageUploadContext } from "@/lib/image-tools";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  uploadContext?: ImageUploadContext;
  maxWidth?: number;
  disabled?: boolean;
  disabledMessage?: string;
};

export function ImageUploadField({ label, value, onChange, hint, uploadContext, maxWidth = 1600, disabled = false, disabledMessage }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleFile(file?: File) {
    if (disabled) {
      setError(disabledMessage || "Las fotos no están disponibles en este plan.");
      return;
    }
    if (!file) return;
    setBusy(true);
    setError("");
    setMessage("Comprimiendo imagen...");

    try {
      const compressed = await compressImage(file, maxWidth);
      setMessage(`Optimizada: ${formatBytes(compressed.originalBytes)} → ${formatBytes(compressed.compressedBytes)}`);

      const canUpload = uploadContext?.restaurantId && hasSupabaseConfig();
      if (!canUpload) {
        onChange(compressed.dataUrl);
        setMessage(`${formatBytes(compressed.compressedBytes)} · vista previa local. Guarda con cuenta para subirla a la nube.`);
        return;
      }

      setMessage("Subiendo a Supabase Storage...");
      const supabase = createBrowserSupabaseClient();
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) throw new Error("Inicia sesión para subir imágenes.");

      const folder = uploadContext.folder || "general";
      const filename = `${Date.now()}-${safeFileName(file.name)}.${compressed.extension}`;
      const path = `${authData.user.id}/${uploadContext.restaurantId}/${folder}/${filename}`;
      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(path, compressed.blob, { contentType: compressed.mimeType, upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from("menu-images").getPublicUrl(path);
      onChange(publicData.publicUrl);
      setMessage(`Subida y optimizada: ${formatBytes(compressed.originalBytes)} → ${formatBytes(compressed.compressedBytes)}`);
    } catch (err: any) {
      setError(err?.message || "No se pudo subir la imagen.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-[1.6rem] border border-[#eadfce] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#221812]">{label}</p>
          {hint ? <p className="mt-1 text-xs font-semibold leading-5 text-[#8a796a]">{hint}</p> : null}
        </div>
        {value ? (
          <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-600">
            <X size={13} /> Quitar
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[140px_1fr]">
        <div className="overflow-hidden rounded-[1.2rem] border border-[#eadfce] bg-[#fff7ee]">
          {value ? (
            <img src={value} alt="" className="h-32 w-full object-cover" />
          ) : (
            <div className="flex h-32 flex-col items-center justify-center text-center text-xs font-black uppercase tracking-[0.18em] text-[#a08d7d]">
              <ImageIcon size={24} className="mb-2" /> Sin foto
            </div>
          )}
        </div>

        <div className="space-y-3">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
          <button
            type="button"
            disabled={busy}
            onClick={() => disabled ? setError(disabledMessage || "Las fotos no están disponibles en este plan.") : inputRef.current?.click()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[1.2rem] bg-[#221812] px-4 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            {disabled ? "Fotos no disponibles en este plan" : busy ? "Procesando..." : "Subir foto"}
          </button>
          <input
            value={value}
            onChange={(event) => disabled ? setError(disabledMessage || "Las fotos no están disponibles en este plan.") : onChange(event.target.value)}
            placeholder={disabled ? "Disponible desde un plan compatible" : "O pega una URL de imagen"}
            className="w-full rounded-[1.2rem] border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-xs font-semibold outline-none focus:border-[#e85d04]"
          />
          {disabled && disabledMessage ? <p className="text-xs font-bold leading-5 text-[#a3581c]">{disabledMessage}</p> : null}
          {message ? <p className="text-xs font-bold leading-5 text-[#6b594a]">{message}</p> : null}
          {error ? <p className="text-xs font-bold leading-5 text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
