export function now(){ return new Date().toISOString() }
export function mergeFieldLevel(original, incoming){
  const out = {...original}
  for(const k of Object.keys(incoming)){
    const v = incoming[k]
    if(v && typeof v==='object' && 'value' in v && 'ts' in v){
      const cur = out[k]||{ ts: '1970-01-01T00:00:00Z', value: null }
      out[k] = (v.ts > cur.ts) ? v : cur
    }else{
      out[k]=incoming[k]
    }
  }
  return out
}