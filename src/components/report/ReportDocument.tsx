import type { CSSProperties, ReactNode } from "react";
import type { ReportData, FinanceRow } from "../../types";
import { fmtNum, fmtMoney, fmtMoneyShort, plural } from "../../lib/format";

export const PAGE_W = 794;
export const PAGE_H = 1123;

/* ------------------------------------------------------------------ */
/* Базовые элементы                                                    */
/* ------------------------------------------------------------------ */

/** Фотография через CSS-фон: html2canvas отрабатывает её без растяжений. */
function Bg({
  src,
  className = "",
  style,
}: {
  src?: string;
  className?: string;
  style?: CSSProperties;
}) {
  if (!src) return null;
  return (
    <div
      className={className}
      style={{
        backgroundImage: `url("${src}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        ...style,
      }}
    />
  );
}

/** Оболочка контентной страницы: колонтитулы + рабочая область. */
function PageShell({
  section,
  page,
  orgShort,
  year,
  children,
}: {
  section: string;
  page: number;
  orgShort: string;
  year: string;
  children: ReactNode;
}) {
  return (
    <div className="report-page page-shadow relative overflow-hidden bg-white">
      {/* верхний колонтитул */}
      <div className="absolute inset-x-0 top-0 z-10 px-[64px] pt-[30px]">
        <div className="flex items-baseline justify-between">
          <span className="font-body text-[9.5px] font-extrabold uppercase tracking-[0.22em] text-pine-800">
            {orgShort || "НКО"} · Годовой отчёт {year}
          </span>
          <span className="font-body text-[9.5px] font-extrabold uppercase tracking-[0.22em] text-gold-600">
            {section}
          </span>
        </div>
        <div className="mt-[9px] h-[3px] w-full bg-pine-100">
          <div className="h-[3px] w-[64px] bg-gold-500" />
        </div>
      </div>

      {/* рабочая область */}
      <div className="absolute inset-x-0 bottom-[78px] top-[92px] overflow-hidden px-[64px]">
        {children}
      </div>

      {/* нижний колонтитул */}
      <div className="absolute inset-x-0 bottom-0 flex h-[66px] items-center justify-between border-t border-pine-100 px-[64px]">
        <span className="font-body text-[9px] font-bold uppercase tracking-[0.18em] text-ink-300">
          Публичный годовой отчёт · {year}
        </span>
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-md bg-gold-500 font-display text-[13px] font-bold text-pine-950">
          {page}
        </span>
      </div>
    </div>
  );
}

/** Заголовок раздела с номером. */
function SectionTitle({ num, title, sub }: { num: string; title: string; sub?: string }) {
  return (
    <div className="mb-[24px] flex items-start gap-[18px]">
      <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[10px] bg-gold-500 font-display text-[17px] font-bold text-pine-950">
        {num}
      </span>
      <div className="pt-[2px]">
        <h2 className="font-display text-[24px] font-bold leading-tight text-pine-900">{title}</h2>
        {sub && (
          <p className="mt-[4px] font-report text-[12.5px] italic text-ink-500">{sub}</p>
        )}
      </div>
    </div>
  );
}

/** Подзаголовок блока страницы: номер, название и линейка. */
function BlockLabel({ n, text }: { n: string; text: string }) {
  return (
    <div className="mb-[13px] flex items-center gap-[10px]">
      <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] bg-pine-800 font-display text-[11px] font-bold text-gold-400">
        {n}
      </span>
      <span className="font-body text-[11px] font-extrabold uppercase tracking-[0.14em] text-pine-800">
        {text}
      </span>
      <span className="h-[2px] flex-1 bg-pine-100" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Страницы                                                            */
/* ------------------------------------------------------------------ */

function CoverPage({ data }: { data: ReportData }) {
  const { org, year, photos } = data;
  return (
    <div className="report-page page-shadow relative overflow-hidden bg-pine-950">
      {photos.cover ? (
        <Bg src={photos.cover} className="absolute inset-0" />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 78% 18%, rgba(227,166,58,0.2), transparent 46%), radial-gradient(circle at 15% 85%, rgba(39,154,136,0.3), transparent 50%), linear-gradient(160deg, #0b332c, #07211c)",
          }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(200deg, rgba(7,33,28,0.12) 0%, rgba(7,33,28,0.5) 52%, rgba(7,33,28,0.94) 100%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-[10px] bg-gold-500" />

      {org.logo && (
        <div className="absolute left-[64px] top-[52px] flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-[14px] bg-white/95 p-[10px]">
          <img src={org.logo} alt="" className="h-full w-full object-contain" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 px-[64px] pb-[70px]">
        <div className="font-body text-[12px] font-extrabold uppercase tracking-[0.3em] text-gold-400">
          Публичный годовой отчёт
        </div>
        <div className="mt-[10px] font-display text-[132px] font-extrabold leading-[0.95] text-white">
          {year || "2025"}
        </div>
        <div className="mt-[22px] h-[6px] w-[120px] bg-gold-500" />
        <div className="mt-[22px] max-w-[560px] font-display text-[28px] font-bold leading-[1.25] text-white">
          {org.name || "Некоммерческая организация"}
        </div>
        {(org.address || org.site) && (
          <div className="mt-[16px] font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-pine-200">
            {org.address || org.site}
          </div>
        )}
      </div>
    </div>
  );
}

function AboutPage({ data, page }: { data: ReportData; page: number }) {
  const { org, metrics, year } = data;
  const stats: Array<{ label: string; value: number; word: [string, string, string] }> = [
    { label: "благополучателей", value: metrics.beneficiaries, word: ["человек", "человека", "человек"] },
    { label: "волонтёров", value: metrics.volunteers, word: ["доброволец", "добровольца", "добровольцев"] },
    { label: "штатных сотрудников", value: metrics.staff, word: ["сотрудник", "сотрудника", "сотрудников"] },
    { label: "событий и мероприятий", value: metrics.events, word: ["событие", "события", "событий"] },
  ];
  const custom = metrics.custom.filter((c) => c.label.trim() && c.value.trim());

  return (
    <PageShell section="Об организации" page={page} orgShort={org.shortName || org.name} year={year}>
      <SectionTitle num="01" title="Об организации" sub="Кто мы и зачем работаем" />

      {org.mission ? (
        <div className="mb-[26px] rounded-[12px] border-l-[5px] border-gold-500 bg-pine-50 px-[26px] py-[22px]">
          <div className="mb-[8px] font-body text-[9.5px] font-extrabold uppercase tracking-[0.2em] text-pine-700">
            Миссия
          </div>
          <p className="font-report text-[15px] leading-[1.75] text-pine-900">{org.mission}</p>
        </div>
      ) : (
        <div className="mb-[26px] rounded-[12px] border border-dashed border-pine-200 bg-pine-50/50 px-[22px] py-[18px] font-body text-[12px] text-ink-400">
          Миссия не заполнена — добавьте её в разделе «Организация» конструктора.
        </div>
      )}

      <div className="mb-[22px] grid grid-cols-2 gap-[14px]">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[12px] border border-pine-100 bg-white px-[22px] py-[20px]">
            <div className="font-display text-[40px] font-extrabold leading-none text-pine-800">
              {s.value > 0 ? fmtNum(s.value) : "—"}
            </div>
            <div className="mt-[10px] font-body text-[11.5px] font-bold leading-snug text-ink-500">
              {s.label}
              {s.value > 0 && (
                <span className="font-medium text-ink-300"> · {plural(s.value, s.word)}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {custom.length > 0 && (
        <>
          <BlockLabel n="+" text="Дополнительные показатели" />
          <div className="flex flex-wrap gap-[10px]">
            {custom.map((c) => (
              <div
                key={c.id}
                className="flex items-baseline gap-[10px] rounded-[10px] border border-gold-100 bg-gold-50 px-[16px] py-[10px]"
              >
                <span className="font-display text-[17px] font-bold text-gold-700">{c.value}</span>
                <span className="font-body text-[11px] font-bold text-ink-700">{c.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}

function MoneyTable({
  title,
  rows,
  total,
  accent,
}: {
  title: string;
  rows: FinanceRow[];
  total: number;
  accent: "gold" | "pine";
}) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-pine-100">
      <div className="flex items-center justify-between bg-pine-900 px-[14px] py-[9px]">
        <span className="font-body text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-pine-100">
          {title}
        </span>
        <span
          className={`h-[8px] w-[8px] rounded-full ${accent === "gold" ? "bg-gold-400" : "bg-pine-500"}`}
        />
      </div>
      {rows.length === 0 ? (
        <div className="px-[14px] py-[16px] font-body text-[10.5px] text-ink-300">
          Нет данных
        </div>
      ) : (
        rows.map((r, i) => (
          <div
            key={r.id}
            className={`flex items-center justify-between gap-[10px] px-[14px] py-[7px] ${
              i % 2 ? "bg-pine-50/60" : "bg-white"
            }`}
          >
            <span className="font-body text-[10.5px] font-semibold leading-snug text-ink-700">
              {r.label || "Без названия"}
            </span>
            <span className="shrink-0 font-body text-[10.5px] font-bold tabular-nums text-pine-900">
              {fmtMoney(r.amount)}
            </span>
          </div>
        ))
      )}
      <div
        className={`flex items-center justify-between border-t-2 px-[14px] py-[9px] ${
          accent === "gold" ? "border-gold-500 bg-gold-50" : "border-pine-600 bg-pine-50"
        }`}
      >
        <span className="font-body text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-ink-700">
          Итого
        </span>
        <span className="font-display text-[13px] font-bold tabular-nums text-pine-900">
          {fmtMoney(total)}
        </span>
      </div>
    </div>
  );
}

function FinancePage({
  data,
  page,
  incomeTotal,
  expenseTotal,
}: {
  data: ReportData;
  page: number;
  incomeTotal: number;
  expenseTotal: number;
}) {
  const { org, finance, year } = data;
  const balance = incomeTotal - expenseTotal;
  const topExpenses = [...finance.expenses]
    .filter((r) => r.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  return (
    <PageShell section="Финансы" page={page} orgShort={org.shortName || org.name} year={year}>
      <SectionTitle num="02" title="Финансы года" sub="Откуда пришли средства и на что они потрачены" />

      <div className="mb-[18px] grid grid-cols-3 gap-[12px]">
        <div className="rounded-[10px] border border-pine-100 bg-white px-[16px] py-[14px]">
          <div className="font-body text-[9px] font-extrabold uppercase tracking-[0.16em] text-ink-400">
            Приход
          </div>
          <div className="mt-[6px] font-display text-[19px] font-bold tabular-nums text-pine-800">
            {fmtMoneyShort(incomeTotal)}
          </div>
        </div>
        <div className="rounded-[10px] border border-pine-100 bg-white px-[16px] py-[14px]">
          <div className="font-body text-[9px] font-extrabold uppercase tracking-[0.16em] text-ink-400">
            Расход
          </div>
          <div className="mt-[6px] font-display text-[19px] font-bold tabular-nums text-ink-700">
            {fmtMoneyShort(expenseTotal)}
          </div>
        </div>
        <div
          className={`rounded-[10px] px-[16px] py-[14px] ${
            balance < 0 ? "bg-clay-50" : "bg-pine-800"
          }`}
        >
          <div
            className={`font-body text-[9px] font-extrabold uppercase tracking-[0.16em] ${
              balance < 0 ? "text-clay-700" : "text-pine-300"
            }`}
          >
            {balance < 0 ? "Дефицит" : "Остаток"}
          </div>
          <div
            className={`mt-[6px] font-display text-[19px] font-bold tabular-nums ${
              balance < 0 ? "text-clay-700" : "text-gold-400"
            }`}
          >
            {fmtMoneyShort(Math.abs(balance))}
          </div>
        </div>
      </div>

      <div className="mb-[20px] grid grid-cols-2 gap-[14px]">
        <MoneyTable title="Поступления" rows={finance.income} total={incomeTotal} accent="gold" />
        <MoneyTable title="Расходы" rows={finance.expenses} total={expenseTotal} accent="pine" />
      </div>

      {expenseTotal > 0 && topExpenses.length > 0 && (
        <>
          <BlockLabel n="%" text="Структура расходов" />
          <div className="mb-[16px] space-y-[9px]">
            {topExpenses.map((r) => {
              const pct = Math.round((r.amount / expenseTotal) * 100);
              return (
                <div key={r.id}>
                  <div className="mb-[4px] flex items-baseline justify-between">
                    <span className="font-body text-[10.5px] font-semibold text-ink-700">
                      {r.label || "Без названия"}
                    </span>
                    <span className="font-body text-[10px] font-bold tabular-nums text-ink-500">
                      {fmtMoneyShort(r.amount)} · {pct}%
                    </span>
                  </div>
                  <div className="h-[10px] overflow-hidden rounded-full bg-pine-50">
                    <div
                      className="h-full rounded-full bg-pine-600"
                      style={{ width: `${Math.max(3, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {finance.note && (
        <p className="rounded-[10px] bg-pine-50/70 px-[16px] py-[12px] font-report text-[10.5px] italic leading-[1.6] text-ink-500">
          {finance.note}
        </p>
      )}
    </PageShell>
  );
}

function ProgramsPage({ data, page }: { data: ReportData; page: number }) {
  const { org, programs, year } = data;
  const list = programs.filter((p) => p.name.trim()).slice(0, 4);

  return (
    <PageShell section="Программы" page={page} orgShort={org.shortName || org.name} year={year}>
      <SectionTitle num="03" title="Программы и проекты" sub="Что мы делали и что изменилось" />

      {list.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-pine-200 bg-pine-50/50 px-5 py-10 text-center font-body text-[12.5px] text-ink-400">
          Программы не добавлены — заполните раздел «Программы» в конструкторе.
        </div>
      ) : (
        <div className="space-y-[14px]">
          {list.map((p) => (
            <div key={p.id} className="rounded-[12px] border border-pine-100 bg-white p-[18px]">
              <div className="flex flex-wrap items-center gap-[10px]">
                <span className="rounded-full bg-gold-100 px-[12px] py-[4px] font-body text-[9px] font-extrabold uppercase tracking-[0.12em] text-gold-700">
                  {p.tag || "Проект"}
                </span>
                <span className="font-display text-[16.5px] font-bold text-pine-900">
                  {p.name}
                </span>
              </div>
              <div className="mt-[10px] flex flex-wrap items-center gap-x-[18px] gap-y-[4px]">
                <span className="font-body text-[11px] font-bold text-pine-800">
                  Бюджет: <span className="tabular-nums">{fmtMoney(p.budget)}</span>
                </span>
                {p.participants > 0 && (
                  <span className="font-body text-[11px] font-bold text-pine-800">
                    Охват:{" "}
                    <span className="tabular-nums">
                      {fmtNum(p.participants)} {plural(p.participants, ["человек", "человека", "человек"])}
                    </span>
                  </span>
                )}
              </div>
              {p.result && (
                <p className="mt-[9px] border-l-[3px] border-pine-200 pl-[12px] font-report text-[12px] italic leading-[1.65] text-ink-700">
                  {p.result}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {programs.length > 4 && (
        <p className="mt-[14px] text-center font-report text-[11px] italic text-ink-400">
          Полные описания всех {programs.length} программ — на сайте организации
        </p>
      )}
    </PageShell>
  );
}

function TeamPage({ data, page }: { data: ReportData; page: number }) {
  const { org, team, year } = data;
  const members = team
    .filter((m) => m.firstName.trim() || m.lastName.trim())
    .slice(0, 8);
  const partners = org.partners
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);

  return (
    <PageShell section="Команда и партнёры" page={page} orgShort={org.shortName || org.name} year={year}>
      <SectionTitle num="04" title="Команда и партнёры" sub="Люди, без которых год бы не случился" />

      {/* 1. Команда */}
      <BlockLabel n="1" text="Команда" />
      {members.length === 0 ? (
        <div className="mb-[20px] rounded-[10px] border border-dashed border-pine-200 bg-pine-50/50 px-4 py-5 font-body text-[11.5px] text-ink-400">
          Состав команды не указан — раздел можно заполнить в конструкторе или оставить пустым.
        </div>
      ) : (
        <div className="mb-[22px] grid grid-cols-4 gap-[12px]">
          {members.map((m) => (
            <div key={m.id} className="rounded-[12px] border border-pine-100 bg-white p-[9px]">
              {m.photo ? (
                <Bg src={m.photo} className="h-[122px] w-full rounded-[8px]" />
              ) : (
                <div className="flex h-[122px] w-full items-center justify-center rounded-[8px] border border-pine-100 bg-pine-50">
                  <span className="font-display text-[26px] font-bold text-pine-300">
                    {((m.lastName[0] || "") + (m.firstName[0] || "")).toUpperCase() || "·"}
                  </span>
                </div>
              )}
              <div className="mt-[9px] px-[2px] text-center">
                <div className="font-body text-[12.5px] font-bold leading-tight text-pine-900">
                  {[m.firstName, m.lastName].filter(Boolean).join(" ") || "Участник команды"}
                </div>
                {m.role && (
                  <div className="mt-[4px] font-body text-[8.5px] font-extrabold uppercase tracking-[0.09em] text-ink-400">
                    {m.role}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Партнёры проекта */}
      <BlockLabel n="2" text="Партнёры проекта" />
      {partners.length === 0 ? (
        <div className="mb-[20px] rounded-[10px] border border-dashed border-pine-200 bg-pine-50/50 px-4 py-5 font-body text-[11.5px] text-ink-400">
          Партнёры не указаны — добавьте их в разделе «Организация».
        </div>
      ) : (
        <div className="mb-[22px] grid grid-cols-2 gap-[10px]">
          {partners.map((p) => (
            <div
              key={p}
              className="flex items-center gap-[10px] rounded-[10px] border border-pine-100 bg-white px-[14px] py-[10px]"
            >
              <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-gold-500" />
              <span className="font-body text-[12px] font-semibold leading-snug text-ink-700">{p}</span>
            </div>
          ))}
        </div>
      )}

      {/* 3. Слово руководителя */}
      {org.directorWord && (
        <>
          <BlockLabel n="3" text="Слово руководителя" />
          <div className="rounded-[12px] border-l-[5px] border-gold-500 bg-pine-50 px-[26px] py-[20px]">
            <p className="font-report text-[14px] italic leading-[1.7] text-pine-900">
              «{org.directorWord}»
            </p>
            {org.directorName && (
              <div className="mt-[14px] flex items-center gap-[12px]">
                <span className="h-[3px] w-[34px] bg-gold-500" />
                <div>
                  <div className="font-display text-[13.5px] font-bold text-pine-900">
                    {org.directorName}
                  </div>
                  <div className="font-body text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-500">
                    {org.directorTitle || "руководитель"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </PageShell>
  );
}

function PhotosPage({ data, page }: { data: ReportData; page: number }) {
  const { org, photos, year } = data;
  const list = photos.gallery.filter((g) => g.src).slice(0, 6);

  return (
    <PageShell section="Фотографии" page={page} orgShort={org.shortName || org.name} year={year}>
      <SectionTitle num="05" title="Фотографии года" sub="Моменты, которые остались с нами" />

      {list.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-pine-200 bg-pine-50/50 px-5 py-10 text-center font-body text-[12.5px] text-ink-400">
          Фотографии не загружены — добавьте их в разделе «Фотографии» конструктора.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-[18px] gap-y-[20px]">
          {list.map((g) => (
            <div key={g.id}>
              <Bg
                src={g.src}
                className="h-[228px] w-full rounded-[12px] border border-pine-100"
              />
              <div className="mt-[8px] flex items-start gap-[8px]">
                <span className="mt-[5px] h-[6px] w-[6px] shrink-0 rounded-full bg-gold-500" />
                <span className="font-body text-[10.5px] font-semibold leading-snug text-ink-700">
                  {g.caption || "Из архива организации"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.gallery.length > 6 && (
        <p className="mt-[16px] text-center font-report text-[11.5px] italic text-ink-400">
          Ещё {photos.gallery.length - 6}{" "}
          {plural(photos.gallery.length - 6, ["фотография", "фотографии", "фотографий"])} — в архиве
          организации
        </p>
      )}
    </PageShell>
  );
}

function FinalPage({ data, page }: { data: ReportData; page: number }) {
  const { org, year } = data;
  const contacts = [org.site, org.email, org.phone].filter(Boolean);
  const today = new Date().toLocaleDateString("ru-RU");

  return (
    <div className="report-page page-shadow relative overflow-hidden bg-pine-950">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 82% 12%, rgba(227,166,58,0.14), transparent 42%), radial-gradient(circle at 12% 88%, rgba(39,154,136,0.18), transparent 46%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[10px] bg-gold-500" />

      <div className="relative flex h-full flex-col items-center justify-center px-[90px] text-center">
        {org.logo ? (
          <div className="flex h-[84px] w-[84px] items-center justify-center overflow-hidden rounded-[16px] bg-white/95 p-[12px]">
            <img src={org.logo} alt="" className="h-full w-full object-contain" />
          </div>
        ) : (
          <svg viewBox="0 0 40 40" className="h-[72px] w-[72px]" aria-hidden="true">
            <rect x="2" y="2" width="36" height="36" rx="9" fill="#0F453C" />
            <path
              d="M12 27V13.5h9.5a4.5 4.5 0 1 1 0 9H12"
              fill="none"
              stroke="#EEBC62"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 27h14" stroke="#7FBAAB" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        )}

        <h2 className="mt-[30px] font-display text-[32px] font-bold leading-[1.2] text-white">
          Спасибо, что были
          <br />с нами в {year || "этом"} году
        </h2>
        <p className="mt-[18px] max-w-[460px] font-report text-[14.5px] italic leading-[1.7] text-pine-200">
          Каждое пожертвование, час волонтёрской работы и доброе слово сделали этот год возможным.
        </p>

        {contacts.length > 0 && (
          <div className="mt-[34px] flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[6px] font-body text-[13px] font-bold text-gold-400">
            {contacts.map((c, i) => (
              <span key={c} className="flex items-center gap-[10px]">
                {i > 0 && <span className="h-[4px] w-[4px] rounded-full bg-pine-500" />}
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="mt-[46px] border-t border-pine-800 pt-[18px]">
          <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.14em] text-pine-300">
            {org.name || "Некоммерческая организация"}
            {org.inn ? ` · ИНН ${org.inn}` : ""}
          </p>
          <p className="mt-[6px] font-body text-[9px] uppercase tracking-[0.14em] text-pine-500">
            Публичный годовой отчёт · стр. {page} · сформирован {today}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function ReportDocument({ data }: { data: ReportData }) {
  const incomeTotal = data.finance.income.reduce((s, r) => s + (r.amount || 0), 0);
  const expenseTotal = data.finance.expenses.reduce((s, r) => s + (r.amount || 0), 0);
  const hasPhotos = data.photos.gallery.some((g) => g.src);

  const pages: ReactNode[] = [<CoverPage key="cover" data={data} />];
  pages.push(<AboutPage key="about" data={data} page={2} />);
  pages.push(
    <FinancePage key="fin" data={data} page={3} incomeTotal={incomeTotal} expenseTotal={expenseTotal} />,
  );
  pages.push(<ProgramsPage key="prog" data={data} page={4} />);
  pages.push(<TeamPage key="team" data={data} page={5} />);
  if (hasPhotos) {
    pages.push(<PhotosPage key="photos" data={data} page={6} />);
  }
  pages.push(<FinalPage key="final" data={data} page={hasPhotos ? 7 : 6} />);

  return (
    <div className="flex flex-col" style={{ gap: 40 }}>
      {pages}
    </div>
  );
}

export function countPages(data: ReportData): number {
  return data.photos.gallery.some((g) => g.src) ? 7 : 6;
}
