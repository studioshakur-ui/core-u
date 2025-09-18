// src/components/Logo.jsx
import React from "react";

export default function Logo({ variant = "auto", height = 20, alt = "CORE" }) {
  const isDark =
    variant === "auto"
      ? (typeof document !== "undefined" &&
          (document.documentElement.dataset.theme === "dark" ||
            window.matchMedia?.("(prefers-color-scheme: dark)")?.matches))
      : variant === "dark";

  const src = isDark
    ? "/assets/brand/core-logo-light.svg"
    : "/assets/brand/core-logo-dark.svg";

  return (
    <img
      src={src}
      height={height}
      alt={alt}
      style={{ display: "block" }}
      fetchPriority="high"
      decoding="async"
    />
  );
}
