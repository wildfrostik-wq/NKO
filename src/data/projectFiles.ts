/**
 * Манифест исходников проекта: Vite встраивает текст каждого файла в бандл
 * через суффикс `?raw`, чтобы приложение могло собрать из них ZIP-архив
 * прямо в браузере пользователя.
 */
import pkg from "../../package.json?raw";
import viteConfig from "../../vite.config.js?raw";
import tsconfig from "../../tsconfig.json?raw";
import indexHtml from "../../index.html?raw";
import readme from "../../README.md?raw";
import gitignore from "../../.gitignore?raw";

import mainTsx from "../main.tsx?raw";
import appTsx from "../App.tsx?raw";
import indexCss from "../index.css?raw";
import typesTs from "../types.ts?raw";
import viteEnvDts from "../vite-env.d.ts?raw";

import formatTs from "../lib/format.ts?raw";
import imagesTs from "../lib/images.ts?raw";
import exportPdfTs from "../lib/exportPdf.ts?raw";
import downloadZipTs from "../lib/downloadZip.ts?raw";
import vkTs from "../lib/vk.ts?raw";

import botIndexJs from "../../bot/index.js?raw";
import botPkgJson from "../../bot/package.json?raw";
import botEnvExample from "../../bot/.env.example?raw";
import botReadme from "../../bot/README.md?raw";

import reportContextTsx from "../state/ReportContext.tsx?raw";

import demoTs from "./demo.ts?raw";
import projectFilesTs from "./projectFiles.ts?raw";

import iconsTsx from "../components/icons.tsx?raw";
import uiTsx from "../components/ui.tsx?raw";
import sidebarTsx from "../components/Sidebar.tsx?raw";

import orgStepTsx from "../components/steps/OrgStep.tsx?raw";
import metricsStepTsx from "../components/steps/MetricsStep.tsx?raw";
import financeStepTsx from "../components/steps/FinanceStep.tsx?raw";
import programsStepTsx from "../components/steps/ProgramsStep.tsx?raw";
import teamStepTsx from "../components/steps/TeamStep.tsx?raw";
import photosStepTsx from "../components/steps/PhotosStep.tsx?raw";
import previewStepTsx from "../components/steps/PreviewStep.tsx?raw";

import reportDocumentTsx from "../components/report/ReportDocument.tsx?raw";

export const PROJECT_FILES: Array<[string, string]> = [
  ["package.json", pkg],
  ["vite.config.js", viteConfig],
  ["tsconfig.json", tsconfig],
  ["index.html", indexHtml],
  ["README.md", readme],
  [".gitignore", gitignore],
  ["src/main.tsx", mainTsx],
  ["src/App.tsx", appTsx],
  ["src/index.css", indexCss],
  ["src/types.ts", typesTs],
  ["src/vite-env.d.ts", viteEnvDts],
  ["src/lib/format.ts", formatTs],
  ["src/lib/images.ts", imagesTs],
  ["src/lib/exportPdf.ts", exportPdfTs],
  ["src/lib/downloadZip.ts", downloadZipTs],
  ["src/lib/vk.ts", vkTs],
  ["bot/index.js", botIndexJs],
  ["bot/package.json", botPkgJson],
  ["bot/.env.example", botEnvExample],
  ["bot/README.md", botReadme],
  ["src/state/ReportContext.tsx", reportContextTsx],
  ["src/data/demo.ts", demoTs],
  ["src/data/projectFiles.ts", projectFilesTs],
  ["src/components/icons.tsx", iconsTsx],
  ["src/components/ui.tsx", uiTsx],
  ["src/components/Sidebar.tsx", sidebarTsx],
  ["src/components/steps/OrgStep.tsx", orgStepTsx],
  ["src/components/steps/MetricsStep.tsx", metricsStepTsx],
  ["src/components/steps/FinanceStep.tsx", financeStepTsx],
  ["src/components/steps/ProgramsStep.tsx", programsStepTsx],
  ["src/components/steps/TeamStep.tsx", teamStepTsx],
  ["src/components/steps/PhotosStep.tsx", photosStepTsx],
  ["src/components/steps/PreviewStep.tsx", previewStepTsx],
  ["src/components/report/ReportDocument.tsx", reportDocumentTsx],
];
