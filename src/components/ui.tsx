import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { Icon } from "./icons";
import { parseAmount } from "../lib/format";

/* ------------------------------ Toasts ------------------------------ */

type ToastType = "ok" | "warn" | "info";
interface Toast {
  id: number;
  text: string;
  type: ToastType;
}

const ToastCtx = createContext<{
  push: (text: string, type?: ToastType) => void;
}>({ push: () => undefined });

export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((text: string, type: ToastType = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-3), { id, text, type }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3800);
  }, []);

  const tone: Record<ToastType, string> = {
    ok: "border-pine-200 bg-pine-50 text-pine-800",
    warn: "border-gold-400/60 bg-gold-50 text-gold-700",
    info: "border-line bg-card text-ink-700",
  };
  const iconOf: Record<ToastType, string> = { ok: "check", warn: "alert", info: "info" };

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`anim-toast pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[13px] font-semibold shadow-lg ${tone[t.type]}`}
          >
            <Icon name={iconOf[t.type]} className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} />
            <span className="leading-snug">{t.text}</span>
            <button
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              className="ml-auto opacity-50 transition-opacity hover:opacity-100"
              aria-label="Закрыть уведомление"
            >
              <Icon name="close" className="h-3.5 w-3.5" strokeWidth={2.4} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ------------------------------ Modal ------------------------------ */

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
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-pine-950/60 backdrop-blur-[3px]" onClick={onClose} />
      <div className="anim-pop relative w-full max-w-md rounded-2xl border border-line bg-card p-6 shadow-2xl">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="font-display text-[16px] font-bold leading-snug text-ink-900">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-clay-50 hover:text-clay-600"
            aria-label="Закрыть"
          >
            <Icon name="close" className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>
        <div className="text-[13.5px] leading-relaxed text-ink-500">{children}</div>
        {actions && <div className="mt-5 flex justify-end gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}

/* ------------------------------ Button ------------------------------ */

const BTN_STYLES: Record<string, string> = {
  primary:
    "bg-pine-800 text-pine-50 hover:bg-pine-700 active:bg-pine-900 shadow-[0_6px_16px_-8px_rgba(15,69,60,0.7)]",
  gold: "bg-gold-500 text-pine-950 hover:bg-gold-400 active:bg-gold-600 shadow-[0_6px_16px_-8px_rgba(201,137,31,0.8)]",
  outline:
    "border border-line bg-card text-ink-700 hover:border-pine-300 hover:bg-pine-50 active:bg-pine-100",
  ghost: "text-ink-500 hover:bg-pine-50 hover:text-pine-800",
  danger: "border border-clay-100 bg-clay-50 text-clay-700 hover:bg-clay-100 active:bg-clay-100",
  dark: "bg-pine-950 text-pine-100 hover:bg-pine-900 active:bg-pine-950",
};

export function Button({
  variant = "primary",
  small = false,
  icon,
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof BTN_STYLES;
  small?: boolean;
  icon?: string;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${
        small ? "px-3 py-2 text-[12px]" : "px-4 py-2.5 text-[13.5px]"
      } ${BTN_STYLES[variant]} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} className={small ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={2.1} />}
      {children}
    </button>
  );
}

/* ------------------------------ Inputs ------------------------------ */

const FIELD_BASE =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[13.5px] font-medium text-ink-900 placeholder:font-normal placeholder:text-ink-300 outline-none transition-all duration-150 focus:border-pine-600 focus:ring-2 focus:ring-pine-600/15";

export function TextInput({
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${FIELD_BASE} ${className}`} {...rest} />;
}

export function TextArea({
  className = "",
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${FIELD_BASE} resize-y leading-relaxed ${className}`} {...rest} />;
}

/** Денежное поле: ввод текста → число в рублях. */
export function AmountInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [raw, setRaw] = useState(value ? String(value) : "");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setRaw(value ? String(value) : "");
  }, [value, focused]);

  return (
    <div className="relative">
      <input
        inputMode="numeric"
        value={
          focused
            ? raw
            : value
              ? new Intl.NumberFormat("ru-RU").format(value)
              : ""
        }
        onChange={(e) => {
          setRaw(e.target.value);
          onChange(parseAmount(e.target.value));
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="0"
        className={`${FIELD_BASE} pr-8 text-right tabular-nums`}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-ink-400">
        ₽
      </span>
    </div>
  );
}

/* ------------------------------ Layout ------------------------------ */

export function Field({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[11px] font-medium text-ink-300">{hint}</span>}
    </label>
  );
}

export function Panel({
  title,
  icon,
  action,
  className = "",
  children,
}: {
  title?: string;
  icon?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`card-shadow rounded-xl border border-line bg-card p-5 sm:p-6 ${className}`}>
      {title && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5">
            {icon && (
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pine-50 text-pine-700">
                <Icon name={icon} className="h-4 w-4" strokeWidth={1.9} />
              </span>
            )}
            <h2 className="text-[14px] font-bold text-ink-900">{title}</h2>
          </div>
          {action && <div className="ml-auto">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-pine-100 bg-pine-50/70 px-4 py-3 text-[12px] font-medium leading-relaxed text-pine-800">
      <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-pine-600" strokeWidth={2} />
      <span>{children}</span>
    </div>
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
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-start gap-4">
        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pine-800 text-gold-400 shadow-[0_10px_20px_-10px_rgba(15,69,60,0.9)]">
          <Icon name={icon} className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <div>
          <h1 className="font-display text-[22px] font-bold leading-tight text-ink-900 sm:text-[26px]">
            {title}
          </h1>
          <p className="mt-1 max-w-xl text-[13px] font-medium leading-relaxed text-ink-400">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
