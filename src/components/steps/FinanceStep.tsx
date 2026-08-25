import { useReport } from "../../state/ReportContext";
import {
  TextInput,
  TextArea,
  AmountInput,
  Panel,
  SectionHeader,
  Field,
  useToast,
} from "../ui";
import { Icon } from "../icons";
import { uid, fmtMoney } from "../../lib/format";
import type { FinanceRow } from "../../types";

function FinanceTable({
  title,
  accent,
  rows,
  onChange,
  placeholder,
  addLabel,
}: {
  title: string;
  accent: "gold" | "pine";
  rows: FinanceRow[];
  onChange: (rows: FinanceRow[]) => void;
  placeholder: string;
  addLabel: string;
}) {
  const { push } = useToast();
  const total = rows.reduce((s, r) => s + (r.amount || 0), 0);
  const setRow = (id: string, p: Partial<FinanceRow>) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, ...p } : r)));

  return (
    <Panel
      title={title}
      icon="finance"
      action={
        <button
          onClick={() => {
            onChange([...rows, { id: uid(), label: "", amount: 0 }]);
            push("Строка добавлена");
          }}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all active:scale-95 ${
            accent === "gold"
              ? "bg-gold-500 text-pine-950 hover:bg-gold-400"
              : "bg-pine-800 text-pine-50 hover:bg-pine-700"
          }`}
        >
          <Icon name="plus" className="h-3.5 w-3.5" strokeWidth={2.4} />
          {addLabel}
        </button>
      }
    >
      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line bg-white/50 px-4 py-8 text-center text-[12.5px] text-ink-400">
          {placeholder}
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line">
          <div className="grid grid-cols-[1fr_150px_36px] items-center gap-2 bg-pine-900 px-3 py-2 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-pine-100">
            <span>Статья</span>
            <span className="text-right">Сумма</span>
            <span />
          </div>
          {rows.map((r, i) => (
            <div
              key={r.id}
              className={`anim-fade-up grid grid-cols-[1fr_150px_36px] items-center gap-2 px-3 py-2 ${
                i % 2 ? "bg-pine-50/50" : "bg-white"
              }`}
            >
              <TextInput
                value={r.label}
                onChange={(e) => setRow(r.id, { label: e.target.value })}
                placeholder="Например: пожертвования частных лиц"
                className="border-transparent bg-transparent px-2 py-1.5 hover:border-line focus:bg-white"
              />
              <AmountInput value={r.amount} onChange={(n) => setRow(r.id, { amount: n })} />
              <button
                onClick={() => onChange(rows.filter((x) => x.id !== r.id))}
                className="flex h-8 w-8 items-center justify-center justify-self-center rounded-lg text-ink-300 transition-colors hover:bg-clay-50 hover:text-clay-600"
                aria-label="Удалить строку"
              >
                <Icon name="trash" className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div
            className={`flex items-center justify-between border-t-2 px-4 py-2.5 ${
              accent === "gold" ? "border-gold-500 bg-gold-50" : "border-pine-600 bg-pine-50"
            }`}
          >
            <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-700">
              Итого
            </span>
            <span className="font-display text-[15px] font-bold tabular-nums text-pine-900">
              {fmtMoney(total)}
            </span>
          </div>
        </div>
      )}
    </Panel>
  );
}

export function FinanceStep() {
  const { data, update, incomeTotal, expenseTotal } = useReport();
  const f = data.finance;

  const setF = (p: Partial<typeof f>) =>
    update((d) => ({ ...d, finance: { ...d.finance, ...p } }));
  const balance = incomeTotal - expenseTotal;

  return (
    <div className="anim-fade-up space-y-5">
      <SectionHeader
        icon="finance"
        title="Финансы"
        desc="Поступления и расходы за год — в отчёте это аккуратные таблицы с итогами и диаграммой структуры расходов."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card-shadow rounded-xl border border-line bg-card px-5 py-4">
          <div className="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-ink-400">
            Приход
          </div>
          <div className="mt-1 font-display text-[19px] font-bold tabular-nums text-pine-800">
            {fmtMoney(incomeTotal)}
          </div>
        </div>
        <div className="card-shadow rounded-xl border border-line bg-card px-5 py-4">
          <div className="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-ink-400">
            Расход
          </div>
          <div className="mt-1 font-display text-[19px] font-bold tabular-nums text-ink-700">
            {fmtMoney(expenseTotal)}
          </div>
        </div>
        <div
          className={`card-shadow rounded-xl border px-5 py-4 ${
            balance < 0 ? "border-clay-100 bg-clay-50" : "border-pine-200 bg-pine-800"
          }`}
        >
          <div
            className={`text-[10.5px] font-extrabold uppercase tracking-[0.1em] ${
              balance < 0 ? "text-clay-700" : "text-pine-300"
            }`}
          >
            {balance < 0 ? "Дефицит" : "Остаток"}
          </div>
          <div
            className={`mt-1 font-display text-[19px] font-bold tabular-nums ${
              balance < 0 ? "text-clay-700" : "text-gold-400"
            }`}
          >
            {fmtMoney(Math.abs(balance))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <FinanceTable
          title="Поступления"
          accent="gold"
          rows={f.income}
          onChange={(rows) => setF({ income: rows })}
          placeholder="Добавьте источники: гранты, пожертвования, субсидии, партнёры…"
          addLabel="Источник"
        />
        <FinanceTable
          title="Расходы"
          accent="pine"
          rows={f.expenses}
          onChange={(rows) => setF({ expenses: rows })}
          placeholder="Добавьте статьи: программы, зарплаты, аренда, налоги…"
          addLabel="Статья"
        />
      </div>

      <Field
        label="Примечание к финансовому разделу"
        hint="Например: кто проводил аудит и где опубликована отчётность"
      >
        <TextArea
          rows={3}
          value={f.note}
          onChange={(e) => setF({ note: e.target.value })}
          placeholder="Отчёт составлен по данным бухгалтерского учёта…"
        />
      </Field>
    </div>
  );
}
