import XlsxPopulate from "xlsx-populate";

const GREEN_HEXES = new Set(["92D050","C6EFCE","A9D08E","00FF00"]);
const isGreen = (hex) => !!hex && GREEN_HEXES.has(hex.replace("#",""));

export async function parseExcel(file) {
  const ab = await file.arrayBuffer();
  const wb = await XlsxPopulate.fromDataAsync(ab);
  const sheet = wb.sheet(0);
  const used = sheet.usedRange();
  const rows = used.value();
  const styles = used.styles();

  if (!rows || rows.length < 2) return [];
  const head = rows[0].map(v => String(v||"").trim().toLowerCase());
  const col = (names) => head.findIndex(h => names.includes(h));

  const iTeam      = col(["team","squadra","id team"]);
  const iSettimana = col(["settimana","week_start","lunedì"]);
  const iProgetto  = col(["progetto","codice progetto","project"]);
  const iImpianto  = col(["impianto","codice impianto","plant"]);
  const iUserId    = col(["user_id","uuid","id utente"]);
  const iRuolo     = col(["ruolo","mansione","role"]);

  const out = [];
  for (let r=1;r<rows.length;r++) {
    const row = rows[r] || [];
    const v = (i)=> i>=0 ? String(row[i]||"").trim() : "";
    const pr = {
      team:      v(iTeam)      || undefined,
      settimana: v(iSettimana) || undefined,
      progetto:  v(iProgetto)  || undefined,
      impianto:  v(iImpianto)  || undefined,
      user_id:   v(iUserId)    || undefined,
      ruolo:     v(iRuolo)     || undefined,
      isCapoVerde: false
    };

    if (iRuolo >= 0) {
      const st = (styles[r]||[])[iRuolo];
      const fill = st?.fill?.color || st?.fillColor;
      const hex = typeof fill === "string" ? fill : fill?.rgb;
      if (isGreen(hex)) pr.isCapoVerde = true;
    }

    if (Object.values(pr).some(Boolean)) out.push(pr);
  }
  return out;
}
