import { useEffect, useState } from "react";
import { ReportProvider, useReport } from "./state/ReportContext";
import { initVk } from "./lib/vk";
import type { VkUser } from "./lib/vk";
import { ToastProvider, Button, Modal, useToast } from "./components/ui";
import { Icon } from "./components/icons";
import { Sidebar, MobileSteps, STEPS } from "./components/Sidebar";
import { OrgStep } from "./components/steps/OrgStep";
import { MetricsStep } from "./components/steps/MetricsStep";
import { FinanceStep } from "./components/steps/FinanceStep";
import { ProgramsStep } from "./components/steps/ProgramsStep";
import { TeamStep } from "./components/steps/TeamStep";
import { PhotosStep } from "./components/steps/PhotosStep";
import { PreviewStep } from "./components/steps/PreviewStep";
import { downloadProjectZip } from "./lib/downloadZip";
import type { StepId } from "./types";

function SaveBadge() {
  const { saveState } = useReport();
  if (saveState === "saving") {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-bold text-ink-400">
        <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
        Сохраняем…
      </span>
    );
  }
  if (saveState === "error") {
    return (
      <span
        className="flex items-center gap-1.5 rounded-full border border-clay-100 bg-clay-50 px-3 py-1.5 text-[11px] font-bold text-clay-700"
        title="Данные не помещаются в локальное хранилище — обычно из-за больших фотографий"
      >
        <Icon name="alert" className="h-3.5 w-3.5" strokeWidth={2.2} />
        Автосохранение ограничено
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-pine-200 bg-pine-50 px-3 py-1.5 text-[11px] font-bold text-pine-700">
      <span className="save-dot h-1.5 w-1.5 rounded-full bg-pine-500" />
      Автосохранение включено
    </span>
  );
}

function useZipDownload() {
  const { push } = useToast();
  const [zipping, setZipping] = useState(false);
  const onZip = async () => {
    if (zipping) return;
    setZipping(true);
    try {
      const kb = await downloadProjectZip();
      push(`Архив проекта скачан (≈ ${kb} КБ)`);
    } catch (err) {
      console.error(err);
      push("Не удалось собрать архив", "warn");
    } finally {
      setZipping(false);
    }
  };
  return { zipping, onZip };
}

