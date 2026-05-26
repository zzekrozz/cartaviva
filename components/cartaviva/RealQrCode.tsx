"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, QrCode } from "lucide-react";

type Props = {
  value: string;
  color?: string;
  label?: string;
  fileName?: string;
  showDownload?: boolean;
};

export function RealQrCode({ value, color = "#221812", label = "QR de la carta", fileName = "qr-carta.png", showDownload = true }: Props) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function generate() {
      try {
        const dataUrl = await QRCode.toDataURL(value || "https://example.com", {
          width: 900,
          margin: 2,
          color: {
            dark: color,
            light: "#fffaf3"
          },
          errorCorrectionLevel: "M"
        });
        if (!cancelled) setSrc(dataUrl);
      } catch {
        if (!cancelled) setSrc("");
      }
    }
    generate();
    return () => {
      cancelled = true;
    };
  }, [color, value]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-52 w-52 items-center justify-center rounded-[1.4rem] bg-white p-3 shadow-sm">
        {src ? <img src={src} alt={label} className="h-full w-full object-contain" /> : <QrCode className="text-[#a08d7d]" size={80} />}
      </div>
      {showDownload && src ? (
        <a
          href={src}
          download={fileName}
          className="inline-flex items-center gap-2 rounded-full bg-[#221812] px-4 py-2 text-xs font-black text-white"
        >
          <Download size={14} /> Descargar PNG
        </a>
      ) : null}
    </div>
  );
}
