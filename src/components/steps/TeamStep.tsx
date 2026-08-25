import { useRef } from "react";
import { useReport } from "../../state/ReportContext";
import { TextInput, Panel, SectionHeader, Button, Hint, useToast } from "../ui";
import { Icon } from "../icons";
import { fileToDataUrl } from "../../lib/images";
import { uid } from "../../lib/format";
import type { TeamMember } from "../../types";

const MAX_TEAM = 8;

export function TeamStep() {
  const { data, update } = useReport();
  const { push } = useToast();
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const team = data.team;

  const setTeam = (list: TeamMember[]) => update((d) => ({ ...d, team: list }));
  const setM = (id: string, p: Partial<TeamMember>) =>
    setTeam(team.map((m) => (m.id === id ? { ...m, ...p } : m)));

  const onPhoto = async (id: string, f: File | undefined) => {
    if (!f) return;
    try {
      const url = await fileToDataUrl(f, 640, 0.85);
      setM(id, { photo: url });
      push("Фото участника загружено");
    } catch {
      push("Не удалось прочитать файл", "warn");
    } finally {
      const el = fileRefs.current[id];
      if (el) el.value = "";
    }
  };

  return (
    <div className="anim-fade-up space-y-5">
      <SectionHeader
        icon="users"
        title="Команда"
        desc="Люди, без которых год бы не случился. Раздел необязательный: фото — по желанию, достаточно фамилии и имени."
      >
        <Button
          icon="plus"
          disabled={team.length >= MAX_TEAM}
          onClick={() => {
            setTeam([...team, { id: uid(), lastName: "", firstName: "", role: "", photo: "" }]);
            push("Участник добавлен");
          }}
        >
          Добавить участника
        </Button>
      </SectionHeader>

      {team.length === 0 ? (
        <div className="card-shadow flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-card/70 px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pine-50 text-pine-600">
            <Icon name="users" className="h-7 w-7" strokeWidth={1.6} />
          </span>
          <div className="text-[15px] font-bold text-ink-700">Команда пока пуста</div>
          <p className="max-w-sm text-[13px] leading-relaxed text-ink-400">
            Добавьте сотрудников и ключевых волонтёров. В отчёте они появятся на странице
            «Команда и партнёры» — карточками с фото или инициалами.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {team.map((m, i) => (
            <Panel key={m.id} className="anim-fade-up">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={(el) => {
                  fileRefs.current[m.id] = el;
                }}
                onChange={(e) => onPhoto(m.id, e.target.files?.[0])}
              />
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pine-800 font-display text-[13px] font-bold text-gold-400">
                  {i + 1}
                </span>
                <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-pine-800">
                  Участник команды
                </span>
                <button
                  onClick={() => {
                    setTeam(team.filter((x) => x.id !== m.id));
                    push("Участник удалён");
                  }}
                  className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-ink-300 transition-colors hover:bg-clay-50 hover:text-clay-600"
                  aria-label="Удалить участника"
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0">
                  <button
                    onClick={() => fileRefs.current[m.id]?.click()}
                    className="group relative flex h-[104px] w-[104px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-white transition-colors hover:border-pine-600 hover:bg-pine-50"
                    title="Загрузить фото (необязательно)"
                  >
                    {m.photo ? (
                      <img
                        src={m.photo}
                        alt={`${m.firstName} ${m.lastName}`.trim() || "Участник"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-display text-[24px] font-bold text-pine-300">
                        {((m.lastName[0] || "") + (m.firstName[0] || "")).toUpperCase() || "?"}
                      </span>
                    )}
                    <span
                      className={`absolute inset-0 flex items-center justify-center bg-pine-950/55 text-pine-50 transition-opacity ${
                        m.photo ? "opacity-0 group-hover:opacity-100" : "opacity-0"
                      }`}
                    >
                      <Icon name="upload" className="h-5 w-5" strokeWidth={2} />
                    </span>
                  </button>
                  {m.photo && (
                    <button
                      onClick={() => setM(m.id, { photo: "" })}
                      className="mt-2 w-[104px] rounded-lg py-1.5 text-center text-[11px] font-bold text-clay-600 transition-colors hover:bg-clay-50"
                    >
                      Убрать фото
                    </button>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                        Фамилия
                      </span>
                      <TextInput
                        value={m.lastName}
                        onChange={(e) => setM(m.id, { lastName: e.target.value })}
                        placeholder="Иванова"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                        Имя
                      </span>
                      <TextInput
                        value={m.firstName}
                        onChange={(e) => setM(m.id, { firstName: e.target.value })}
                        placeholder="Анна"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                      Роль в организации
                    </span>
                    <TextInput
                      value={m.role}
                      onChange={(e) => setM(m.id, { role: e.target.value })}
                      placeholder="Координатор волонтёров"
                    />
                  </label>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Hint>
        В отчёт попадут первые {MAX_TEAM} участников — остальные можно упомянуть в слове
        руководителя. Партнёры проекта добавляются в разделе «Организация».
      </Hint>
    </div>
  );
}
