import type { CSSProperties, ReactNode } from "react";
import type { ReportData, FinanceRow } from "../../types";
import { fmtNum, fmtMoney, fmtMoneyShort, plural } from "../../lib/format";

export const PAGE_W = 794;
export const PAGE_H = 1123;
const PAD = 64;

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

function MiniIcon({ d, className = "h-4 w-4" }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  mail: "M3.5 7h17v12h-17z M3.5 8l8.5 6 8.5-6",
  phone:
    "M5.5 4h3.6l1.5 4.2-2.2 1.6a12.5 12.5 0 0 0 5.8 5.8l1.6-2.2L20 14.9v3.6a1.9 1.9 0 0 1-2 1.9A15.9 15.9 0 0 1 3.6 6a1.9 1.9 0 0 1 1.9-2Z",
  globe: "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z M3.5 12h17 M12 3.5a13.6 13.6 0 0 1 0 17 M12 3.5a13.6 13.6 0 0 0 0 17",
  pin: "M12 21s-6.5-5.6-6.5-10.4a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z M12 12.7a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z",
  bank: "M3 9.5l9-5.5 9 5.5 M5 10v8 M9.7 10v8 M14.3 10v8 M19 10v8 M3.5 20.5h17",
};

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
    <div className="mb-[26px] flex items-start gap-[18px]">
      <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[10px] bg-gold-500 font-display text-[17px] font-bold text-pine-950">
        {num}
      </span>
      <div className="pt-[2px]">
        <h2 className="font-display text-[23px] font-bold uppercase leading-tight tracking-[0.02em] text-pine-900">
          {title}
        </h2>
        {sub && <p className="mt-[5px] font-report text-[13px] italic text-ink-500">{sub}</p>}
      </div>
    </div>
  );
}

