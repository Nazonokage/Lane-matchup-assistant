// Clear only this app's retired saved selections, never other origin storage.
export const retiredPreferenceKeys = [
  'laneLedgerGame', 'laneLedgerState:pc', 'laneLedgerState:wr',
  'laneLedgerState', 'laneLedgerDraft'
];
export function clearRetiredPreferences(storage) {
  for (const key of retiredPreferenceKeys) {
    try { storage.removeItem(key); } catch { /* Storage may be unavailable. */ }
  }
}
