import React,{useState} from 'react'
import { supabase } from '../lib/supabase.js'

export default function Home(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  async function handleLogin(e){
    e.preventDefault()
    const { error }=await supabase.auth.signInWithPassword({email,password})
    if(error) setError('Credenziali non valide')
  }
  return(<section className="p-8 text-center">
    <h1 className="text-4xl font-bold mb-4">CORE — Cable Operations Reporting & Engineering</h1>
    <form onSubmit={handleLogin} className="max-w-sm mx-auto space-y-3">
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border px-3 py-2 rounded"/>
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border px-3 py-2 rounded"/>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Accedi</button>
    </form>
  </section>)
}
