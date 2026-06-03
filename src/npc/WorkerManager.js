import workersData from '../data/workers.json';
import { WorkerFactory } from './WorkerFactory.js';
import { SymptomsSystem } from './SymptomsSystem.js';

export class WorkerManager {
  constructor(scene, workstations) {
    this.scene = scene;
    this.workstations = workstations;
    this.factory = new WorkerFactory(scene);
    this.symptoms = new SymptomsSystem();
    this.workers = [];
  }

  build() {
    this.workers = workersData.map((data, index) => {
      const workerData = structuredClone(data);
      const workstation = this.workstations.get(workerData.stationId);
      if (!workstation) {
        throw new Error(`Missing workstation for ${workerData.stationId}`);
      }
      return this.factory.create(workerData, index, workstation);
    });
  }

  get data() {
    return this.workers.map((worker) => worker.data);
  }

  get groups() {
    return this.workers.map((worker) => worker.group);
  }

  get colliders() {
    return this.workers.map((worker) => worker.collider);
  }

  findById(id) {
    return this.workers.find((worker) => worker.data.id === id);
  }

  applyEffects(targetId, effects) {
    const targets = targetId === 'all'
      ? this.workers
      : this.workers.filter((worker) => worker.data.id === targetId);
    targets.forEach((worker) => this.symptoms.applyEffects(worker.data, effects));
  }

  updateFatigue() {
    this.symptoms.tickFatigue(this.data);
  }

  update(time, camera) {
    this.workers.forEach((worker, index) => worker.update(time, camera, index));
  }
}
