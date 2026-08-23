import { useRef, useState } from "react";
import { useReport } from "../../state/ReportContext";
import { Panel, Button, SectionHeader, Hint, useToast, TextInput } from "../ui";
import { Icon } from "../icons";
import { fileToDataUrl } from "../../lib/images";
import { uid } from "../../lib/format";
import type { GalleryPhoto } from "../../types";

const MAX_GALLERY = 8;

export function PhotosStep() {
  const { data, update } = useReport();
  const { push } = useToast();
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"cover" | "gallery" | null>(null);
  const photos = data.photos;

  const setPhotos = (p: Partial<typeof photos>) =>
    update((d) => ({ ...d, photos: { ...d.photos, ...p } }));

  const onCover = async (f: File | undefined) => {
    if (!f) return;
    setBusy("cover");
    try {
      const url = await fileToDataUrl(f, 1600, 0.85);
      setPhotos({ cover: url });
      push("Обложка загружена");
    } catch {
      push("Не удалось прочитать файл", "warn");
    } finally {
      setBusy(null);
      if (coverRef.current) coverRef.current.value = "";
    }
  };

  const onGallery = async (f: File | undefined) => {
    if (!f) return;
    setBusy("gallery");
    try {
      const url = await fileToDataUrl(f, 1200, 0.85);
      setPhotos({ gallery: [...photos.gallery, { id: uid(), src: url, caption: "" }] });
      push("Фотография добавлена");
    } catch {
      push("Не удалось прочитать файл", "warn");
    } finally {
      setBusy(null);
      if (galleryRef.current) galleryRef.current.value = "";
    }
  };

  const setCaption = (id: string, caption: string) =>
    setPhotos({ gallery: photos.gallery.map((g) => (g.id === id ? { ...g, caption } : g)) });

  return (
    <div className="anim-fade-up space-y-5">
      <SectionHeader
        icon="photos"
        title="Фотографии"
        desc="Обложка отчёта и фоторепортаж с подписями. Изображения сжимаются автоматически."
      />

      <input
        ref={coverRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onCover(e.target.files?.[0])}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onGallery(e.target.files?.[0])}
      />

      <Panel title="Фото для обложки" icon="image">
        {photos.cover ? (
          <div className="group relative overflow-hidden rounded-xl border border-line">
            <img src={photos.cover} alt="Обложка" className="h-64 w-full object-cover sm:h-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-pine-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Button variant="gold" small icon="upload" onClick={() => coverRef.current?.click()}>
                Заменить
              </Button>
              <Button variant="dark" small icon="trash" onClick={() => setPhotos({ cover: "" })}>
                Убрать
              </Button>
            </div>
            <span className="absolute right-3 top-3 rounded-full bg-pine-950/70 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-pine-100">
              Обложка · стр. 1
            </span>
          </div>
        ) : (
          <button
            onClick={() => coverRef.current?.click()}
            disabled={busy === "cover"}
            className="flex h-52 w-full flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-line bg-white/60 transition-colors hover:border-pine-600 hover:bg-pine-50 sm:h-64"
          >
            <Icon
              name={busy === "cover" ? "reset" : "photos"}
              className={`h-8 w-8 text-pine-600 ${busy === "cover" ? "animate-spin" : ""}`}
              strokeWidth={1.5}
            />
            <span className="text-[14px] font-bold text-pine-800">
              {busy === "cover" ? "Обрабатываем…" : "Загрузить обложку"}
            </span>
            <span className="text-[12px] text-ink-400">
              Широкий горизонтальный кадр украсит первую страницу
            </span>
          </button>
        )}
      </Panel>

      <Panel
        title="Фоторепортаж"
        icon="photos"
        action={
          <Button
            variant="outline"
            small
            icon="plus"
            disabled={photos.gallery.length >= MAX_GALLERY || busy === "gallery"}
            onClick={() => galleryRef.current?.click()}
          >
            {busy === "gallery" ? "Загрузка…" : "Добавить фото"}
          </Button>
        }
      >
        {photos.gallery.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-white/50 px-4 py-8 text-center text-[12.5px] text-ink-400">
            Добавьте 2–8 фотографий с подписями — из них соберётся страница «Фотографии года».
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {photos.gallery.map((g: GalleryPhoto) => (
              <div key={g.id} className="anim-pop overflow-hidden rounded-xl border border-line bg-white">
                <div className="group relative">
                  <img src={g.src} alt={g.caption || "Фотография"} className="h-44 w-full object-cover" />
                  <button
                    onClick={() => setPhotos({ gallery: photos.gallery.filter((x) => x.id !== g.id) })}
                    className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-pine-950/60 text-pine-100 opacity-0 transition-all hover:bg-clay-600 group-hover:opacity-100"
                    aria-label="Удалить фото"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-3">
                  <TextInput
                    value={g.caption}
                    onChange={(e) => setCaption(g.id, e.target.value)}
                    placeholder="Подпись к фотографии…"
                    className="py-2 text-[12.5px]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Hint>
        Фотографии сохраняются в браузере вместе с остальными данными. Если снимков очень много,
        автосохранение может не вместить их — появится предупреждение, и часть фото придётся
        загрузить заново.
      </Hint>
    </div>
  );
}
