export function extractPersonName(raw){
  if(!raw) return ""
  let s = String(raw)
    .replace(/\s+/g,' ')
    .replace(/<[^>]*>/g,'')
    .replace(/[\w.+-]+@[\w.-]+\.\w+/g,'')
    .replace(/\+?\d[\d\s().-]{6,}/g,'')
    .replace(/\(.*?\)|\[.*?\]|\{.*?\}/g,'')
    .replace(/CAPO|RESP\w*|RESPONSABILE|TEAM|SQUADRA|SETTIMANA|GENERALE|IMPIANTO|APP\.?\s*MOTORE|COSTR\.?|CARPENTIERIA|FUORI\s+CABINA/gi,'')
    .replace(/[-–—|•;:,#]+/g,' ')
    .trim()
  s = s.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' ]/g,' ').replace(/\s+/g,' ').trim()
  const tokens = s.split(' ').filter(Boolean)
  if(tokens.length < 2) return ""
  let cand = tokens.slice(0, Math.min(3, tokens.length)).join(' ')
  cand = cand.toLowerCase().replace(/\b([a-zà-öø-ÿ']+)/g, (m)=> m[0].toUpperCase()+m.slice(1))
  if(cand.split(' ').length < 2) return ""
  return cand
}