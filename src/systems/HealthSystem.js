export class HealthSystem {
  constructor(state, workerManager, productivitySystem, eventBus) {
    this.state = state;
    this.workerManager = workerManager;
    this.productivitySystem = productivitySystem;
    this.eventBus = eventBus;
    this.lastFatigue = 0;
  }

  update(elapsed) {
    if (!this.state.gameStarted) return;
    if (elapsed - this.lastFatigue < 15) return;
    this.lastFatigue = elapsed;
    this.workerManager.updateFatigue();
    const productivity = this.productivitySystem.recalculate();
    this.eventBus.emit('health:fatigueTick', { productivity });
  }
}
