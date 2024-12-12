import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Inventory from "./Inventory";
import "./index.css"; // Make sure this points to your Tailwind CSS file

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/inventory" element={<Inventory />} />
    </Routes>
  </BrowserRouter>
);
