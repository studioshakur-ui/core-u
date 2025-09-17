// src/components/media/ResponsiveImage.jsx
// <ResponsiveImage base="/media/hero" alt="..." />
// attend les fichiers: hero.avif / hero.webp / hero-8k.jpg / hero-4k.jpg / hero-2k.jpg / hero-1k.jpg
export default function ResponsiveImage({ base, alt = "", className = "", priority = false }) {
  // On ne met pas de tailles "sizes" trop complexes ici; à adapter si besoin.
  return (
    <picture>
      <source type="image/avif" srcSet={`${base}.avif`} />
      <source type="image/webp" srcSet={`${base}.webp`} />
      <img
        src={`${base}-2k.jpg`}
        srcSet={`
          ${base}-1k.jpg 1000w,
          ${base}-2k.jpg 2000w,
          ${base}-4k.jpg 4000w,
          ${base}-8k.jpg 8000w
        `}
        sizes="100vw"
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ width: "100%", height: "auto", display: "block" }}
      />
    </picture>
  );
}
