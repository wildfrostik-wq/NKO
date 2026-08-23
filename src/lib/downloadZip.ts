import JSZip from "jszip";
import { PROJECT_FILES } from "../data/projectFiles";

/**
 * Собирает все исходники проекта в ZIP-архив прямо в браузере
 * и инициирует его скачивание. Возвращает размер архива в КБ.
 */
export async function downloadProjectZip(): Promise<number> {
  const zip = new JSZip();
  const root = zip.folder("nko-annual-report");
  if (!root) throw new Error("Не удалось создать структуру архива");

  for (const [path, content] of PROJECT_FILES) {
    root.file(path, content);
  }

  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "nko-annual-report.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);

  return Math.max(1, Math.round(blob.size / 1024));
}
