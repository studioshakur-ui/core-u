// catalog minimal (exemples — complète avec tes vraies activités)
const CATALOG = [
  { code: 'SAL-LAMP',  title_it: 'Saldatura supporto lampada' },
  { code: 'SAL-CX',    title_it: 'Saldatura supporto CX' },
  { code: 'SAL-PRE',   title_it: 'Saldatura supporto prese/interruttori' },
  { code: 'RIL-LAMP',  title_it: 'Rilievo misure a bordo per lampade' },
  { code: 'VARIE',     title_it: 'Varie SDCN' },
]

export function suggest(query) {
  if (!query) return []
  const q = String(query).toLowerCase()
  return CATALOG.filter(it =>
    it.title_it.toLowerCase().includes(q) || it.code.toLowerCase().includes(q)
  ).slice(0, 6)
}