function Shell() {
  const { data, completion, progress, isPristine, loadDemo, resetAll } = useReport();
  const { push } = useToast();
  const { zipping, onZip } = useZipDownload();
  const [step, setStep] = useState<StepId>("org");
  const [resetOpen, setResetOpen] = useState(false);
  const [welcomeGone, setWelcomeGone] = useState(false);
  const [vkUser, setVkUser] = useState<VkUser | null>(null);

  useEffect(() => {
    let alive = true;
    initVk().then((u) => {
      if (alive) setVkUser(u);
    });
    return () => {
      alive = false;
    };
  }, []);

  const idx = STEPS.findIndex((s) => s.id === step);
  const prev = idx > 0 ? STEPS[idx - 1] : null;
  const next = idx < STEPS.length - 1 ? STEPS[idx + 1] : null;

  const goNext = () => next && setStep(next.id);
  const goPrev = () => prev && setStep(prev.id);

  return (
    <div className="min-h-screen">
      <Sidebar
        step={step}
        setStep={setStep}
        completion={completion}
        progress={progress}
        orgName={data.org.shortName || data.org.name}
      />
      <MobileSteps step={step} setStep={setStep} completion={completion} />

      <main className="lg:pl-[276px]">
        {/* верхняя панель */}
        <header className="sticky top-0 z-30 hidden border-b border-line/80 bg-paper/85 backdrop-blur lg:block">
          <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-8 py-3">
            <div className="mr-auto">
              <div className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-gold-600">
                Шаг {idx + 1} из {STEPS.length}
              </div>
              <div className="font-display text-[15px] font-bold leading-tight text-ink-900">
                {STEPS[idx].title}
              </div>
            </div>
            <SaveBadge />
            {vkUser && (
              <span
                className="flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3"
                title="Мини-приложение запущено внутри ВКонтакте"
              >
                {vkUser.photo_100 ? (
                  <img src={vkUser.photo_100} alt="" className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pine-800 text-[10px] font-extrabold text-gold-400">
                    {vkUser.first_name?.[0] ?? "В"}
                  </span>
                )}
                <span className="text-[11px] font-bold text-ink-700">ВК: {vkUser.first_name}</span>
              </span>
            )}
            <Button
              variant="outline"
              small
              icon="spark"
              onClick={() => {
                loadDemo();
                setStep("preview");
                setWelcomeGone(true);
                push("Демо-данные загружены — посмотрите раздел «Отчёт и PDF»");
              }}
            >
              Демо-данные
            </Button>
            <Button variant="danger" small icon="reset" onClick={() => setResetOpen(true)}>
              Очистить
            </Button>
            <Button
              variant="outline"
              small
              icon={zipping ? "reset" : "download"}
              onClick={onZip}
              disabled={zipping}
              title="Скачать все исходники проекта одним ZIP-архивом"
            >
              {zipping ? "Собираем…" : "Проект (ZIP)"}
            </Button>
            <Button icon="file" onClick={() => setStep("preview")}>
              К отчёту
            </Button>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-8 sm:py-8">
          {/* мобильные действия */}
          <div className="mb-5 flex flex-wrap items-center gap-2 lg:hidden">
            <SaveBadge />
            <Button
              variant="outline"
              small
              icon="spark"
              onClick={() => {
                loadDemo();
                setStep("preview");
                setWelcomeGone(true);
                push("Демо-данные загружены");
              }}
            >
              Демо
            </Button>
            <Button variant="danger" small icon="reset" onClick={() => setResetOpen(true)}>
              Очистить
            </Button>
            <Button
              variant="outline"
              small
              icon={zipping ? "reset" : "download"}
              onClick={onZip}
              disabled={zipping}
            >
              {zipping ? "Собираем…" : "ZIP"}
            </Button>
          </div>

          {isPristine && !welcomeGone && (
            <div className="anim-fade-up mb-6 flex flex-wrap items-center gap-4 overflow-hidden rounded-2xl border border-pine-800 bg-pine-900 px-6 py-5 text-pine-100 shadow-[0_16px_40px_-18px_rgba(7,33,28,0.8)]">
              <div className="mr-auto flex items-center gap-4">
                <span className="anim-float flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-pine-950">
                  <Icon name="spark" className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <div className="font-display text-[14px] font-bold text-white">
                    Начнём годовой отчёт?
                  </div>
                  <p className="mt-0.5 max-w-md text-[12.5px] leading-snug text-pine-200">
                    Заполните шесть разделов — и скачайте свёрстанный публичный отчёт в PDF. Хотите
                    сначала посмотреть, как это выглядит?
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Button
                  variant="gold"
                  small
                  icon="spark"
                  onClick={() => {
                    loadDemo();
                    setStep("preview");
                    setWelcomeGone(true);
                    push("Демо-данные загружены");
                  }}
                >
                  Показать пример
                </Button>
                <button
                  onClick={() => setWelcomeGone(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-pine-300 transition-colors hover:bg-pine-800 hover:text-white"
                  aria-label="Скрыть подсказку"
                >
                  <Icon name="close" className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          )}

          <div className={step === "preview" ? "" : "mx-auto max-w-[920px]"}>
            {step === "org" && <OrgStep />}
            {step === "metrics" && <MetricsStep />}
            {step === "finance" && <FinanceStep />}
            {step === "programs" && <ProgramsStep />}
            {step === "team" && <TeamStep />}
            {step === "photos" && <PhotosStep />}
            {step === "preview" && <PreviewStep goTo={setStep} vkUser={vkUser} />}

            {/* нижняя навигация */}
            {step !== "preview" && (
              <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
                {prev ? (
                  <Button variant="ghost" icon="arrowL" onClick={goPrev}>
                    {prev.title}
                  </Button>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-4">
                  <span className="hidden text-[11.5px] font-semibold text-ink-300 sm:block">
                    {completion[step] ? "Раздел заполнен" : "Раздел ещё не заполнен"}
                  </span>
                  {next && (
                    <Button onClick={goNext}>
                      Далее: {next.title}
                      <Icon name="arrowR" className="h-4 w-4" strokeWidth={2.2} />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <footer className="mx-auto mt-12 max-w-[920px] border-t border-line pb-4 pt-5 text-center text-[11px] font-medium text-ink-300">
            Данные хранятся только в вашем браузере и никуда не отправляются. Отчёт формируется
            локально в PDF.
          </footer>
        </div>
      </main>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Очистить все данные?"
        actions={
          <>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="danger"
              icon="trash"
              onClick={() => {
                resetAll();
                setResetOpen(false);
                setWelcomeGone(false);
                push("Все данные очищены");
              }}
            >
              Да, очистить
            </Button>
          </>
        }
      >
        Будут удалены все введённые сведения: организация, финансы, программы, команда и
        загруженные фотографии. Это действие нельзя отменить.
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ReportProvider>
        <Shell />
      </ReportProvider>
    </ToastProvider>
  );
}
