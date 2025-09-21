import React from "react";

export default function HeroEditorial(){
  return (
    <section className="hero-dark">
      <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-4">CORE</h1>
          <p className="text-lg opacity-90 mb-6">Cable • Operations • Reporting • Engineering</p>
          <div className="flex gap-3">
            <a className="btn-primary">Inizia ora</a>
            <a className="btn-outline">Scopri di più</a>
          </div>
        </div>
        <div className="bg-white/5 rounded-lg aspect-[16/10]"></div>
      </div>
    </section>
  );
}
