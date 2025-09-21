import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import QRCode from 'qrcode'

function mm(v){ return v * 2.83465 } // mm -> pt

export async function createReportinoPDF({header, rows, attachments=[], hash=''}){
  // header = { logoDataUrl?, titolo, commessa, data, capo, org }
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([mm(210), mm(297)]) // A4 portrait
  const { width, height } = page.getSize()

  const margin = mm(15)
  const contentW = width - margin*2
  const startY = height - margin

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontB = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Header band
  let y = startY
  page.drawRectangle({ x: margin, y: y - mm(18), width: contentW, height: mm(18), color: rgb(0.95,0.95,0.97) })
  page.drawText(header?.titolo || 'RAPPORTINO DI GIORNATA', { x: margin+mm(6), y: y - mm(13), size: 12, font: fontB })
  y -= mm(24)

  // Meta
  const meta = [
    ['Commessa', header?.commessa || '-'],
    ['Data', header?.data || '-'],
    ['Capo', header?.capo || '-'],
    ['Organizzazione', header?.org || '-']
  ]
  let colW = contentW/2
  meta.forEach((kv, i)=>{
    const rowY = y - i*mm(8)
    page.drawText(kv[0]+':', { x: margin, y: rowY, size: 10, font: fontB })
    page.drawText(String(kv[1]), { x: margin+mm(35), y: rowY, size: 10, font })
  })
  y -= mm(8)*meta.length + mm(6)

  // Table header
  const cols = [
    { key:'attivita', label:'Attività', w: 0.40 },
    { key:'operatori', label:'Oper.', w: 0.18 },
    { key:'zona', label:'Zona', w: 0.12 },
    { key:'previsto', label:'Prev', w: 0.10 },
    { key:'prodotto', label:'Prod', w: 0.10 },
    { key:'ore_totali', label:'Ore', w: 0.10 },
  ]
  let x = margin
  page.drawRectangle({ x, y: y - mm(8), width: contentW, height: mm(8), color: rgb(0.9,0.9,0.95) })
  cols.forEach(c => {
    const w = contentW * c.w
    page.drawText(c.label, { x, y: y - mm(6), size: 9, font: fontB })
    x += w + mm(2)
  })
  y -= mm(12)

  // Table rows
  const lineH = mm(7)
  rows.forEach(r => {
    let cx = margin
    const values = [
      String(r.attivita || ''),
      Array.isArray(r.operatori) ? r.operatori.join(', ') : (r.operatore || ''),
      String(r.zona || ''),
      r.previsto!=null ? String(r.previsto) : '',
      r.prodotto!=null ? String(r.prodotto) : '',
      r.ore_totali!=null ? String(r.ore_totali) : '',
    ]
    values.forEach((val, i) => {
      const w = contentW * cols[i].w
      page.drawText(val.slice(0,42), { x: cx, y: y - mm(5), size: 9, font })
      cx += w + mm(2)
    })
    y -= lineH
    if(y < mm(40)){
      // Footer + new page
      y = mm(40)
    }
  })

  // Totals
  const totalOre = rows.reduce((a,b)=> a + (Number(b.ore_totali)||0), 0)
  page.drawText(`Totale ore: ${totalOre.toFixed(2)}`, { x: margin, y: y - mm(10), size: 10, font: fontB })
  y -= mm(16)

  // Annex: thumbnails text
  page.drawText('Allegati (elenco):', { x: margin, y: y - mm(6), size: 10, font: fontB })
  y -= mm(10)
  attachments.slice(0,8).forEach((a, idx) => {
    page.drawText(`• ${a.name || a.filename || 'file'} (${a.type || a.mime || ''})`, { x: margin, y: y - idx*mm(6), size: 9, font })
  })
  y -= mm(8) + mm(6)*Math.min(attachments.length, 8)

  // Signatures
  const sigY = mm(35)
  page.drawLine({ start: {x: margin, y: sigY}, end:{x: margin+mm(60), y: sigY}, thickness: 1, color: rgb(0,0,0)})
  page.drawText('Firma Capo', { x: margin, y: sigY - mm(6), size: 9, font })

  page.drawLine({ start: {x: width - margin - mm(60), y: sigY}, end:{x: width - margin, y: sigY}, thickness: 1, color: rgb(0,0,0)})
  page.drawText('Firma Manager', { x: width - margin - mm(60), y: sigY - mm(6), size: 9, font })

  // QR code with hash
  const qrText = hash || JSON.stringify({ commessa: header?.commessa, data: header?.data })
  const qrDataUrl = await QRCode.toDataURL(qrText, { margin: 0, width: 128 })
  const qrImageBytes = (function(){
  const base64 = qrDataUrl.split(',')[1];
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i=0;i<len;i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
})()
  const qrImage = await pdfDoc.embedPng(qrImageBytes)
  const qrSize = mm(24)
  page.drawImage(qrImage, { x: width - margin - qrSize, y: mm(10), width: qrSize, height: qrSize })

  return await pdfDoc.save()
}

export async function downloadReportinoPDF(props){
  const bytes = await createReportinoPDF(props)
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `Rapportino_${props?.header?.data || ''}.pdf`
  a.click()
}
