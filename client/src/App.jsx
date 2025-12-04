import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers/:id" element={<Dashboard />} />
      </Routes>
    </ToastProvider>
  );
}