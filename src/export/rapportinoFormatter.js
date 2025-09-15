import jsPDF from 'jspdf'
export function rowsToCSV(rows){
  const headers=['data','team','capo','membri','attivita','impianto','ore','note']
  const toRow=(r)=>{
    const membri = (r.membri||[]).join(' ')
    return [r.data||'', r.team||'', r.capo||'', membri, r.descrizione||'', r.impiantoId||'', r.ore||0, r.note||'']
  }
  const out=[headers.join(',')]
  for(const r of rows){ out.push(toRow(r).map(x=>`"${(''+x).replace(/"/g,'""')}"`).join(',')) }
  return out.join('\n')
}
export function rowsToPDF(rows){
  const pdf = new jsPDF('p','mm','a4')
  pdf.setFontSize(12)
  pdf.text('Rapportino giornaliero', 10, 12)
  let y = 20
  rows.forEach((r,i)=>{
    pdf.setFont(undefined,'bold')
    pdf.text(`${i+1}. ${r.descrizione||''}`, 10, y)
    pdf.setFont(undefined,'normal')
    y+=6
    pdf.text(`Impianto: ${r.impiantoId||''}  •  Ore: ${r.ore||0}  •  Membri: ${(r.membri||[]).join(' ')}`, 10, y)
    y+=8
    if(y>270){ pdf.addPage(); y=20 }
  })
  return pdf
}