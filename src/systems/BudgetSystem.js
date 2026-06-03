export class BudgetSystem {
  constructor(state, eventBus) {
    this.state = state;
    this.eventBus = eventBus;
    this.lastIncome = 0;
  }

  spend(amount) {
    if (this.state.budget < amount) return false;
    this.state.budget -= amount;
    this.eventBus.emit('budget:changed', this.state.budget);
    return true;
  }

  add(amount, reason = 'income') {
    this.state.budget += amount;
    this.eventBus.emit('budget:changed', this.state.budget);
    this.eventBus.emit('budget:income', { amount, reason });
  }

  update(elapsed) {
    if (!this.state.gameStarted) return;
    if (elapsed - this.lastIncome < 30) return;
    this.lastIncome = elapsed;
    const income = Math.round(200 + (this.state.productivity / 100) * 300);
    this.add(income, 'passive');
    this.state.transformLevel = Math.min(100, this.state.transformLevel + (this.state.productivity / 100) * 3);
    this.eventBus.emit('transform:changed', this.state.transformLevel);
  }
}
