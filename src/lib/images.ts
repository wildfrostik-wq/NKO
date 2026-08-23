/** Читает файл изображения, сжимает его через canvas и возвращает dataURL. */
export function fileToDataUrl(
  file: File,
  maxSide = 1400,
  quality = 0.85,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        if (scale >= 1) {
          resolve(raw);
          return;
        }
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(raw);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch {
          resolve(raw);
        }
      };
      img.onerror = () => reject(new Error("bad image"));
      img.src = raw;
    };
    reader.onerror = () => reject(new Error("read error"));
    reader.readAsDataURL(file);
  });
}

export function approxDataUrlKb(dataUrl: string): number {
  return Math.round((dataUrl.length * 3) / 4 / 1024);
}
