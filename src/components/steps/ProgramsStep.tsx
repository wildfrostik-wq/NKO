import { useReport } from "../../state/ReportContext";
import { TextInput, TextArea, AmountInput, Button, SectionHeader, useToast, Panel } from "../ui";
import { Icon } from "../icons";
import { uid, fmtNum } from "../../lib/format";
import type { Program } from "../../types";

export function ProgramsStep() {
  const { data, update } = useReport();
  const { push } = useToast();
  const programs = data.programs;

  const setPrograms = (list: Program[]) => update((d) => ({ ...d, programs: list }));
  const setP = (id: string, p: Partial<Program>) =>
    setPrograms(programs.map((x) => (x.id === id ? { ...x, ...p } : x)));

  return (
    <div className="anim-fade-up space-y-5">
      <SectionHeader
        icon="programs"
        title="Программы и проекты"
        desc="Каждая программа — карточка в отчёте: название, направление, бюджет, охват и главный результат года."
      >
        <Button
          icon="plus"
          onClick={() => {
            setPrograms([
              ...programs,
              { id: uid(), name: "", tag: "", budget: 0, participants: 0, result: "" },
            ]);
            push("Программа добавлена");
          }}
        >
          Добавить программу
        </Button>
      </SectionHeader>

      {programs.length === 0 ? (
        <div className="card-shadow flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-card/70 px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pine-50 text-pine-600">
            <Icon name="programs" className="h-7 w-7" strokeWidth={1.6} />
          </span>
          <div className="text-[15px] font-bold text-ink-700">Программ пока нет</div>
          <p className="max-w-sm text-[13px] leading-relaxed text-ink-400">
            Добавьте хотя бы одну программу — в отчёте она станет карточкой с бюджетом, числом участников
            и описанием результата.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {programs.map((p, i) => (
            <Panel key={p.id} className="anim-fade-up">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500 font-display text-[13px] font-bold text-pine-950">
                  {i + 1}
                </span>
                <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-pine-800">
                  Программа
                </span>
                <button
                  onClick={() => {
                    setPrograms(programs.filter((x) => x.id !== p.id));
                    push("Программа удалена");
                  }}
                  className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-ink-300 transition-colors hover:bg-clay-50 hover:text-clay-600"
                  aria-label="Удалить программу"
                >
                  <Icon name="trash" className="h-4.5 w-4.5" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                    Название
                  </span>
                  <TextInput
                    value={p.name}
                    onChange={(e) => setP(p.id, { name: e.target.value })}
                    placeholder="«Тёплый дом»"
                    className="font-semibold"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                    Направление
                  </span>
                  <TextInput
                    value={p.tag}
                    onChange={(e) => setP(p.id, { tag: e.target.value })}
                    placeholder="Образование, здоровье…"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                      Бюджет
                    </span>
                    <AmountInput value={p.budget} onChange={(n) => setP(p.id, { budget: n })} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                      Участники
                    </span>
                    <div className="relative">
                      <TextInput
                        inputMode="numeric"
                        value={p.participants || ""}
                        onChange={(e) => {
                          const n = Number(e.target.value.replace(/[^\d]/g, ""));
                          setP(p.id, { participants: Number.isFinite(n) ? n : 0 });
                        }}
                        placeholder="0"
                        className="pr-10 text-right tabular-nums"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-ink-400">
                        чел.
                      </span>
                    </div>
                  </label>
                </div>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 flex items-baseline justify-between text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                    Результат года
                    {p.participants > 0 && (
                      <span className="font-medium normal-case tracking-normal text-ink-300">
                        охват: {fmtNum(p.participants)} чел.
                      </span>
                    )}
                  </span>
                  <TextArea
                    rows={2}
                    value={p.result}
                    onChange={(e) => setP(p.id, { result: e.target.value })}
                    placeholder="Что изменилось благодаря программе в этом году…"
                  />
                </label>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
