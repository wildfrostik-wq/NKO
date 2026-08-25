import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { ReportData } from "../types";
import { demoData } from "../data/demo";
import { sumRows } from "../lib/format";

const LS_KEY = "nko-annual-report-v3";

export type SaveState = "saved" | "saving" | "error";

export function emptyData(): ReportData {
  return {
    year: String(new Date().getFullYear()),
    org: {
      name: "",
      shortName: "",
      inn: "",
      ogrn: "",
      address: "",
      email: "",
      phone: "",
      site: "",
      bankAccount: "",
      bankName: "",
      bik: "",
      logo: "",
      mission: "",
      directorWord: "",
      directorName: "",
      directorTitle: "",
      partners: "",
    },
    metrics: { beneficiaries: 0, volunteers: 0, staff: 0, events: 0, custom: [] },
    finance: { income: [], expenses: [], note: "" },
    programs: [],
    team: [],
    photos: { cover: "", gallery: [] },
  };
}

function loadData(): ReportData {
  const base = emptyData();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<ReportData>;
    return {
      year: parsed.year ?? base.year,
      org: { ...base.org, ...(parsed.org ?? {}) },
      metrics: { ...base.metrics, ...(parsed.metrics ?? {}) },
      finance: { ...base.finance, ...(parsed.finance ?? {}) },
      programs: Array.isArray(parsed.programs) ? parsed.programs : [],
      team: Array.isArray(parsed.team) ? parsed.team : [],
      photos: { ...base.photos, ...(parsed.photos ?? {}) },
    };
  } catch {
    return base;
  }
}

interface ReportCtx {
  data: ReportData;
  saveState: SaveState;
  update: (fn: (d: ReportData) => ReportData) => void;
  loadDemo: () => void;
  resetAll: () => void;
  isPristine: boolean;
  completion: Record<string, boolean>;
  progress: number;
  incomeTotal: number;
  expenseTotal: number;
}

const Ctx = createContext<ReportCtx | null>(null);

export function ReportProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ReportData>(loadData);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSaveState("saving");
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, 450);
    return () => window.clearTimeout(t);
  }, [data]);

  const update = useCallback((fn: (d: ReportData) => ReportData) => {
    setData((d) => fn(d));
  }, []);

  const loadDemo = useCallback(() => {
    setData(demoData());
  }, []);

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      /* noop */
    }
    setData(emptyData());
  }, []);

  const value = useMemo<ReportCtx>(() => {
    const incomeTotal = sumRows(data.finance.income);
    const expenseTotal = sumRows(data.finance.expenses);
    const completion: Record<string, boolean> = {
      org: Boolean(data.org.name.trim() && data.org.mission.trim()),
      metrics: Boolean(String(data.year).trim() && data.metrics.beneficiaries > 0),
      finance: incomeTotal > 0 && expenseTotal > 0,
      programs: data.programs.length > 0,
      team: data.team.some((m) => m.firstName.trim() || m.lastName.trim()),
      photos: Boolean(data.photos.cover || data.photos.gallery.length > 0),
    };
    // «Команда» — необязательный раздел, на готовность не влияет
    const coreKeys = ["org", "metrics", "finance", "programs", "photos"];
    const filled = coreKeys.filter((k) => completion[k]).length;
    const isPristine =
      !data.org.name &&
      data.finance.income.length === 0 &&
      data.programs.length === 0 &&
      data.team.length === 0 &&
      data.metrics.beneficiaries === 0;
    return {
      data,
      saveState,
      update,
      loadDemo,
      resetAll,
      isPristine,
      completion,
      progress: Math.round((filled / coreKeys.length) * 100),
      incomeTotal,
      expenseTotal,
    };
  }, [data, saveState, update, loadDemo, resetAll]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useReport(): ReportCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useReport outside ReportProvider");
  return ctx;
}
