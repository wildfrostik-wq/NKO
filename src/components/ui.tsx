import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import type {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ButtonHTMLAttributes,
} from "react";
import { Icon } from "./icons";

/* ---------------- Кнопки ---------------- */

type BtnVariant = "primary" | "gold" | "outline" | "ghost" | "danger" | "dark";

export function Button({
  variant = "primary",
  icon,
  small,
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  icon?: string;
  small?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";
  const size = small ? "text-[12.5px] px-3.5 py-2" : "text-[13.5px] px-5 py-2.5";
  const variants: Record<BtnVariant, string> = {
    primary: "bg-pine-800 text-pine-50 hover:bg-pine-700 shadow-[0_2px_10px_-4px_rgba(15,69,60,0.6)]",
    gold: "bg-gold-500 text-pine-950 hover:bg-gold-400 shadow-[0_2px_10px_-4px_rgba(201,137,31,0.7)]",
    outline: "border border-line bg-white text-ink-700 hover:border-pine-600 hover:text-pine-800",
    ghost: "text-pine-700 hover:bg-pine-50",
    danger: "border border-clay-100 bg-white text-clay-700 hover:bg-clay-50 hover:border-clay-600",
    dark: "bg-pine-950 text-pine-100 hover:bg-pine-900",
  };
  return (
    <button className={`${base} ${size} ${variants[variant]} ${className}`} {...rest}>
      {icon && <Icon name={icon} className={small ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={2} />}
      {children}
    </button>
  );
}

/* ---------------- Поля ---------------- */

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink-400">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-300 outline-none transition-all duration-150 focus:border-pine-600 focus:ring-2 focus:ring-pine-600/15 hover:border-pine-300";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input className={`${inputCls} ${className}`} {...rest} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return <textarea className={`${inputCls} resize-y leading-relaxed ${className}`} {...rest} />;
}

export function AmountInput({
  value,
  onChange,
  placeholder = "0",
}: {
  value: number;
  onChange: (n: number) => void;
  placeholder?: string;
}) {
  const [raw, setRaw] = useState(value ? String(value) : "");
  useEffect(() => {
    setRaw((prev) => {
      const parsed = Number(prev.replace(/\s/g, "").replace(",", "."));
      return Number.isFinite(parsed) && parsed > 0 && parsed === value ? prev : value ? String(value) : "";
    });
  }, [value]);

  const format = (s: string): string => {
    const digits = s.replace(/[^\d]/g, "");
    if (!digits) return "";
    return new Intl.NumberFormat("ru-RU").format(Number(digits));
  };

  return (
    <div className="relative">
      <input
        inputMode="numeric"
        value={raw}
        placeholder={placeholder}
        onChange={(e) => {
          const f = format(e.target.value);
          setRaw(f);
          const n = Number(f.replace(/\s/g, ""));
          onChange(Number.isFinite(n) ? n : 0);
        }}
        className={`${inputCls} pr-8 text-right tabular-nums font-semibold`}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-ink-400">
        ₽
      </span>
    </div>
  );
}

/* ---------------- Панели и заголовки секций ---------------- */

export function Panel({
  title,
  icon,
  children,
  action,
  className = "",
}: {
  title?: string;
  icon?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card-shadow rounded-xl border border-line bg-card ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-line/70 px-5 py-3.5">
          <h3 className="flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-[0.06em] text-pine-900">
            {icon && (
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pine-800 text-gold-400">
                <Icon name={icon} className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
            )}
            {title}
          </h3>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function SectionHeader({
  icon,
  title,
  desc,
  children,
}: {
  icon: string;
  title: string;
  desc: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-900 text-gold-400 shadow-[0_6px_16px_-8px_rgba(7,33,28,0.8)]">
          <Icon name={icon} className="h-5 w-5" strokeWidth={1.9} />
        </span>
        <div>
          <h2 className="font-display text-[19px] font-bold leading-tight text-ink-900">{title}</h2>
          <p className="mt-1 max-w-xl text-[12.5px] leading-relaxed text-ink-500">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-pine-100 bg-pine-50 px-4 py-3 text-[12px] leading-relaxed text-pine-800">
      <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-pine-600" strokeWidth={2} />
      <span>{children}</span>
    </p>
  );
}

/* ---------------- Тосты ---------------- */

type ToastType = "ok" | "warn";
interface ToastItem {
  id: number;
  text: string;
  type: ToastType;
}

const ToastCtx = createContext<{ push: (text: string, type?: ToastType) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast outside ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const push = useCallback((text: string, type: ToastType = "ok") => {
    const id = ++idRef.current;
    setItems((xs) => [...xs, { id, text, type }]);
    window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 4200);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[320px] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`anim-toast pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 shadow-lg ${
              t.type === "ok"
                ? "border-pine-800 bg-pine-900 text-pine-50"
                : "border-gold-400/50 bg-pine-950 text-gold-100"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                t.type === "ok" ? "bg-gold-500 text-pine-950" : "bg-gold-400 text-pine-950"
              }`}
            >
              <Icon name={t.type === "ok" ? "check" : "alert"} className="h-3 w-3" strokeWidth={2.6} />
            </span>
            <p className="text-[12.5px] font-semibold leading-snug">{t.text}</p>
            <button
              onClick={() => setItems((xs) => xs.filter((x) => x.id !== t.id))}
              className="ml-auto text-pine-300 transition-colors hover:text-white"
              aria-label="Закрыть"
            >
              <Icon name="close" className="h-3.5 w-3.5" strokeWidth={2.2} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------------- Модальное окно ---------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-pine-950/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="anim-pop relative w-full max-w-md rounded-2xl border border-line bg-card p-6 shadow-2xl">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="font-display text-[16px] font-bold text-ink-900">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-pine-50 hover:text-ink-900"
            aria-label="Закрыть"
          >
            <Icon name="close" className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>
        <div className="text-[13.5px] leading-relaxed text-ink-500">{children}</div>
        {actions && <div className="mt-6 flex justify-end gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}
