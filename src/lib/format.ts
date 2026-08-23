import type { FinanceRow } from "../types";

export const fmtNum = (n: number): string =>
  new Intl.NumberFormat("ru-RU").format(Math.round(n));

export const fmtMoney = (n: number): string => `${fmtNum(n)} ₽`;

export const fmtMoneyShort = (n: number): string => {
  if (Math.abs(n) >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} млн ₽`;
  }
  if (Math.abs(n) >= 10_000) return `${fmtNum(Math.round(n / 1000))} тыс. ₽`;
  return fmtMoney(n);
};

export function plural(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (d > 1 && d < 5) return forms[1];
  if (d === 1) return forms[0];
  return forms[2];
}

export const uid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export const sumRows = (rows: FinanceRow[]): number =>
  rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);

export const parseAmount = (raw: string): number => {
  const n = Number(raw.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
};

export const pad2 = (n: number): string => String(n).padStart(2, "0");
