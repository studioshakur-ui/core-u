import React, { useState } from "react";
import GuardedRoute from "../components/GuardedRoute";
import HeaderStatus from "../components/HeaderStatus";
import HeaderPage from "../components/HeaderPage";
import Toast from "../components/Toast";
function CapoInner(){
  const [rows,setRows]=useState([{id:1,activity:'Posa cavi',hours:4,note:''},{id:2,activity:'Test continuità',hours:2,note:''}]);
  const [msg,setMsg]=useState('');
  const update=(id,key,val)=>{ const v=key==='hours'?Math.max(0,Math.min(12,Number(val))):val; setRows(prev=>prev.map(r=>r.id===id?{...r,[key]:v}:r)); if(key==='hours'&&(Number(val)>12||Number(val)<0)){ setMsg('Ore fuori range (0–12). Valore corretto automaticamente.'); setTimeout(()=>setMsg(''),3000);} };
  const total=rows.reduce((a,b)=>a+Number(b.hours||0),0);
  return (<div><HeaderStatus/><main className='p-6 space-y-4'>
    <HeaderPage title='Capo — Rapporto giornaliero' subtitle='Edizione inline, controlli dolci, preview PDF' image='/assets/ships/ship-yard.jpg'/>
    {msg && <Toast kind='info'>{msg}</Toast>}
    <div className='card p-3'>
      <table className='w-full text-sm'><thead className='opacity-70'><tr><th className='text-left p-2'>Attività</th><th className='text-left p-2'>Ore</th><th className='text-left p-2'>Note</th></tr></thead>
      <tbody>{rows.map(r=>(<tr key={r.id} className='border-t border-white/5'>
        <td className='p-2'><input className='input' value={r.activity} onChange={e=>update(r.id,'activity',e.target.value)}/></td>
        <td className='p-2 w-24'><input type='number' min='0' max='12' step='0.5' className='input' value={r.hours} onChange={e=>update(r.id,'hours',e.target.value)}/></td>
        <td className='p-2'><input className='input' value={r.note} onChange={e=>update(r.id,'note',e.target.value)}/></td>
      </tr>))}</tbody></table>
      <div className='flex justify-between items-center mt-3'><div className='opacity-80'>Totale ore: <b>{total}</b></div><button className='btn-primary'>Preview PDF</button></div>
    </div>
  </main></div>);}
export default function Capo(){ return (<GuardedRoute allow={['capo','manager','direzione']}><CapoInner/></GuardedRoute>); }
