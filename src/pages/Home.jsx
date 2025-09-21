import React from "react";
import Header from "../components/Header";
import HeroEditorial from "../components/HeroEditorial";
import CardEditorial from "../components/CardEditorial";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { T } from "../i18n";

export default function Home(){
  const { lang } = useAppStore(); const t=T[lang];
  return (<div className="bg-white text-core-text">
    <Header/>
    <HeroEditorial/>
    <main className="section">
      <div className="container grid md:grid-cols-3 gap-6">
        <Link to='/capo'><CardEditorial title={t.home.capo} desc="Compila il rapportino quotidiano ed esporta in PDF." /></Link>
        <Link to='/manager'><CardEditorial title={t.home.manager} desc="Importa, verifica e pianifica con parsing potente." /></Link>
        <Link to='/direzione'><CardEditorial title={t.home.direzione} desc="KPI, rischi e export executive." /></Link>
      </div>
    </main>
    <footer className="border-t border-core-border">
      <div className="container py-10 grid md:grid-cols-4 gap-6 text-sm text-core-muted">
        <div><div className="font-semibold text-core-text mb-2">CORE</div><p>Enterprise Operations Suite.</p></div>
        <div><div className="font-semibold text-core-text mb-2">Risorse</div><ul className="space-y-1"><li><a className="hover:underline">Documentazione</a></li><li><a className="hover:underline">Assistenza</a></li></ul></div>
        <div><div className="font-semibold text-core-text mb-2">Prodotto</div><ul className="space-y-1"><li><a className="hover:underline">Capo</a></li><li><a className="hover:underline">Manager</a></li><li><a className="hover:underline">Direzione</a></li></ul></div>
        <div><div className="font-semibold text-core-text mb-2">Legale</div><ul className="space-y-1"><li><a className="hover:underline">Privacy</a></li><li><a className="hover:underline">Cookies</a></li></ul></div>
      </div>
    </footer>
  </div>);
}
