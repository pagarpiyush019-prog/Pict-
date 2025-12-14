import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

console.log("🚀 Starting React app...");

const container = document.getElementById("root");

if (!container) {
  console.error("❌ Root element not found!");
  throw new Error("Root element not found. Make sure there is a div with id='root' in your HTML.");
}

console.log("✅ Root container found, creating root...");

const root = createRoot(container);

console.log("✅ Rendering App component...");

root.render(<App />);

console.log("✅ App rendered!");
