import { useReport } from "../../state/ReportContext";
import { Field, TextInput, Panel, Button, SectionHeader, useToast } from "../ui";
import { Icon } from "../icons";
import { uid, fmtNum } from "../../lib/format";
import type { CustomMetric, Metrics } from "../../types";

function StatCard({
  icon,
  label,
  sub,
  value,
  onChange,
}: {
  icon: string;
  label: string;
  sub: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const bump = (delta: number) => onChange(Math.max(0, (value || 0) + delta));
  return (
    <div className="card-shadow group rounded-xl border border-line bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-pine-300">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pine-50 text-pine-700 transition-colors group-hover:bg-pine-800 group-hover:text-gold-400">
          <Icon name={icon} className="h-4.5 w-4.5" strokeWidth={1.9} />
        </span>
        <span className="font-display text-[22px] font-bold tabular-nums text-pine-800">
          {value > 0 ? fmtNum(value) : "—"}
        </span>
      </div>
      <div className="text-[13px] font-bold text-ink-900">{label}</div>
      <div className="mb-3 text-[11.5px] text-ink-400">{sub}</div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => bump(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-ink-500 transition-all hover:border-clay-600 hover:text-clay-600 active:scale-90"
          aria-label="Уменьшить"
        >
          <span className="text-[15px] font-bold leading-none">−</span>
        </button>
        <input
          inputMode="numeric"
          value={value || ""}
          placeholder="0"
          onChange={(e) => {
            const n = Number(e.target.value.replace(/[^\d]/g, ""));
            onChange(Number.isFinite(n) ? n : 0);
          }}
          className="h-8 w-full rounded-lg border border-line bg-white px-2 text-center text-[13.5px] font-semibold tabular-nums outline-none transition-colors focus:border-pine-600 focus:ring-2 focus:ring-pine-600/15"
        />
        <button
          onClick={() => bump(1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-ink-500 transition-all hover:border-pine-600 hover:text-pine-700 active:scale-90"
          aria-label="Увеличить"
        >
          <span className="text-[15px] font-bold leading-none">+</span>
        </button>
      </div>
    </div>
  );
}

export function MetricsStep() {
  const { data, update } = useReport();
  const { push } = useToast();
  const m = data.metrics;

  const setM = (p: Partial<Metrics>) => update((d) => ({ ...d, metrics: { ...d.metrics, ...p } }));

  const setCustom = (id: string, p: Partial<CustomMetric>) =>
    setM({ custom: m.custom.map((c) => (c.id === id ? { ...c, ...p } : c)) });

  return (
    <div className="anim-fade-up space-y-5">
      <SectionHeader
        icon="metrics"
        title="Показатели года"
        desc="Ключевые цифры деятельности — крупным шрифтом на странице «Об организации»."
      >
        <Field label="Отчётный год">
          <TextInput
            value={data.year}
            onChange={(e) =>
              update((d) => ({ ...d, year: e.target.value.replace(/[^\d]/g, "").slice(0, 4) }))
            }
            className="w-24 text-center font-display font-bold"
            placeholder="2025"
          />
        </Field>
      </SectionHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="heart"
          label="Благополучатели"
          sub="людей получили помощь за год"
          value={m.beneficiaries}
          onChange={(n) => setM({ beneficiaries: n })}
        />
        <StatCard
          icon="users"
          label="Волонтёры"
          sub="добровольцев в командах"
          value={m.volunteers}
          onChange={(n) => setM({ volunteers: n })}
        />
        <StatCard
          icon="org"
          label="Команда"
          sub="штатных сотрудников"
          value={m.staff}
          onChange={(n) => setM({ staff: n })}
        />
        <StatCard
          icon="calendar"
          label="События"
          sub="мероприятий проведено"
          value={m.events}
          onChange={(n) => setM({ events: n })}
        />
      </div>

      <Panel
        title="Дополнительные показатели"
        icon="layers"
        action={
          <Button
            variant="outline"
            small
            icon="plus"
            onClick={() => {
              setM({ custom: [...m.custom, { id: uid(), label: "", value: "" }] });
              push("Показатель добавлен");
            }}
          >
            Добавить
          </Button>
        }
      >
        {m.custom.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-white/50 px-4 py-6 text-center text-[12.5px] text-ink-400">
            Например: «посёлков в зоне охвата — 14», «часов волонтёрской работы — 5 400».
          </p>
        ) : (
          <div className="space-y-2.5">
            {m.custom.map((c) => (
              <div key={c.id} className="anim-fade-up flex items-center gap-2.5">
                <TextInput
                  value={c.label}
                  onChange={(e) => setCustom(c.id, { label: e.target.value })}
                  placeholder="Название показателя"
                  className="flex-1"
                />
                <TextInput
                  value={c.value}
                  onChange={(e) => setCustom(c.id, { value: e.target.value })}
                  placeholder="Значение"
                  className="w-36 text-right font-semibold"
                />
                <button
                  onClick={() => setM({ custom: m.custom.filter((x) => x.id !== c.id) })}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-300 transition-colors hover:bg-clay-50 hover:text-clay-600"
                  aria-label="Удалить показатель"
                >
                  <Icon name="trash" className="h-4.5 w-4.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
