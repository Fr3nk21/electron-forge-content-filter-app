import React from "react";
import { createRoot } from "react-dom/client";
import WebsiteBlocker from "./bloker";
import "./index.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <h2>What URL do you want to block?</h2>
      <WebsiteBlocker />
    </div>
  );
};

// Wait for the DOM to be fully loaded before creating the root
const renderApp = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
};

// Ensure the DOM is loaded before rendering
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderApp);
} else {
  renderApp();
}

export default App;
