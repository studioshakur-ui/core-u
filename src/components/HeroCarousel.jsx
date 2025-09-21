import React, { useEffect, useRef, useState } from "react";
export default function HeroCarousel({slides=[], intervalMs=6000}){
  const [i,setI]=useState(0); const wrap=(n)=> (n+slides.length)%slides.length;
  const next=()=>setI(v=>wrap(v+1)); const prev=()=>setI(v=>wrap(v-1));
  const pause=useRef(false);
  useEffect(()=>{ const m=window.matchMedia('(prefers-reduced-motion: reduce)'); if(m.matches||slides.length<=1) return;
    const id=setInterval(()=>{ if(!pause.current) next(); }, intervalMs); return ()=>clearInterval(id); },[slides.length,intervalMs]);
  return (
    <section className="bg-core-surface">
      <div className="container py-16 relative">
        <div className="relative overflow-hidden rounded-lg border border-core-border">
          <div className="relative aspect-[16/8] md:aspect-[16/6]" onMouseEnter={()=>pause.current=true} onMouseLeave={()=>pause.current=false}>
            <img src={slides[i]?.src} alt={slides[i]?.alt||''} className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 flex items-center">
              <div className="p-6 md:p-12 bg-white/80 backdrop-blur rounded-lg max-w-xl m-6 border border-core-border">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{slides[i]?.title}</h1>
                {slides[i]?.subtitle && <p className="text-lg text-core-muted mb-6">{slides[i].subtitle}</p>}
                <div className="flex gap-3">
                  {slides[i]?.cta1 && <a href={slides[i].cta1.href} className="btn-primary">{slides[i].cta1.label}</a>}
                  {slides[i]?.cta2 && <a href={slides[i].cta2.href} className="btn-outline">{slides[i].cta2.label}</a>}
                </div>
              </div>
            </div>
            {slides.length>1 && (<>
              <button onClick={prev} aria-label="Prev" className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2">‹</button>
              <button onClick={next} aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2">›</button>
            </>)}
          </div>
          {slides.length>1 && <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 hero-dots">
            {slides.map((_,idx)=>(<button key={idx} aria-current={idx===i} onClick={()=>setI(idx)} />))}
          </div>}
        </div>
      </div>
    </section>
  );
}
