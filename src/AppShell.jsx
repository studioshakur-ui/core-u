// src/AppShell.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header.jsx";

export default function AppShell() {
  return (
    <div id="main" style={{ minHeight: "100vh" }}>
      <Header />
      <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
