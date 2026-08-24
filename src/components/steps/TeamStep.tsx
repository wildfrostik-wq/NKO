import { useRef, useState } from "react";
import { useReport } from "../../state/ReportContext";
import { TextInput, Panel, Button, SectionHeader, Hint, useToast } from "../ui";
import { Icon } from "../icons";
import { fileToDataUrl } from "../../lib/images";
import { uid } from "../../lib/format";
import type { TeamMember } from "../../types";

const MAX_TEAM = 12;

function MemberCard({
  member,
  onChange,
  onRemove,
}: {
  member: TeamMember;
  onChange: (p: Partial<TeamMember>) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const { push } = useToast();

  const initials =
    ((member.lastName[0] || "") + (member.firstName[0] || "")).toUpperCase() || "?";

  const onPhoto = async (f: File | undefined) => {
    if (!f) return;
    setBusy(true);
    try {
      const url = await fileToDataUrl(f, 480, 0.85);
      onChange({ photo: url });
    } catch {
      push("Не удалось прочитать файл", "warn");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="anim-pop card-shadow rounded-xl border border-line bg-card p-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPhoto(e.target.files?.[0])}
      />
      <div className="flex items-start gap-3.5">
        <button
          onClick={() => fileRef.current?.click()}
          className="group relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl border border-line bg-pine-50 transition-colors hover:border-pine-600"
          title="Загрузить фото (необязательно)"
        >
          {member.photo ? (
            <img src={member.photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-display text-[20px] font-bold text-pine-300">
              {busy ? "…" : initials}
            </span>
          )}
          <span
            className={`absolute inset-0 flex items-center justify-center bg-pine-950/55 text-pine-50 transition-opacity ${
              member.photo ? "opacity-0 group-hover:opacity-100" : "opacity-0"
            }`}
          >
            <Icon name={member.photo ? "upload" : "photos"} className="h-5 w-5" strokeWidth={1.8} />
          </span>
          {busy && (
            <span className="absolute inset-0 flex items-center justify-center bg-pine-950/55 text-pine-50">
              <Icon name="reset" className="h-5 w-5 animate-spin" strokeWidth={1.8} />
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              value={member.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              placeholder="Фамилия"
              className="px-2.5 py-2 text-[12.5px]"
            />
            <TextInput
              value={member.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              placeholder="Имя"
              className="px-2.5 py-2 text-[12.5px]"
            />
          </div>
          <TextInput
            value={member.role}
            onChange={(e) => onChange({ role: e.target.value })}
            placeholder="Роль: директор, координатор…"
            className="px-2.5 py-2 text-[12.5px]"
          />
          <div className="flex items-center justify-between">
            {member.photo ? (
              <button
                onClick={() => onChange({ photo: "" })}
                className="text-[11px] font-bold text-ink-400 underline-offset-2 transition-colors hover:text-clay-600 hover:underline"
              >
                Убрать фото
              </button>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="text-[11px] font-bold text-pine-700 underline-offset-2 transition-colors hover:text-pine-600 hover:underline"
              >
                {busy ? "Загрузка…" : "Добавить фото"}
              </button>
            )}
            <button
              onClick={onRemove}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-300 transition-colors hover:bg-clay-50 hover:text-clay-600"
              aria-label="Удалить участника"
            >
              <Icon name="trash" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamStep() {
  const { data, update } = useReport();
  const { push } = useToast();
  const team = data.team;

  const setTeam = (list: TeamMember[]) => update((d) => ({ ...d, team: list }));
  const setMember = (id: string, p: Partial<TeamMember>) =>
    setTeam(team.map((m) => (m.id === id ? { ...m, ...p } : m)));

  return (
    <div className="anim-fade-up space-y-5">
      <SectionHeader
        icon="users"
        title="Команда"
        desc="Люди организации — попадут на страницу «Команда и партнёры». Фото необязательно: вместо него встанут инициалы."
      >
        <Button
          icon="plus"
          disabled={team.length >= MAX_TEAM}
          onClick={() => {
            setTeam([...team, { id: uid(), firstName: "", lastName: "", role: "", photo: "" }]);
            push("Участник добавлен");
          }}
        >
          Добавить участника
        </Button>
      </SectionHeader>

      {team.length === 0 ? (
        <Panel>
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pine-50 text-pine-600">
              <Icon name="users" className="h-7 w-7" strokeWidth={1.6} />
            </span>
            <div className="text-[15px] font-bold text-ink-700">Команда пока пуста</div>
            <p className="max-w-md text-[13px] leading-relaxed text-ink-400">
              Добавьте людей, без которых год бы не случился: фамилию, имя и роль. Фото — по желанию.
              Раздел можно оставить пустым: тогда в отчёте останутся партнёры и слово руководителя.
            </p>
          </div>
        </Panel>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {team.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              onChange={(p) => setMember(m.id, p)}
              onRemove={() => setTeam(team.filter((x) => x.id !== m.id))}
            />
          ))}
        </div>
      )}

      <Hint>
        В отчёте команда выводится сеткой до 8 человек. Если участников больше, остальные попадут
        в список на сайте организации.
      </Hint>
    </div>
  );
}
