import React, { useState } from 'react'
import ManagerPlan from './ManagerPlan.jsx'
import ManagerOrganigramma from './ManagerOrganigramma.jsx'
import Tabs from '../components/Tabs.jsx'
export default function ManagerHub(){
  const [tab,setTab]=useState('plan')
  return (
    <div className="max-w-6xl mx-auto p-4">
      <Tabs value={tab} onChange={setTab} items={[{value:'plan',label:'Pianificazione'},{value:'org',label:'Organigramma'}]}/>
      {tab==='plan'? <ManagerPlan/> : <ManagerOrganigramma/>}
    </div>
  )
}