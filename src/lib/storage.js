const KEY = 'core.capo.draft.v1'
export const saveDraft = (data) => localStorage.setItem(KEY, JSON.stringify(data||{}))
export const loadDraft = () => {
  try { return JSON.parse(localStorage.getItem(KEY)||'{}') } catch { return {} }
}
