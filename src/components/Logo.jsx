import React from "react";
export default function Logo({ height = 20, alt = "CORE" }) {
  const src = "/assets/brand/core-logo-dark.svg";
  return <img src={src} height={height} alt={alt} style={{ display: "block" }} />;
}
