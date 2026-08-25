import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Локальные шрифты: надёжно встраиваются в canvas при генерации PDF
import "@fontsource/unbounded/500.css";
import "@fontsource/unbounded/700.css";
import "@fontsource/unbounded/800.css";
import "@fontsource/lora/400.css";
import "@fontsource/lora/400-italic.css";
import "@fontsource/lora/600.css";
import "@fontsource/lora/700.css";
import "@fontsource/lora/700-italic.css";
import "@fontsource/golos-text/400.css";
import "@fontsource/golos-text/500.css";
import "@fontsource/golos-text/600.css";
import "@fontsource/golos-text/700.css";
import "@fontsource/golos-text/800.css";

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
