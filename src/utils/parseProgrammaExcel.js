import ExcelJS from 'exceljs'
import { extractPersonName } from './names'
export async function previewProgrammaNamesOnly(file){
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.load(await file.arrayBuffer())
  const ws = wb.getWorksheet('PROGRAMMA') || wb.worksheets[0]
  const groups = []
  ws.columns.forEach((col, i) => {
    let capo=null, members=[], emptyRun=0, capoLocked=false
    col.eachCell({ includeEmpty:true }, (cell)=>{
      const raw = (cell?.value && (cell.value.text || cell.value)) || ""
      const name = extractPersonName(raw)
      const isEmpty = !name
      if(isEmpty){ emptyRun++ } else { emptyRun=0 }
      if(!capoLocked && name){ capo = name; capoLocked = true; return }
      if(capoLocked && name){ members.push(name); return }
      if(capoLocked && emptyRun>=2){ return }
    })
    if(capo) groups.push({ col:i+1, capo, members })
  })
  return groups
}