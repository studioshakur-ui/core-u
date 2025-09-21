import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function WeeklyProductionChart({data}){
  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">Produzione settimanale — S vs S-1</div>
      <div style={{width:'100%', height:280}}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="S" stroke="#14B85A" dot={false} />
            <Line type="monotone" dataKey="S1" stroke="#94a3b8" strokeDasharray="4 6" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
