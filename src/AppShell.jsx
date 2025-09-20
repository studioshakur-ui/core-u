import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header.jsx";
export default function AppShell() {
  return (<div id="main" style={{ minHeight: "100vh" }}><Header /><main style={{ padding: 24 }}><Outlet /></main></div>);
}