/** Финансовая таблица для PDF. */
function FinTable({
  title,
  rows,
  total,
  empty,
}: {
  title: string;
  rows: FinanceRow[];
  total: number;
  empty: string;
}) {
  return (
    <div>
      <div className="mb-[10px] flex items-center gap-2">
        <span className="h-[3px] w-[22px] bg-gold-500" />
        <span className="font-body text-[11px] font-extrabold uppercase tracking-[0.14em] text-pine-800">
          {title}
        </span>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-pine-200 bg-pine-50/50 px-4 py-5 font-body text-[11.5px] text-ink-400">
          {empty}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-pine-100">
          <div className="flex items-center justify-between bg-pine-800 px-[14px] py-[8px]">
            <span className="font-body text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-pine-100">
              Статья
            </span>
            <span className="font-body text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-pine-100">
              Сумма
            </span>
          </div>
          {rows.map((r, i) => (
            <div
              key={r.id}
              className={`flex items-baseline justify-between gap-3 px-[14px] py-[8px] ${
                i % 2 ? "bg-pine-50/60" : "bg-white"
              }`}
            >
              <span className="font-body text-[11.5px] font-medium text-ink-700">
                {r.label || "Без названия"}
              </span>
              <span className="whitespace-nowrap font-body text-[11.5px] font-bold tabular-nums text-pine-900">
                {fmtMoney(r.amount)}
              </span>
            </div>
          ))}
          <div className="flex items-baseline justify-between border-t-2 border-gold-500 bg-gold-50 px-[14px] py-[9px]">
            <span className="font-body text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-700">
              Итого
            </span>
            <span className="font-display text-[14px] font-bold tabular-nums text-pine-900">
              {fmtMoney(total)}
            </span>
          </div>
        </div>
      )}
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
      {/* фото на всю страницу */}
      <Bg src={photos.cover} className="absolute inset-0" />
      {/* декор без фото */}
      {!photos.cover && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(115deg, #0B332C 0px, #0B332C 30px, #0F453C 30px, #0F453C 60px)",
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/66 to-pine-950/34" />
      <div className="absolute inset-x-0 top-0 h-[10px] bg-gold-500" />

      <div className="relative flex h-full flex-col px-[64px] py-[52px]">
        {/* верх: логотип и имя */}
        <div className="flex items-center gap-[14px]">
          {org.logo ? (
            <Bg
              src={org.logo}
              className="h-[52px] w-[52px] rounded-[10px] bg-white"
              style={{ backgroundSize: "contain", backgroundColor: "#ffffff" }}
            />
          ) : (
            <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[10px] border-2 border-gold-500 font-display text-[20px] font-bold text-gold-400">
              {(org.shortName || org.name || "Н").trim().charAt(0).toUpperCase()}
            </span>
          )}
          <span className="font-body text-[12px] font-extrabold uppercase tracking-[0.24em] text-gold-400">
            {org.shortName || org.name || "Некоммерческая организация"}
          </span>
        </div>

        <div className="mt-auto">
          <div className="mb-[22px] h-[4px] w-[72px] bg-gold-500" />
          <div className="font-display text-[128px] font-extrabold leading-[0.95] text-gold-400">
            {year || "2025"}
          </div>
          <h1 className="mt-[14px] font-display text-[30px] font-bold uppercase leading-[1.15] tracking-[0.04em] text-white">
            Публичный годовой отчёт
          </h1>
          <p className="mt-[14px] max-w-[560px] font-report text-[18px] italic leading-snug text-pine-100">
            {org.name || "Название организации"}
          </p>
          {org.mission && (
            <p className="mt-[16px] max-w-[560px] font-report text-[13.5px] leading-[1.6] text-pine-200">
              {org.mission}
            </p>
          )}

          <div className="mt-[34px] flex items-center justify-between border-t border-white/20 pt-[18px]">
            <span className="max-w-[400px] truncate font-body text-[10.5px] font-semibold tracking-wide text-pine-200">
              {org.address || "Адрес организации"}
            </span>
            <span className="font-body text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-gold-400">
              {[org.site, org.email].filter(Boolean).join(" · ") || "контакты внутри"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage({ data, page }: { data: ReportData; page: number }) {
  const { org, metrics, year } = data;
  const stats = [
    { label: "Благополучатели", value: metrics.beneficiaries, icon: ICONS.pin, note: "получили помощь" },
    { label: "Волонтёры", value: metrics.volunteers, icon: ICONS.globe, note: "в командах" },
    { label: "Команда", value: metrics.staff, icon: ICONS.mail, note: "сотрудников" },
    { label: "События", value: metrics.events, icon: ICONS.phone, note: "мероприятий" },
  ];
  const contacts = [
    org.address && { icon: ICONS.pin, label: "Адрес", value: org.address },
    org.email && { icon: ICONS.mail, label: "E-mail", value: org.email },
    org.phone && { icon: ICONS.phone, label: "Телефон", value: org.phone },
    org.site && { icon: ICONS.globe, label: "Сайт", value: org.site },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  return (
    <PageShell section="Об организации" page={page} orgShort={org.shortName || org.name} year={year}>
      <SectionTitle num="01" title="Об организации" sub="Миссия, ключевые показатели и контакты" />

      {org.mission && (
        <div className="relative mb-[26px] rounded-[12px] bg-pine-50 px-[26px] py-[20px] pl-[34px]">
          <span className="absolute left-[10px] top-[2px] font-display text-[52px] font-bold leading-none text-gold-500">
            «
          </span>
          <p className="font-report text-[15.5px] italic leading-[1.65] text-pine-900">{org.mission}</p>
        </div>
      )}

      <div className="mb-[24px] grid grid-cols-2 gap-[14px]">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-[16px] rounded-[12px] border border-pine-100 bg-white px-[20px] py-[16px]"
          >
            <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] bg-pine-800 text-gold-400">
              <MiniIcon d={s.icon} className="h-[19px] w-[19px]" />
            </span>
            <div>
              <div className="font-display text-[26px] font-bold leading-none tabular-nums text-pine-800">
                {s.value > 0 ? fmtNum(s.value) : "—"}
              </div>
              <div className="mt-[4px] font-body text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-500">
                {s.label} · {s.note}
              </div>
            </div>
          </div>
        ))}
      </div>

      {metrics.custom.length > 0 && (
        <div className="mb-[24px] flex flex-wrap gap-[10px]">
          {metrics.custom.map((c) => (
            <div
              key={c.id}
              className="flex items-baseline gap-[8px] rounded-[10px] border border-gold-400/60 bg-gold-50 px-[16px] py-[10px]"
            >
              <span className="font-display text-[17px] font-bold text-pine-900">{c.value || "—"}</span>
              <span className="font-body text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-500">
                {c.label || "показатель"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-[18px]">
        <div>
          <div className="mb-[10px] flex items-center gap-2">
            <span className="h-[3px] w-[22px] bg-gold-500" />
            <span className="font-body text-[11px] font-extrabold uppercase tracking-[0.14em] text-pine-800">
              Контакты
            </span>
          </div>
          {contacts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-pine-200 bg-pine-50/50 px-4 py-5 font-body text-[11.5px] text-ink-400">
              Контакты не заполнены
            </div>
          ) : (
            <div className="space-y-[9px]">
              {contacts.map((c) => (
                <div key={c.label} className="flex items-center gap-[10px]">
                  <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] bg-pine-50 text-pine-700">
                    <MiniIcon d={c.icon} className="h-[13px] w-[13px]" />
                  </span>
                  <span className="font-body text-[11.5px] font-medium leading-snug text-ink-700">
                    {c.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="mb-[10px] flex items-center gap-2">
            <span className="h-[3px] w-[22px] bg-gold-500" />
            <span className="font-body text-[11px] font-extrabold uppercase tracking-[0.14em] text-pine-800">
              Реквизиты
            </span>
          </div>
          <div className="space-y-[7px] rounded-[12px] border border-pine-100 bg-pine-50/50 px-[16px] py-[14px]">
            {[
              ["ИНН", org.inn],
              ["ОГРН", org.ogrn],
              ["Банк", org.bankName],
              ["Р/с", org.bankAccount],
              ["БИК", org.bik],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3">
                  <span className="font-body text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink-400">
                    {k}
                  </span>
                  <span className="font-body text-[11.5px] font-bold tabular-nums text-pine-900">{v}</span>
                </div>
              ))}
            {!org.inn && !org.bankAccount && (
              <span className="font-body text-[11.5px] text-ink-400">Реквизиты не заполнены</span>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function FinancePage({ data, page }: { data: ReportData; page: number }) {
  const { org, finance, year } = data;
  const income = finance.income.filter((r) => r.label || r.amount > 0);
  const expenses = finance.expenses.filter((r) => r.label || r.amount > 0);
  const incomeTotal = income.reduce((s, r) => s + (r.amount || 0), 0);
  const expenseTotal = expenses.reduce((s, r) => s + (r.amount || 0), 0);
  const balance = incomeTotal - expenseTotal;

  const topExp = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5);
  const maxExp = topExp[0]?.amount || 1;

  return (
    <PageShell section="Финансы" page={page} orgShort={org.shortName || org.name} year={year}>
      <SectionTitle num="02" title="Финансы" sub="Поступления и расходы за отчётный год" />

      <div className="mb-[22px] grid grid-cols-3 gap-[14px]">
        <div className="rounded-[12px] border border-gold-400/60 bg-gold-50 px-[18px] py-[14px]">
          <div className="font-body text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-gold-700">
            Приход
          </div>
          <div className="mt-[5px] font-display text-[20px] font-bold tabular-nums text-pine-900">
            {fmtMoneyShort(incomeTotal)}
          </div>
        </div>
        <div className="rounded-[12px] border border-pine-100 bg-white px-[18px] py-[14px]">
          <div className="font-body text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-ink-400">
            Расход
          </div>
          <div className="mt-[5px] font-display text-[20px] font-bold tabular-nums text-ink-700">
            {fmtMoneyShort(expenseTotal)}
          </div>
        </div>
        <div className="rounded-[12px] bg-pine-800 px-[18px] py-[14px]">
          <div className="font-body text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-pine-300">
            {balance < 0 ? "Дефицит" : "Остаток"}
          </div>
          <div className="mt-[5px] font-display text-[20px] font-bold tabular-nums text-gold-400">
            {fmtMoneyShort(Math.abs(balance))}
          </div>
        </div>
      </div>

      <div className="mb-[22px] grid grid-cols-2 gap-[18px]">
        <FinTable title="Поступления" rows={income} total={incomeTotal} empty="Источники поступлений не указаны" />
        <FinTable title="Расходы" rows={expenses} total={expenseTotal} empty="Статьи расходов не указаны" />
      </div>

      {topExp.length > 0 && (
        <div className="mb-[18px]">
          <div className="mb-[12px] flex items-center gap-2">
            <span className="h-[3px] w-[22px] bg-gold-500" />
            <span className="font-body text-[11px] font-extrabold uppercase tracking-[0.14em] text-pine-800">
              Структура расходов
            </span>
          </div>
          <div className="space-y-[11px]">
            {topExp.map((r) => (
              <div key={r.id}>
                <div className="mb-[4px] flex items-baseline justify-between">
                  <span className="font-body text-[11px] font-semibold text-ink-700">
                    {r.label || "Без названия"}
                  </span>
                  <span className="font-body text-[10.5px] font-bold tabular-nums text-pine-800">
                    {fmtMoneyShort(r.amount)} · {expenseTotal ? Math.round((r.amount / expenseTotal) * 100) : 0}%
                  </span>
                </div>
                <div className="h-[9px] w-full overflow-hidden rounded-full bg-pine-100">
                  <div
                    className="h-[9px] rounded-full bg-pine-700"
                    style={{ width: `${Math.max(3, (r.amount / maxExp) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {finance.note && (
        <p className="border-l-[3px] border-gold-500 pl-[14px] font-report text-[11.5px] italic leading-[1.6] text-ink-500">
          {finance.note}
        </p>
      )}
    </PageShell>
  );
}

function ProgramsPage({ data, page }: { data: ReportData; page: number }) {
  const { org, programs, year } = data;
  const totalBudget = programs.reduce((s, p) => s + (p.budget || 0), 0);
  const totalPeople = programs.reduce((s, p) => s + (p.participants || 0), 0);

  return (
    <PageShell section="Программы" page={page} orgShort={org.shortName || org.name} year={year}>
      <SectionTitle num="03" title="Программы и проекты" sub="Что мы делали и что изменилось" />

      {programs.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-pine-200 bg-pine-50/50 px-5 py-8 text-center font-body text-[12.5px] text-ink-400">
          Программы не заполнены — добавьте их в разделе «Программы» конструктора.
        </div>
      ) : (
        <div className="space-y-[14px]">
          {programs.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="flex overflow-hidden rounded-[12px] border border-pine-100 bg-white"
            >
              <div className="w-[8px] shrink-0 bg-gold-500" />
              <div className="flex-1 px-[20px] py-[15px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-[16px] font-bold text-pine-900">
                    {p.name || "Программа"}
                  </span>
                  {p.tag && (
                    <span className="shrink-0 rounded-full bg-pine-50 px-[12px] py-[4px] font-body text-[9.5px] font-extrabold uppercase tracking-[0.1em] text-pine-700">
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="mt-[9px] flex items-center gap-[26px]">
                  <div>
                    <div className="font-body text-[9px] font-extrabold uppercase tracking-[0.12em] text-ink-400">
                      Бюджет
                    </div>
                    <div className="font-display text-[15px] font-bold tabular-nums text-pine-800">
                      {p.budget ? fmtMoney(p.budget) : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="font-body text-[9px] font-extrabold uppercase tracking-[0.12em] text-ink-400">
                      Участники
                    </div>
                    <div className="font-display text-[15px] font-bold tabular-nums text-pine-800">
                      {p.participants ? `${fmtNum(p.participants)} чел.` : "—"}
                    </div>
                  </div>
                </div>
                {p.result && (
                  <p className="mt-[9px] border-t border-dashed border-pine-100 pt-[9px] font-report text-[12px] leading-[1.55] text-ink-700">
                    {p.result}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {programs.length > 0 && (
        <div className="mt-[18px] flex items-center justify-between rounded-[12px] bg-pine-900 px-[20px] py-[14px]">
          <span className="font-body text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-pine-300">
            {programs.length} {plural(programs.length, ["программа", "программы", "программ"])} за год
          </span>
          <span className="font-body text-[12px] font-bold text-gold-400">
            {totalBudget ? `Бюджет ${fmtMoneyShort(totalBudget)}` : ""}
            {totalBudget && totalPeople ? " · " : ""}
            {totalPeople ? `${fmtNum(totalPeople)} участников` : ""}
          </span>
        </div>
      )}
    </PageShell>
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
        <div className="grid grid-cols-2 gap-x-[18px] gap-y-[22px]">
          {list.map((g) => (
            <div key={g.id}>
              <Bg
                src={g.src}
                className="h-[230px] w-full rounded-[12px] border border-pine-100"
              />
              <div className="mt-[8px] flex items-start gap-[8px]">
                <span className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full bg-gold-500" />
                <span className="font-body text-[10.5px] font-semibold leading-snug text-ink-700">
                  {g.caption || "Из архива организации"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.gallery.length > 6 && (
        <p className="mt-[18px] text-center font-report text-[11.5px] italic text-ink-400">
          Ещё {photos.gallery.length - 6} {plural(photos.gallery.length - 6, ["фотография", "фотографии", "фотографий"])} — в архиве организации
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

        <h2 className="mt-[30px] font-display text-[32px] font-bold leading-[1.2] text-white">
          Спасибо, что были
          <br />с нами в {year} году
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
            Публичный годовой отчёт · сформирован {today}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function ReportDocument({ data }: { data: ReportData }) {
  const pages: ReactNode[] = [<CoverPage key="cover" data={data} />];
  pages.push(<AboutPage key="about" data={data} page={2} />);
  pages.push(<FinancePage key="fin" data={data} page={3} />);
  pages.push(<ProgramsPage key="prog" data={data} page={4} />);
  pages.push(<TeamPage key="team" data={data} page={5} />);
  if (data.photos.gallery.some((g) => g.src)) {
    pages.push(<PhotosPage key="photos" data={data} page={6} />);
  }
  pages.push(
    <FinalPage key="final" data={data} page={data.photos.gallery.some((g) => g.src) ? 7 : 6} />,
  );

  return (
    <div className="flex flex-col" style={{ gap: 40 }}>
      {pages}
    </div>
  );
}

export function countPages(data: ReportData): number {
  return data.photos.gallery.some((g) => g.src) ? 7 : 6;
}
