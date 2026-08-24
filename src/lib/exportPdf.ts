import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

/** Предзагружает локальные шрифты, чтобы canvas гарантированно отрисовал их. */
async function ensureFonts(): Promise<void> {
  const doc = document as Document & { fonts?: FontFaceSet };
  if (!doc.fonts) return;
  const specs = [
    '500 20px "Unbounded"',
    '700 20px "Unbounded"',
    '800 20px "Unbounded"',
    '400 20px "Lora"',
    'italic 400 20px "Lora"',
    '600 20px "Lora"',
    '700 20px "Lora"',
    'italic 700 20px "Lora"',
    '400 20px "Golos Text"',
    '500 20px "Golos Text"',
    '600 20px "Golos Text"',
    '700 20px "Golos Text"',
    '800 20px "Golos Text"',
  ];
  try {
    await Promise.all(specs.map((s) => doc.fonts!.load(s)));
    await doc.fonts.ready;
  } catch {
    /* продолжим с теми шрифтами, что есть */
  }
}

export interface BuildResult {
  pdf: jsPDF;
  saved: number;
  failed: number;
}

/**
 * Рендерит страницы отчёта (div.report-page) в многостраничный PDF A4.
 * Возвращает сам документ: вызывающий код решает, как его сохранить
 * (обычное скачивание в браузере или системный диалог ВКонтакте).
 */
export async function buildReportPdf(
  container: HTMLElement,
  onPage?: (page: number, total: number) => void,
): Promise<BuildResult> {
  const pages = Array.from(container.querySelectorAll<HTMLElement>(".report-page"));
  if (pages.length === 0) throw new Error("Нет страниц для экспорта");

  await ensureFonts();

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  let failed = 0;

  for (let i = 0; i < pages.length; i++) {
    onPage?.(i + 1, pages.length);
    // даём браузеру «продышаться» между тяжёлыми кадрами
    await new Promise((r) => window.setTimeout(r, 40));
    try {
      const canvas = await html2canvas(pages[i], {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: false,
        logging: false,
        windowWidth: 794,
      });
      const img = canvas.toDataURL("image/jpeg", 0.93);
      if (i > 0) pdf.addPage();
      pdf.addImage(img, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    } catch (err) {
      failed += 1;
      console.warn(`Страница ${i + 1} не отрендерилась:`, err);
      if (i > 0) pdf.addPage();
    }
  }

  if (failed >= pages.length) throw new Error("Ни одна страница не отрендерилась");
  return { pdf, saved: pages.length - failed, failed };
}

export function sanitizeFileName(s: string): string {
  return (
    s
      .replace(/[«»"']/g, "")
      .replace(/[\\/:*?"<>|]+/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .slice(0, 60) || "НКО"
  );
}
