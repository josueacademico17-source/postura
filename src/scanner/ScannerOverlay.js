import postureRules from '../data/postureRules.json';

export class ScannerOverlay {
  constructor(state, inspectionPanel) {
    this.state = state;
    this.inspectionPanel = inspectionPanel;
    this.overlay = document.getElementById('scanner-overlay');
    this.status = document.getElementById('scanner-status');
    this.diagnostic = document.getElementById('diagnostic');
    this.card = document.getElementById('npc-card');
    this.crosshair = document.getElementById('xhair');
  }

  setActive(active) {
    this.overlay.classList.toggle('active', active);
    this.diagnostic.classList.toggle('visible', active);
    this.status.classList.toggle('active-status', active);
    this.crosshair.classList.toggle('scanning', active);
    this.status.textContent = active ? 'ESCÁNER: ACTIVO' : 'ESCÁNER: INACTIVO';
    if (!active) this.hideWorkerCard();
  }

  outOfRange() {
    this.status.textContent = 'ESCÁNER: FUERA DE RANGO';
    this.emptyDiagnostic();
  }

  emptyDiagnostic() {
    ['neck', 'back', 'wrist', 'hours'].forEach((part) => {
      const icon = document.getElementById(`d-${part}-icon`);
      const value = document.getElementById(`d-${part}-val`);
      if (icon) {
        icon.className = 'diag-icon ok';
        icon.textContent = '🔵';
      }
      if (value) {
        value.className = 'diag-angle ok';
        value.textContent = '-';
      }
    });
    const severity = document.getElementById('d-severity');
    severity.textContent = 'APUNTA A UN EMPLEADO';
    severity.className = 'diag-severity sev-none';
  }

  showWorker(worker, evaluation) {
    const data = worker.data ?? worker;
    this.status.textContent = `ESCÁNER: ${data.name.toUpperCase()}`;
    this.setRow('neck', data.posture.neck, postureRules.thresholds.neck, `${data.posture.neck}°`);
    this.setRow('back', data.posture.spine, postureRules.thresholds.spine, `${data.posture.spine}°`);
    this.setRow('wrist', data.posture.wrist, postureRules.thresholds.wrist, `${data.posture.wrist}°`);
    this.setRow('hours', data.seatedHours, postureRules.thresholds.seatedHours, `${data.seatedHours.toFixed(1)} h`);
    const severity = document.getElementById('d-severity');
    severity.textContent = postureRules.severity[evaluation.severity];
    severity.className = `diag-severity ${evaluation.severity === 'none' ? 'sev-none' : evaluation.severity === 'moderate' ? 'sev-low' : 'sev-high'}`;
    this.showWorkerCard(data);
  }

  setRow(part, value, threshold, display) {
    const icon = document.getElementById(`d-${part}-icon`);
    const valueEl = document.getElementById(`d-${part}-val`);
    const bad = value > threshold;
    if (icon) {
      icon.className = `diag-icon ${bad ? 'bad' : 'ok'}`;
      icon.textContent = bad ? '🔴' : '🟢';
    }
    if (valueEl) {
      valueEl.textContent = display;
      valueEl.className = `diag-angle ${bad ? 'bad' : 'ok'}`;
    }
  }

  showWorkerCard(data) {
    document.getElementById('npc-avatar').textContent = data.emoji ?? data.initials;
    document.getElementById('npc-name').textContent = data.name;
    document.getElementById('npc-role').textContent = data.role;
    document.getElementById('npc-dialogue').textContent = `"${data.healthy ? data.dialogue.greeting : data.dialogue.pain}"`;
    const fatigue = document.getElementById('npc-fatigue');
    const productivity = document.getElementById('npc-productivity');
    fatigue.textContent = `${Math.round(data.fatigue)}%`;
    fatigue.className = `stat-chip-val ${data.fatigue > 60 ? 'red' : data.fatigue > 30 ? 'yellow' : 'green'}`;
    productivity.textContent = `${Math.round(data.productivity)}%`;
    productivity.className = `stat-chip-val ${data.productivity > 70 ? 'green' : data.productivity > 40 ? 'yellow' : 'red'}`;
    this.card.classList.add('visible');
    this.inspectionPanel?.selectWorker(data.id);
    this.state.selectedNPC = data;
  }

  hideWorkerCard() {
    this.card.classList.remove('visible');
    this.state.selectedNPC = null;
  }
}
