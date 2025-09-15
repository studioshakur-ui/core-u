export function validateAndCommit({ schedule, entry, versionMap }){
  const key = `${entry.personId}|${entry.date}`
  const currentVersion = versionMap.get(key) || 0
  if(entry.version!==currentVersion){
    return { ok:false, error:'concurrent_edit', details:{ expected: currentVersion, got: entry.version } }
  }
  const conflict = schedule.some(s=> s.personId===entry.personId && s.date===entry.date && Math.max(s.start, entry.start)<Math.min(s.end, entry.end))
  if(conflict){
    return { ok:false, error:'conflict', details:{} }
  }
  versionMap.set(key, currentVersion+1)
  return { ok:true }
}