import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
const T={it:{title:'Accedi',email:'Email',password:'Password',remember:'Ricordami',login:'Entra',forgot:'Password dimenticata?',support:'Supporto',legal:'Note legali',privacy:'Privacy',cookies:'Cookies'},fr:{title:'Connexion',email:'Email',password:'Mot de passe',remember:'Se souvenir de moi',login:'Se connecter',forgot:'Mot de passe oublié ?',support:'Support',legal:'Mentions légales',privacy:'Confidentialité',cookies:'Cookies'},en:{title:'Sign in',email:'Email',password:'Password',remember:'Remember me',login:'Sign in',forgot:'Forgot password?',support:'Support',legal:'Legal',privacy:'Privacy',cookies:'Cookies'}};
export default function Login(){
  const n=useNavigate(); const {lang,setLang,setSession,fetchProfile}=useAuthStore(); const t=T[lang];
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  useEffect(()=>{(async()=>{ const {data}=await supabase.auth.getSession(); if(data.session){ await fetchProfile(); n('/'); } })();},[]);
  const onSubmit=async(e)=>{ e.preventDefault(); setLoading(True); setError(''); const {data,error}=await supabase.auth.signInWithPassword({email,password}); setLoading(false); if(error) return setError(error.message); setSession(data.session); await fetchProfile(); n('/'); };
  return (<div className='min-h-screen grid place-items-center p-4 relative overflow-hidden'>
    <img src='/assets/ships/ship-hero.jpg' alt='' className='absolute inset-0 w-full h-full object-cover opacity-40'/>
    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'/>
    <div className='relative w-full max-w-md card p-6'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'><img src='/assets/brand/logo-mark.svg' alt='CORE' className='w-7 h-7'/><h1 className='text-2xl font-semibold'>{t.title}</h1></div>
        <select className='bg-transparent border border-white/10 rounded p-1' value={lang} onChange={e=>setLang(e.target.value)}><option value='it'>IT</option><option value='fr'>FR</option><option value='en'>EN</option></select>
      </div>
      <form onSubmit={onSubmit} className='space-y-3'>
        <label className='block'><span className='text-sm'>{t.email}</span><input type='email' className='input mt-1' value={email} onChange={e=>setEmail(e.target.value)} required/></label>
        <label className='block'><span className='text-sm'>{t.password}</span><input type='password' className='input mt-1' value={password} onChange={e=>setPassword(e.target.value)} required/></label>
        <div className='flex items-center justify-between'><label className='inline-flex items-center gap-2 text-sm opacity-80'><input type='checkbox' defaultChecked/>{t.remember}</label><a className='text-sm link' href='/reset-password'>{t.forgot}</a></div>
        {error && <div className='text-red-400 text-sm'>{error}</div>}
        <button type='submit' disabled={loading} className='btn-primary w-full'>{loading?'...':t.login}</button>
      </form>
      <div className='flex items-center justify-between mt-4 text-sm opacity-80'>
        <a href='/legal' className='link'>{t.legal}</a><a href='/privacy' className='link'>{t.privacy}</a><a href='/cookies' className='link'>{t.cookies}</a><a href='mailto:support@example.com' className='link'>{t.support}</a>
      </div>
    </div>
  </div>);
}
