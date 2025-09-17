// src/components/BoatGallery.jsx
// Affiche un "hero" + une grille responsive à partir des fichiers de /public/assets

// ⚠️ Mets ici exactement les noms de fichiers visibles dans GitHub (capture que tu as montrée)
const FILES = [
  "adam-gonzales-A2MkCqYfSUw-unsplash.jpg",
  "alonso-reyes-LWfdBz46dnE-unsplash.jpg",
  "anthony-ketland-ZnyIunCZSso-unsplash.jpg",
  "jamie-morrison-dMqmsZ8u-D0-unsplash (1).jpg", // a des espaces + (1) → géré automatiquement
  "john-bell-Hlao3Y77M6U-unsplash.jpg",
  "phillip-flores-xvJ6LXoViTE-unsplash.jpg",

  // Tes ships (avif + jpg dispo)
  "ship1.jpg",
  "ship2.jpg",
  "ship3.jpg",
  "ship4.jpg",
];

// encode proprement les noms "sales" (espaces, parenthèses…)
function asset(name) {
  // encode uniquement le nom de fichier, pas tout le chemin
  return `/assets/${encodeURIComponent(name)}`;
}

// petit composant <picture> avec AVIF auto pour ship1..4
function Picture({ file, alt = "Immagine", priority = false }) {
  const isShip = /^ship[1-4]\.jpg$/i.test(file);
  const stem = file.replace(/\.[^/.]+$/, ""); // "ship1"
  const avif = isShip ? asset(`${stem}.avif`) : null;

  return (
    <picture>
      {avif && <source type="image/avif" srcSet={avif} />}
      <img
        src={asset(file)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ width: "100%", height: "auto", display: "block" }}
      />
    </picture>
  );
}

export default function BoatGallery() {
  if (!FILES.length) return null;

  const [hero, ...rest] = FILES; // la 1re image sert de "hero"

  return (
    <div className="space-y-6">
      {/* HERO */}
      <figure className="rounded-2xl overflow-hidden border border-white/10">
        <Picture file={hero} alt="Hero — Cruise ship" priority />
        <figcaption className="px-4 py-2 text-white/70 text-sm">
          Immagine hero (fonte /assets)
        </figcaption>
      </figure>

      {/* GALERIE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map((f) => (
          <div
            key={f}
            className="rounded-2xl overflow-hidden border border-white/10"
            title={f}
          >
            <Picture file={f} alt={f.replace(/[-_]/g, " ")} />
          </div>
        ))}
      </div>
    </div>
  );
}
