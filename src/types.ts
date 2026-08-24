export interface FinanceRow {
  id: string;
  label: string;
  amount: number;
}

export interface Program {
  id: string;
  name: string;
  tag: string;
  budget: number;
  participants: number;
  result: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  caption: string;
}

export interface CustomMetric {
  id: string;
  label: string;
  value: string;
}

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  photo: string;
}

export interface OrgInfo {
  name: string;
  shortName: string;
  inn: string;
  ogrn: string;
  address: string;
  email: string;
  phone: string;
  site: string;
  bankAccount: string;
  bankName: string;
  bik: string;
  logo: string;
  mission: string;
  directorWord: string;
  directorName: string;
  directorTitle: string;
  partners: string;
}

export interface Metrics {
  beneficiaries: number;
  volunteers: number;
  staff: number;
  events: number;
  custom: CustomMetric[];
}

export interface Finance {
  income: FinanceRow[];
  expenses: FinanceRow[];
  note: string;
}

export interface Photos {
  cover: string;
  gallery: GalleryPhoto[];
}

export interface ReportData {
  year: string;
  org: OrgInfo;
  metrics: Metrics;
  finance: Finance;
  programs: Program[];
  team: TeamMember[];
  photos: Photos;
}

export type StepId = "org" | "metrics" | "finance" | "programs" | "team" | "photos" | "preview";

export interface StepMeta {
  id: StepId;
  title: string;
  short: string;
  desc: string;
  icon: string;
}
