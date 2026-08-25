import { Icon, BrandMark } from "./icons";
import type { StepId, StepMeta } from "../types";

export const STEPS: StepMeta[] = [
  { id: "org", title: "Организация", short: "Организация", desc: "Реквизиты, миссия, контакты", icon: "org" },
  { id: "metrics", title: "Показатели года", short: "Показатели", desc: "Ключевая статистика деятельности", icon: "metrics" },
  { id: "finance", title: "Финансы", short: "Финансы", desc: "Поступления и расходы", icon: "finance" },
  { id: "programs", title: "Программы", short: "Программы", desc: "Проекты и их результаты", icon: "programs" },
  { id: "team", title: "Команда", short: "Команда", desc: "Люди и партнёры — необязательно", icon: "users" },
  { id: "photos", title: "Фотографии", short: "Фото", desc: "Обложка и фоторепортаж", icon: "photos" },
  { id: "preview", title: "Отчёт и PDF", short: "Отчёт", desc: "Предпросмотр и выгрузка", icon: "file" },
];

export function Sidebar({
  step,
  setStep,
  completion,
  progress,
  orgName,
}: {
  step: StepId;
  setStep: (s: StepId) => void;
  completion: Record<string, boolean>;
  progress: number;
  orgName: string;
}) {
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <aside className="sidebar-dark fixed inset-y-0 left-0 z-40 hidden w-[276px] flex-col border-r border-pine-800/70 lg:flex">
      <div className="flex items-center gap-3 px-5 pb-6 pt-6">
        <BrandMark className="h-10 w-10 shrink-0" />
        <div>
          <div className="font-display text-[13px] font-bold leading-tight tracking-wide text-pine-50">
            ГОДОВОЙ ОТЧЁТ
          </div>
          <div className="text-[11px] font-medium text-pine-300">конструктор для НКО</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        {STEPS.map((s, i) => {
          const active = step === s.id;
          const done = completion[s.id];
          const isPreview = s.id === "preview";
          return (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`group mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                active
                  ? "bg-pine-800/90 shadow-[inset_0_0_0_1px_rgba(238,188,98,0.35)]"
                  : "hover:bg-pine-900/80"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold transition-colors ${
                  active
                    ? "bg-gold-500 text-pine-950"
                    : done && !isPreview
                      ? "bg-pine-700 text-pine-100"
                      : "bg-pine-900 text-pine-300 group-hover:bg-pine-800"
                }`}
              >
                {done && !isPreview && !active ? (
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.4} />
                ) : (
                  <span className="flex items-center gap-1.5">
                    {i + 1}
                    <Icon name={s.icon} className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
                  </span>
                )}
              </span>
              <span className="min-w-0">
                <span
                  className={`block text-[13.5px] font-bold leading-tight ${
                    active ? "text-pine-50" : "text-pine-200 group-hover:text-pine-50"
                  }`}
                >
                  {s.title}
                </span>
                <span className="block truncate text-[11px] font-medium text-pine-300/80">
                  {s.desc}
                </span>
              </span>
              {active && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-pine-800/70 px-5 py-5">
        {orgName && (
          <div className="mb-4 truncate rounded-lg border border-pine-800 bg-pine-900/70 px-3 py-2 text-[11.5px] font-semibold text-pine-200">
            {orgName}
          </div>
        )}
        <div className="flex items-center gap-3.5">
          <div className="relative h-16 w-16 shrink-0">
            <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
              <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(127,186,171,0.18)" strokeWidth="6" />
              <circle
                cx="32"
                cy="32"
                r={R}
                fill="none"
                stroke="#E3A63A"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C - (C * progress) / 100}
                style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-display text-[13px] font-bold text-pine-50">
              {progress}%
            </span>
          </div>
          <div>
            <div className="text-[12px] font-bold text-pine-100">Готовность отчёта</div>
            <div className="text-[11px] leading-snug text-pine-300">
              {progress >= 100
                ? "Все разделы заполнены — можно выгружать PDF"
                : "Заполните разделы, отмеченные цифрами"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileSteps({
  step,
  setStep,
  completion,
}: {
  step: StepId;
  setStep: (s: StepId) => void;
  completion: Record<string, boolean>;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-pine-800 bg-pine-950/95 backdrop-blur lg:hidden">
      <div className="flex items-center gap-2 overflow-x-auto px-3 py-2.5">
        <BrandMark className="h-8 w-8 shrink-0" />
        {STEPS.map((s, i) => {
          const active = step === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors ${
                active ? "bg-gold-500 text-pine-950" : "bg-pine-900 text-pine-200"
              }`}
            >
              <span className="opacity-70">{i + 1}</span>
              {s.short}
              {completion[s.id] && !active && <Icon name="check" className="h-3 w-3" strokeWidth={2.6} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
