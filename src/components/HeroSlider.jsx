import React, { useEffect, useState } from 'react'
const sources = [
  {src:'/assets/ship1.avif',fallback:'/assets/ship1.jpg'},
  {src:'/assets/ship2.avif',fallback:'/assets/ship2.jpg'},
  {src:'/assets/ship3.avif',fallback:'/assets/ship3.jpg'},
  {src:'/assets/ship4.avif',fallback:'/assets/ship4.jpg'},
]
export default function HeroSlider(){
  const [idx,setIdx]=useState(0)
  useEffect(()=>{ const id = setInterval(()=> setIdx(i=> (i+1)%sources.length), 4000); return ()=> clearInterval(id) },[])
  return (
    <div className="hero">
      {sources.map((it,i)=> (<picture key={i}><source srcSet={it.src} type="image/avif"/><img src={it.fallback} alt="" className={i===idx? 'active':''} loading={i===0?'eager':'lazy'} /></picture>))}
      <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
        <img src="/assets/logo-core.png" className="w-28 h-28 mb-2" alt="CORE"/>
        <h1 className="text-4xl font-bold">CORE</h1>
        <p className="tracking-widest text-white/85 mt-1">CONTROLLA • ORGANIZZA • RIPORTA • ESEGUI</p>
        <div className="mt-5 flex gap-3">
          <a className="btn-primary" href="#/manager">Apri Manager</a>
          <a className="btn" href="#/direzione">Direzione</a>
        </div>
      </div>
    </div>
  )
}