// src/components/BrandLogo.jsx
export default function BrandLogo({ className = "", alt = "CORE v5" }) {
  return (
    <img
      src="/branding/logo.svg"
      alt={alt}
      className={className}
      width={120}
      height={24}
      decoding="async"
      loading="eager"
      style={{ display: "block" }}
    />
  );
}
