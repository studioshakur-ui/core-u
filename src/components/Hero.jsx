import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Hero premium CORE (sans logo)
 * - Fond vidéo 16:9 (muted, loop) + fallback image
 * - Overlay dégradé sombre pour lisibilité
 * - Titre + tagline + 2 CTA
 * - Animations framer-motion (désactivées si prefers-reduced-motion)
 *
 * Assets attendus :
 *   public/assets/hero.mp4  (8–20 Mo, 1920x1080 H.264)
 *   public/assets/hero.jpg  (fallback image)
 */
export default function Hero({
  title = "CORE",
  tagline = "CONTROLLA • ORGANIZZA • RIPORTA • ESEGUI",
  videoSrc = "/assets/hero.mp4",
  imageSrc = "/assets/hero.jpg",
  primaryHref = "#/demo",
  secondaryHref = "#main",
  className = "",
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={
        "relative h-[80vh] min-h-[560px] overflow-hidden bg-[#0f1117] " +
        className
      }
      aria-label="Introduzione di CORE"
    >
      {/* Media layer */}
      <MediaLayer videoSrc={videoSrc} imageSrc={imageSrc} />

      {/* Overlay sombre + gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 text-center text-white">
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-5xl font-extrabold tracking-tight md:text-6xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-3 text-lg tracking-widest text-white/85 md:text-2xl"
        >
          {tagline}
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 flex items-center gap-3"
          role="group"
          aria-label="Azioni principali"
        >
          <a
            href={primaryHref}
            className="relative inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-[#0b0b0b]
                       bg-[--core-accent] shadow-[0_10px_25px_rgba(0,255,156,.25)]
                       transition will-change-transform hover:translate-y-[-1px] active:translate-y-[0px]
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[--core-accent]"
          >
            <span>Inizia la Demo</span>
            {/* glow soft */}
            <span
              aria-hidden
              className="absolute inset-0 -z-10 rounded-xl blur-xl bg-[--core-accent]/40"
            />
          </a>

          <a
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium
                       border border-white/25 text-white/90 hover:bg-white/10
                       transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Scopri
          </a>
        </motion.div>

        {/* Petit watermark de version (optionnel) */}
        <div className="absolute bottom-6 right-6 text-xs text-white/40 select-none">
          v5
        </div>
      </div>
    </section>
  );
}

function MediaLayer({ videoSrc, imageSrc }) {
  // Rend fallback image si vidéo indisponible ou préfère réduire les animations
  const reduceMotion = useReducedMotion();

  return (
    <>
      {!reduceMotion ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          poster={imageSrc}
          aria-hidden="true"
        >
          <source src={videoSrc} type="video/mp4" />
          {/* Fallback si navigateur ne supporte pas la vidéo */}
          <img
            src={imageSrc}
            alt="Shipyard"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </video>
      ) : (
        <img
          src={imageSrc}
          alt="Shipyard"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </>
  );
}
