import React from 'react'

export default function AttachmentUploader({ onAdd }){
  async function onChange(e){
    const files = Array.from(e.target.files||[])
    const out = files.map(f=>({ name:f.name, type:f.type, blob:f }))
    onAdd(out)
    e.target.value = ''
  }
  return (
    <label className="px-3 py-2 rounded bg-slate-900 text-white hover:bg-slate-800 cursor-pointer inline-block">
      Joindre fichiers
      <input type="file" className="hidden" multiple accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" onChange={onChange}/>
    </label>
  )
}
