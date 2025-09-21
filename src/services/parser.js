// Parser minimal pour v8.2 :
// - Détecte Capo par colonne Ruolo == 'Capo' (la détection par couleur sera ajoutée ensuite)
// - Regroupe Operai sous le dernier Capo rencontré
// - Émet un rapport d'anomalies structuré

export function parseRows(rows) {
  // rows: Array<{ Nome, Ruolo, Ore, Data, Team, Sito, Note?, PPE?, Docs?, CostoH? }>
  const out = {
    teams: {},         // teamName -> { capo: string|null, members: string[] }
    assignments: [],   // { date, team, operator, hours, notes }
    anomalies: [],     // { row, type, message }
  };
  let currentCapo = null;
  let currentTeam = null;

  rows.forEach((r, idx) => {
    const row = idx + 1;
    const nome = (r.Nome || r.nome || r.Name || "").toString().trim();
    const ruolo = (r.Ruolo || r.ruolo || r.Role || "").toString().trim().toLowerCase();
    const ore = Number(r.Ore || r.ore || r.Hours || 0);
    const data = r.Data || r.Giorno || r.Date || null;
    const team = (r.Team || r.team || "").toString().trim() || currentTeam;
    const note = r.Note || r.note || "";

    if (!nome) {
      out.anomalies.push({ row, type: "dato_vuoto", message: "Nome mancante" });
      return;
    }
    if (!team) {
      out.anomalies.push({ row, type: "team_mancante", message: `Team non specificato per ${nome}` });
    }

    if (ruolo === "capo") {
      currentCapo = nome;
      currentTeam = team || currentTeam || "SenzaTeam";
      const t = out.teams[currentTeam] || { capo: null, members: [] };
      t.capo = nome;
      out.teams[currentTeam] = t;
      if (!data) {
        out.anomalies.push({ row, type: "data_mancante", message: `Data non specificata (Capo ${nome})` });
      }
      return;
    }

    // Operaio
    if (!currentCapo) {
      out.anomalies.push({ row, type: "operatore_orfano", message: `Operaio senza Capo: ${nome}` });
    }
    const tname = team || currentTeam || "SenzaTeam";
    const t = out.teams[tname] || { capo: currentCapo, members: [] };
    if (!t.members.includes(nome)) t.members.push(nome);
    out.teams[tname] = t;

    // Heures & bornes
    if (isNaN(ore) || ore < 0) {
      out.anomalies.push({ row, type: "ore_invalidi", message: `Ore invalide per ${nome}` });
    } else if (ore > 12) {
      out.anomalies.push({ row, type: "ore_eccessive", message: `Ore > 12 per ${nome}` });
    }

    out.assignments.push({
      date: data ?? null,
      team: tname,
      operator: nome,
      hours: isNaN(ore) ? 0 : ore,
      notes: note
    });
  });

  // Capo senza Operai
  for (const [teamName, t] of Object.entries(out.teams)) {
    if (t.capo && (!t.members || t.members.length === 0)) {
      out.anomalies.push({ row: null, type: "capo_solo", message: `Capo senza Operai nel team ${teamName}` });
    }
  }

  return out;
}
