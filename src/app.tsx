import { createRoot } from "react-dom/client";
import WebsiteBlocker from "./bloker";

const root = createRoot(document.body);
root.render(
  <div>
    <h2>What URL do you want to block?</h2>
    <WebsiteBlocker />
  </div>,
);
