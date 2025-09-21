import React from "react";
import Header from "../components/Header";
import HeroCarousel from "../components/HeroCarousel";
import { Link } from "react-router-dom";

const slides=[
  { src:"/assets/hero/ship-1.jpg", alt:"Navire 1", title:"Pilotez vos opérations câble", subtitle:"Capo, Manager, Direction — unifié, fiable et rapide.", cta1:{label:"Démarrer", href:"/login"}, cta2:{label:"Découvrir", href:"/manager"} },
  { src:"/assets/hero/ship-2.jpg", alt:"Navire 2", title:"Import Excel haut niveau", subtitle:"CSV/XLSX, mapping intelligent, dry-run et corrections.", cta1:{label:"Importer", href:"/manager"}, cta2:{label:"Voir erreurs", href:"/manager"} },
  { src:"/assets/hero/ship-3.jpg", alt:"Navire 3", title:"KPIs Direction en un clic", subtitle:"Capacité, couverture, coûts, risques et export exécutif.", cta1:{label:"Voir KPIs", href:"/direzione"}, cta2:{label:"Exporter PDF", href:"/direzione"} },
];

export default function Home(){
  return (<div className="bg-white text-core-text">
    <Header/>
    <HeroCarousel slides={slides}/>
    <main className="section">
      <div className="container grid md:grid-cols-3 gap-6">
        <Link to='/capo' className='card p-6 hover:shadow-e1 transition'><div className='text-xl font-semibold mb-2'>Capo</div><p className='text-core-muted'>Rapportino quotidien + export PDF.</p></Link>
        <Link to='/manager' className='card p-6 hover:shadow-e1 transition'><div className='text-xl font-semibold mb-2'>Manager</div><p className='text-core-muted'>Nuage d’opérai → équipes (drag & drop) + imports puissants.</p></Link>
        <Link to='/direzione' className='card p-6 hover:shadow-e1 transition'><div className='text-xl font-semibold mb-2'>Direction</div><p className='text-core-muted'>KPIs, risques, export exécutif.</p></Link>
      </div>
    </main>
    <footer className="border-t border-core-border">
      <div className="container py-10 grid md:grid-cols-4 gap-6 text-sm text-core-muted">
        <div><div className="font-semibold text-core-text mb-2">CORE</div><p>Enterprise Operations Suite.</p></div>
        <div><div className="font-semibold text-core-text mb-2">Ressources</div><ul className="space-y-1"><li><a className="hover:underline">Documentation</a></li><li><a className="hover:underline">Support</a></li></ul></div>
        <div><div className="font-semibold text-core-text mb-2">Produit</div><ul className="space-y-1"><li><a className="hover:underline">Capo</a></li><li><a className="hover:underline">Manager</a></li><li><a className="hover:underline">Direzione</a></li></ul></div>
        <div><div className="font-semibold text-core-text mb-2">Légal</div><ul className="space-y-1"><li><a className="hover:underline">Privacy</a></li><li><a className="hover:underline">Cookies</a></li></ul></div>
      </div>
    </footer>
  </div>);
}
