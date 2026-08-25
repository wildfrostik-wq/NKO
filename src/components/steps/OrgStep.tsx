import { useRef, useState } from "react";
import { useReport } from "../../state/ReportContext";
import {
  Field,
  TextInput,
  TextArea,
  Panel,
  Hint,
  SectionHeader,
  Button,
  useToast,
} from "../ui";
import { Icon } from "../icons";
import { fileToDataUrl, approxDataUrlKb } from "../../lib/images";
import type { OrgInfo } from "../../types";

const MISSION_LIMIT = 360;

export function OrgStep() {
  const { data, update } = useReport();
  const { push } = useToast();
  const logoRef = useRef<HTMLInputElement>(null);
  const [logoBusy, setLogoBusy] = useState(false);
  const org = data.org;

  const set = (p: Partial<OrgInfo>) => update((d) => ({ ...d, org: { ...d.org, ...p } }));

  const onLogo = async (f: File | undefined) => {
    if (!f) return;
    setLogoBusy(true);
    try {
      const url = await fileToDataUrl(f, 512, 0.9);
      if (approxDataUrlKb(url) > 350) {
        push("Логотип получился крупным — лучше взять файл до ~300 КБ", "warn");
      }
      set({ logo: url });
      push("Логотип загружен");
    } catch {
      push("Не удалось прочитать файл изображения", "warn");
    } finally {
      setLogoBusy(false);
      if (logoRef.current) logoRef.current.value = "";
    }
  };

  return (
    <div className="anim-fade-up space-y-5">
      <SectionHeader
        icon="org"
        title="Организация"
        desc="Реквизиты и базовая информация — попадут на титульную и последнюю страницы отчёта."
      />

      <Panel title="Основные сведения" icon="org">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Полное название" className="sm:col-span-2">
            <TextInput
              value={org.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Благотворительный фонд «Название»"
            />
          </Field>
          <Field label="Короткое название" hint="Используется в колонтитулах страниц">
            <TextInput
              value={org.shortName}
              onChange={(e) => set({ shortName: e.target.value })}
              placeholder="Фонд «Название»"
            />
          </Field>
          <Field label="Сайт">
            <TextInput
              value={org.site}
              onChange={(e) => set({ site: e.target.value })}
              placeholder="nko.ru"
            />
          </Field>
          <Field label="ИНН">
            <TextInput
              value={org.inn}
              onChange={(e) => set({ inn: e.target.value.replace(/[^\d]/g, "").slice(0, 12) })}
              placeholder="10 или 12 цифр"
            />
          </Field>
          <Field label="ОГРН / ОГРНИП">
            <TextInput
              value={org.ogrn}
              onChange={(e) => set({ ogrn: e.target.value.replace(/[^\d]/g, "").slice(0, 15) })}
              placeholder="13 или 15 цифр"
            />
          </Field>
          <Field label="Юридический адрес" className="sm:col-span-2">
            <TextInput
              value={org.address}
              onChange={(e) => set({ address: e.target.value })}
              placeholder="Индекс, город, улица, дом"
            />
          </Field>
          <Field label="E-mail">
            <TextInput
              type="email"
              value={org.email}
              onChange={(e) => set({ email: e.target.value })}
              placeholder="info@nko.ru"
            />
          </Field>
          <Field label="Телефон">
            <TextInput
              value={org.phone}
              onChange={(e) => set({ phone: e.target.value })}
              placeholder="+7 (000) 000-00-00"
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Миссия" icon="heart">
        <TextArea
          rows={4}
          value={org.mission}
          onChange={(e) => set({ mission: e.target.value.slice(0, MISSION_LIMIT) })}
          placeholder="Зачем существует организация и кому она помогает — 2–4 предложения для титульного разворота…"
        />
        <div
          className={`mt-1.5 text-right text-[11px] font-semibold ${
            org.mission.length > MISSION_LIMIT - 40 ? "text-gold-700" : "text-ink-300"
          }`}
        >
          {org.mission.length} / {MISSION_LIMIT}
        </div>
      </Panel>

      <Panel title="Логотип" icon="image">
        <input
          ref={logoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onLogo(e.target.files?.[0])}
        />
        <div className="flex items-center gap-5">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-white">
            {org.logo ? (
              <img src={org.logo} alt="Логотип" className="h-full w-full object-contain" />
            ) : (
              <Icon name="image" className="h-8 w-8 text-ink-300" strokeWidth={1.5} />
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2.5">
              <Button
                variant="outline"
                small
                icon={logoBusy ? "reset" : "upload"}
                disabled={logoBusy}
                onClick={() => logoRef.current?.click()}
              >
                {logoBusy ? "Загрузка…" : org.logo ? "Заменить" : "Загрузить логотип"}
              </Button>
              {org.logo && (
                <Button variant="danger" small icon="trash" onClick={() => set({ logo: "" })}>
                  Удалить
                </Button>
              )}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-400">
              PNG или JPG, квадратный, до 500 КБ. Появится на титульной странице и в реквизитах.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="Банковские реквизиты" icon="bank">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Расчётный счёт">
            <TextInput
              value={org.bankAccount}
              onChange={(e) =>
                set({ bankAccount: e.target.value.replace(/[^\d]/g, "").slice(0, 20) })
              }
              placeholder="20 цифр"
            />
          </Field>
          <Field label="БИК">
            <TextInput
              value={org.bik}
              onChange={(e) => set({ bik: e.target.value.replace(/[^\d]/g, "").slice(0, 9) })}
              placeholder="9 цифр"
            />
          </Field>
          <Field label="Банк" className="sm:col-span-2">
            <TextInput
              value={org.bankName}
              onChange={(e) => set({ bankName: e.target.value })}
              placeholder="Название банка"
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Слово руководителя" icon="pen">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Имя и фамилия">
            <TextInput
              value={org.directorName}
              onChange={(e) => set({ directorName: e.target.value })}
              placeholder="Анна Иванова"
            />
          </Field>
          <Field label="Должность">
            <TextInput
              value={org.directorTitle}
              onChange={(e) => set({ directorTitle: e.target.value })}
              placeholder="директор фонда"
            />
          </Field>
          <Field label="Обращение к читателям отчёта" className="sm:col-span-2">
            <TextArea
              rows={4}
              value={org.directorWord}
              onChange={(e) => set({ directorWord: e.target.value })}
              placeholder="Короткое личное обращение: чем запомнился год, кому благодарны…"
            />
          </Field>
        </div>
      </Panel>

      <Field
        label="Партнёры года"
        hint="Каждый партнёр — с новой строки; попадут на страницу «Команда и партнёры»"
      >
        <TextArea
          rows={3}
          value={org.partners}
          onChange={(e) => set({ partners: e.target.value })}
          placeholder={"Компания «Ромашка»\nАдминистрация города\nВолонтёрский центр"}
        />
      </Field>

      <Hint>
        Все поля необязательны, но чем больше заполнено, тем полнее получится отчёт: пустые блоки
        аккуратно заменяются заглушками или не попадают на страницы PDF.
      </Hint>
    </div>
  );
}
