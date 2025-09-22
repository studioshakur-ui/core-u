import Fuse from 'fuse.js'

// exemple mini – à remplacer par ton vrai catalog depuis Supabase
const sample = [
  { code:'SAL-LAMP', title_it:'Saldatura supporto lampada' },
  { code:'SAL-CX',   title_it:'Saldatura supporto CX' },
  { code:'MONT-TUB', title_it:'Montaggio tubi' },
]

const fuse = new Fuse(sample, { keys:['title_it','code'], threshold:0.4 })

export function suggest(query){
  if(!query?.trim()) return []
  return fuse.search(query).slice(0,5).map(r=>r.item)
}
