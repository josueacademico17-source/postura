export class ProductivitySystem {
  constructor(state, workerManager, eventBus) {
    this.state = state;
    this.workerManager = workerManager;
    this.eventBus = eventBus;
  }

  recalculate() {
    const workers = this.workerManager.data;
    const average = workers.reduce((sum, worker) => sum + worker.productivity, 0) / workers.length;
    this.state.productivity = Math.round(average);
    this.eventBus.emit('productivity:changed', this.state.productivity);
    return this.state.productivity;
  }
}
