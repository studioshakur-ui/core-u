import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderStatus from "../components/HeaderStatus";
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "../lib/supabaseClient";
import HeaderPage from "../components/HeaderPage";
export default function Home(){
  const n = useNavigate(); const { profile, fetchProfile } = useAuthStore();
  useEffect(()=>{(async()=>{ const {data}=await supabase.auth.getSession(); if(!data.session) return n('/login'); await fetchProfile(); })();},[]);
  return (<div><HeaderStatus/><main className='p-6 grid gap-4'>
    <HeaderPage title='CORE' subtitle='Cable Operations Reporting & Engineering' image='/assets/ships/ship-ambient.jpg'/>
    <div className='grid md:grid-cols-3 gap-4'>
      <Link to='/capo' className='card p-4 hover:-translate-y-0.5 transition duration-200 ease-out-quad hover:shadow-e2'>Capo</Link>
      <Link to='/manager' className='card p-4 hover:-translate-y-0.5 transition duration-200 ease-out-quad hover:shadow-e2'>Manager</Link>
      <Link to='/direzione' className='card p-4 hover:-translate-y-0.5 transition duration-200 ease-out-quad hover:shadow-e2'>Direzione</Link>
    </div>
    {!profile && <p className='opacity-70 text-sm'>Caricamento profilo...</p>}
  </main></div>);
}
