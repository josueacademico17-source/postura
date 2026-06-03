export class StatisticsSystem {
  constructor(state, workerManager) {
    this.state = state;
    this.workerManager = workerManager;
  }

  snapshot() {
    const workers = this.workerManager.data;
    const healthy = workers.filter((worker) => worker.healthy).length;
    const fatigue = Math.round(workers.reduce((sum, worker) => sum + worker.fatigue, 0) / workers.length);
    return {
      budget: this.state.budget,
      productivity: this.state.productivity,
      transformLevel: this.state.transformLevel,
      healthyWorkers: healthy,
      averageFatigue: fatigue,
      scanned: this.state.scannedNPCs.size,
    };
  }
}
