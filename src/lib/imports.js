export function diffEntities(current, incoming, key='id'){
  const curMap = new Map(current.map(x=>[x[key], x]))
  const incMap = new Map(incoming.map(x=>[x[key], x]))
  const adds = incoming.filter(x=>!curMap.has(x[key]))
  const updates = incoming.filter(x=>{
    const prev = curMap.get(x[key]); if(!prev) return false
    return JSON.stringify(prev)!==JSON.stringify(x)
  })
  const removes = current.filter(x=>!incMap.has(x[key]))
  return { adds, updates, removes }
}
export function toCSV(rows){
  if(!rows.length) return ''
  const headers = Object.keys(rows[0])
  const esc = (s)=>(''+s).replace(/"/g,'""')
  const out = [headers.join(',')]
  for(const r of rows){
    out.push(headers.map(h=> `"${esc(r[h]??'')}"`).join(','))
  }
  return out.join('\n')
}