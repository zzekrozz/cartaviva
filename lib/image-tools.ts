export type ImageUploadContext = {
  restaurantId?: string;
  folder: string;
};

export type CompressedImage = {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  originalBytes: number;
  compressedBytes: number;
  mimeType: string;
  extension: string;
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo leer la imagen. Prueba con JPG, PNG o WebP."));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error("No se pudo comprimir la imagen."));
      else resolve(blob);
    }, mimeType, quality);
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo preparar la vista previa."));
    reader.readAsDataURL(blob);
  });
}

export async function compressImage(file: File, maxWidth = 1600, quality = 0.82): Promise<CompressedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen.");
  }

  const image = await loadImage(file);
  const ratio = Math.min(1, maxWidth / image.width);
  const width = Math.max(1, Math.round(image.width * ratio));
  const height = Math.max(1, Math.round(image.height * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("El navegador no permite comprimir esta imagen.");

  ctx.drawImage(image, 0, 0, width, height);

  let mimeType = "image/webp";
  let blob = await canvasToBlob(canvas, mimeType, quality);
  if (!blob.type || blob.type !== "image/webp") {
    mimeType = "image/jpeg";
    blob = await canvasToBlob(canvas, mimeType, quality);
  }

  const dataUrl = await blobToDataUrl(blob);
  return {
    blob,
    dataUrl,
    width,
    height,
    originalBytes: file.size,
    compressedBytes: blob.size,
    mimeType,
    extension: mimeType === "image/webp" ? "webp" : "jpg"
  };
}

export function formatBytes(bytes: number) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function safeFileName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "imagen";
}
