import { useEffect, useRef, useState } from "react";
import { useReport } from "../../state/ReportContext";
import { Button, useToast } from "../ui";
import { Icon } from "../icons";
import { ReportDocument, countPages, PAGE_W, PAGE_H } from "../report/ReportDocument";
import { buildReportPdf, sanitizeFileName } from "../../lib/exportPdf";
import { downloadProjectZip } from "../../lib/downloadZip";
import { isVkEmbedded, vkDownloadFile, vkOpenPostBox } from "../../lib/vk";
import type { VkUser } from "../../lib/vk";
import type { StepId } from "../../types";

export function PreviewStep({
  goTo,
  vkUser,
}: {
  goTo: (s: StepId) => void;
  vkUser: VkUser | null;
}) {
  const { data, progress } = useReport();
  const { push } = useToast();
  const deskRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(true);
  const [scale, setScale] = useState(0.75);
  const [exporting, setExporting] = useState<{ page: number; total: number } | null>(null);
  const [zipping, setZipping] = useState(false);

  const onDownloadZip = async () => {
    if (zipping) return;
    setZipping(true);
    try {
      const kb = await downloadProjectZip();
      push(`Архив проекта скачан (≈ ${kb} КБ): nko-annual-report.zip`);
    } catch (err) {
      console.error(err);
      push("Не удалось собрать архив — попробуйте ещё раз", "warn");
    } finally {
      setZipping(false);
    }
  };

  const pages = countPages(data);
  const gap = 40;
  const docH = pages * PAGE_H + (pages - 1) * gap;

  useEffect(() => {
    if (!fit || !deskRef.current) return;
    const el = deskRef.current;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(1, (el.clientWidth - 48) / PAGE_W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit]);

  const zoom = (delta: number) => {
    setFit(false);
    setScale((s) => Math.min(1.25, Math.max(0.35, Math.round((s + delta) * 100) / 100)));
  };

  const onExport = async () => {
    if (exporting || !exportRef.current) return;
    setExporting({ page: 1, total: pages });
    try {
      const name = `${sanitizeFileName(data.org.shortName || data.org.name)}_годовой_отчет_${
        data.year || "2025"
      }.pdf`;
      const res = await buildReportPdf(exportRef.current, (page, total) =>
        setExporting({ page, total }),
      );
      // внутри ВК отдаём файл системному диалогу загрузки, иначе — обычное скачивание
      if (isVkEmbedded()) {
        const ok = await vkDownloadFile(res.pdf.output("datauristring"), name);
        if (!ok) {
          res.pdf.save(name);
          push("Диалог ВК недоступен — файл сохранён стандартным способом", "warn");
        }
      } else {
        res.pdf.save(name);
      }
      const n = res.saved;
      push(
        res.failed > 0
          ? `PDF сохранён, но ${res.failed} стр. не отрендерились (проблема с фото)`
          : `PDF готов: ${n} ${n === 1 ? "страница" : n < 5 ? "страницы" : "страниц"}`,
        res.failed > 0 ? "warn" : "ok",
      );
    } catch (err) {
      console.error(err);
      push("Не удалось сформировать PDF — попробуйте ещё раз", "warn");
    } finally {
      setExporting(null);
    }
  };

  const onPublish = async () => {
    const orgName = data.org.shortName || data.org.name || "нашей организации";
    const text = `Годовой отчёт ${orgName} за ${data.year || "этот"} год готов. PDF-версия отчёта прикреплена к этому посту.`;
    const ok = await vkOpenPostBox(text);
    if (ok) push("Окно поста открыто — прикрепите скачанный PDF");
    else push("Не удалось открыть окно поста", "warn");
  };

  return (
    <div className="anim-fade-up space-y-4">
      {/* панель инструментов */}
      <div className="card-shadow sticky top-[57px] z-20 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-card/95 px-4 py-3 backdrop-blur lg:top-3">
        <div className="mr-auto flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pine-800 text-gold-400">
            <Icon name="file" className="h-4.5 w-4.5" strokeWidth={1.9} />
          </span>
          <div>
            <div className="text-[13.5px] font-bold leading-tight text-ink-900">Предпросмотр отчёта</div>
            <div className="text-[11px] font-medium text-ink-400">
              {pages} {pages === 1 ? "страница" : pages < 5 ? "страницы" : "страниц"} · формат А4
            </div>
          </div>
        </div>

        {progress < 100 && (
          <span className="flex items-center gap-1.5 rounded-full border border-gold-400/60 bg-gold-50 px-3 py-1.5 text-[11px] font-bold text-gold-700">
            <Icon name="alert" className="h-3.5 w-3.5" strokeWidth={2.2} />
            Заполнено {progress}% разделов
          </span>
        )}

        <div className="flex items-center rounded-lg border border-line bg-white p-0.5">
          <button
            onClick={() => zoom(-0.15)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 transition-colors hover:bg-pine-50 hover:text-pine-800"
            aria-label="Уменьшить"
          >
            <span className="text-[16px] font-bold leading-none">−</span>
          </button>
          <button
            onClick={() => setFit(false)}
            className="h-8 min-w-[52px] rounded-md px-1 text-[12px] font-bold tabular-nums text-ink-700 transition-colors hover:bg-pine-50"
            title="Масштаб"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={() => zoom(0.15)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-500 transition-colors hover:bg-pine-50 hover:text-pine-800"
            aria-label="Увеличить"
          >
            <span className="text-[16px] font-bold leading-none">+</span>
          </button>
          <button
            onClick={() => setFit(true)}
            className={`h-8 rounded-md px-2.5 text-[11px] font-bold transition-colors ${
              fit ? "bg-pine-800 text-pine-50" : "text-ink-500 hover:bg-pine-50 hover:text-pine-800"
            }`}
          >
            По ширине
          </button>
        </div>

        <Button variant="gold" icon={exporting ? "reset" : "download"} onClick={onExport} disabled={!!exporting || zipping}>
          {exporting ? `Стр. ${exporting.page} / ${exporting.total}` : "Скачать PDF"}
        </Button>
        <Button
          variant="outline"
          icon={zipping ? "reset" : "file"}
          onClick={onDownloadZip}
          disabled={zipping || !!exporting}
          title="Скачать исходники проекта архивом ZIP"
        >
          {zipping ? "Собираем…" : "Проект (ZIP)"}
        </Button>
        {vkUser && (
          <Button
            variant="dark"
            icon="users"
            onClick={onPublish}
            disabled={!!exporting || zipping}
            title="Открыть окно нового поста ВКонтакте — останется прикрепить скачанный PDF"
          >
            В сообщество
          </Button>
        )}
      </div>

      {/* «стол» с листами */}
      <div ref={deskRef} className="desk-dark overflow-x-auto rounded-2xl border border-pine-800/60 p-6 sm:p-8">
        <div className="mx-auto" style={{ width: PAGE_W * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", height: docH * scale }}>
            <div style={{ height: docH }}>
              <ReportDocument data={data} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[12px] font-medium text-ink-400">
          <Icon name="eye" className="h-4 w-4 text-pine-600" strokeWidth={1.9} />
          Так отчёт будет выглядеть в PDF: страницы, таблицы и фотографии уже свёрстаны.
        </p>
        <Button variant="outline" small icon="pen" onClick={() => goTo("org")}>
          Редактировать данные
        </Button>
      </div>

      {/* полноразмерная копия для экспорта (за экраном) */}
      <div
        ref={exportRef}
        aria-hidden="true"
        style={{ position: "fixed", left: -10000, top: 0, width: PAGE_W, pointerEvents: "none" }}
      >
        <ReportDocument data={data} />
      </div>

      {/* оверлей прогресса */}
      {exporting && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-pine-950/70 p-4 backdrop-blur-[3px]">
          <div className="anim-pop w-full max-w-sm rounded-2xl border border-pine-800 bg-pine-900 p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500 text-pine-950">
              <Icon name="file" className="h-6 w-6 animate-pulse" strokeWidth={1.9} />
            </div>
            <div className="font-display text-[15px] font-bold text-pine-50">Формируем PDF…</div>
            <p className="mt-1.5 text-[12.5px] font-medium text-pine-300">
              Обрабатываем страницу {exporting.page} из {exporting.total}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-pine-800">
              <div
                className="h-full rounded-full bg-gold-500 transition-all duration-300"
                style={{ width: `${(exporting.page / exporting.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
