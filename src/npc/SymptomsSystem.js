export class SymptomsSystem {
  applyEffects(worker, effects) {
    if (effects.spine !== undefined) worker.posture.spine = Math.max(0, worker.posture.spine + effects.spine);
    if (effects.neck !== undefined) worker.posture.neck = Math.max(0, worker.posture.neck + effects.neck);
    if (effects.wrist !== undefined) worker.posture.wrist = Math.max(0, worker.posture.wrist + effects.wrist);
    if (effects.fatigue !== undefined) worker.fatigue = Math.max(0, worker.fatigue + effects.fatigue);
    if (effects.prod !== undefined) worker.productivity = Math.min(100, worker.productivity + effects.prod);
    worker.healthy = worker.fatigue < 30 && worker.posture.spine < 12 && worker.posture.neck < 15 && worker.posture.wrist < 15;
  }

  tickFatigue(workers) {
    workers.forEach((worker) => {
      if (worker.healthy) return;
      worker.fatigue = Math.min(100, worker.fatigue + 3);
      worker.productivity = Math.max(5, worker.productivity - 2);
      worker.seatedHours += 0.25;
    });
  }
}
