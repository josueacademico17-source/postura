export class SaveManager {
  constructor(key = 'inspector-postural-save') {
    this.key = key;
  }

  load() {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  save(state) {
    try {
      localStorage.setItem(
        this.key,
        JSON.stringify({
          budget: state.budget,
          productivity: state.productivity,
          transformLevel: state.transformLevel,
          totalPurchases: state.totalPurchases,
          totalSpent: state.totalSpent,
          ergoPuntos: state.ergoPuntos,
          scannedNPCs: Array.from(state.scannedNPCs),
        }),
      );
    } catch {
      // Local storage can be unavailable in private contexts.
    }
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}
