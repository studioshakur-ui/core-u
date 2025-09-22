import * as XLSX from 'xlsx'
export function parseExcel(file){return new Promise((res,rej)=>{const rd=new FileReader(); rd.onload=e=>{try{const wb=XLSX.read(e.target.result,{type:'array'}); const ws=wb.Sheets[wb.SheetNames[0]]; const json=XLSX.utils.sheet_to_json(ws,{defval:''}); res(json)}catch(err){rej(err)}}; rd.onerror=rej; rd.readAsArrayBuffer(file)})}
