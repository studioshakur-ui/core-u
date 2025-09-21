export const fmtPerc = (v) => `${(v*100).toFixed(1)}%`
export const fmtCurr = (euro) => `€ ${new Intl.NumberFormat('it-IT',{maximumFractionDigits:1}).format(euro)}`
export const todayISO = () => new Date().toISOString().slice(0,10)
