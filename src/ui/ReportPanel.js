export class ReportPanel {
  constructor(state, statisticsSystem, workerManager, achievements) {
    this.state = state;
    this.statisticsSystem = statisticsSystem;
    this.workerManager = workerManager;
    this.achievements = achievements;
    this.panel = document.getElementById('stats-panel');
    this.closeButton = document.getElementById('stats-close');
  }

  setup() {
    this.closeButton?.addEventListener('click', () => this.close());
  }

  toggle() {
    if (this.state.statsOpen) this.close();
    else this.open();
  }

  open() {
    this.state.statsOpen = true;
    this.update();
    this.panel.classList.add('open');
    if (document.pointerLockElement) document.exitPointerLock();
  }

  close() {
    this.state.statsOpen = false;
    this.panel.classList.remove('open');
  }

  update() {
    if (!this.state.statsOpen) return;
    const stats = this.statisticsSystem.snapshot();
    const elapsed = this.state.startTime ? Math.floor((Date.now() - this.state.startTime) / 1000) : 0;
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    document.getElementById('st-time').textContent = `${minutes}:${seconds}`;
    document.getElementById('st-scanned').textContent = `${stats.scanned}/${this.workerManager.workers.length}`;
    document.getElementById('st-spent').textContent = `${this.state.totalSpent.toLocaleString('es')} €`;
    document.getElementById('st-pts').textContent = this.state.ergoPuntos;

    const npcList = document.getElementById('npc-status-list');
    npcList.innerHTML = '';
    this.workerManager.data.forEach((worker) => {
      const row = document.createElement('div');
      row.className = 'npc-status-row';
      row.innerHTML = `<span class="npc-status-name">${worker.initials} ${worker.name} - ${worker.role}</span><span class="npc-status-badge ${worker.healthy ? 'ok' : 'bad'}">${worker.healthy ? '✓ SALUDABLE' : '⚠ PROBLEMA'}</span>`;
      npcList.appendChild(row);
    });

    const achievementList = document.getElementById('achievement-list');
    achievementList.innerHTML = '';
    this.achievements.definitions.forEach((achievement) => {
      const badge = document.createElement('div');
      badge.className = `ach-badge${this.achievements.isUnlocked(achievement.id) ? '' : ' locked'}`;
      badge.textContent = `${achievement.icon} ${achievement.name}`;
      achievementList.appendChild(badge);
    });
  }
}
