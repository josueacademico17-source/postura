import rules from '../data/postureRules.json';

export class PostureSystem {
  constructor(thresholds = rules.thresholds) {
    this.thresholds = thresholds;
  }

  evaluate(worker) {
    const posture = worker.posture;
    const issues = {
      neck: posture.neck > this.thresholds.neck,
      spine: posture.spine > this.thresholds.spine,
      wrist: posture.wrist > this.thresholds.wrist,
      seatedHours: worker.seatedHours > this.thresholds.seatedHours,
    };
    const count = Object.values(issues).filter(Boolean).length;
    const severity = count === 0 ? 'none' : count <= 2 ? 'moderate' : 'high';
    return { issues, count, severity, labels: rules.labels };
  }
}
