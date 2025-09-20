import React from "react";
import Header from "../components/Header";
import HeroCore from "../components/HeroCore";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { T } from "../i18n";

export default function Home(){
  const { lang } = useAppStore(); const t=T[lang];
  return (<div>
    <Header/>
    <main className="p-6 grid gap-6">
      <HeroCore/>
      <div className="grid md:grid-cols-3 gap-4">
        <Link to='/capo' className='card p-4 hover:-translate-y-0.5 transition hover:shadow-e2'>{t.home.capo}</Link>
        <Link to='/manager' className='card p-4 hover:-translate-y-0.5 transition hover:shadow-e2'>{t.home.manager}</Link>
        <Link to='/direzione' className='card p-4 hover:-translate-y-0.5 transition hover:shadow-e2'>{t.home.direzione}</Link>
      </div>
    </main>
  </div>);
}
