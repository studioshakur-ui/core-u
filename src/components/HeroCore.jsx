import React, { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";

const MAP = {
  it: [["C","Controlla"],["O","Organizza"],["R","Riporta"],["E","Esegui"]],
  fr: [["C","Contrôle"],["O","Organise"],["R","Rapporte"],["E","Exécute"]],
  en: [["C","Control"],["O","Organize"],["R","Report"],["E","Execute"]]
};

export default function HeroCore(){
  const { lang } = useAppStore();
  const [i,setI] = useState(0);
  useEffect(()=>{ const id=setInterval(()=>setI(v=>(v+1)%4),1600); return ()=>clearInterval(id); },[]);
  const list = MAP[lang] || MAP.it;
  return (
    <div className="relative rounded-xl2 overflow-hidden shadow-e3 border border-white/10">
      <img src="/assets/ships/core-hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"/>
      <div className="relative p-8 md:p-12">
        <div className="text-4xl md:text-6xl font-bold tracking-wide mb-2">CORE</div>
        <div className="text-sm md:text-base uppercase tracking-[0.25em] opacity-90">Cable • Operations • Reporting • Engineering</div>
        <div className="mt-6 grid grid-cols-4 gap-2 md:gap-4">
          {list.map(([letter, word], idx)=> (
            <div key={idx} className={"card backdrop-blur-sm bg-white/5 border-white/15 p-3 md:p-4 transition duration-300 "+(i===idx?'scale-105':'opacity-80')}>
              <div className="text-xl md:text-2xl font-bold">{letter}</div>
              <div className="text-sm md:text-base">{word}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
