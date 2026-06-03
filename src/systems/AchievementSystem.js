import achievements from '../data/achievements.json';

export class AchievementSystem {
  constructor(state, eventBus, notifications, soundManager) {
    this.state = state;
    this.eventBus = eventBus;
    this.notifications = notifications;
    this.soundManager = soundManager;
    this.unlocked = new Set();
    this.definitions = achievements;
  }

  setup() {
    this.eventBus.on('scanner:scanned', () => this.check('scan', this.state.scannedNPCs.size));
    this.eventBus.on('purchase:completed', () => this.check('purchase', this.state.totalPurchases));
    this.eventBus.on('budget:spent', () => this.check('spent', this.state.totalSpent));
    this.eventBus.on('ergopoints:changed', () => this.check('ergopoints', this.state.ergoPuntos));
    this.eventBus.on('workers:healthyChanged', (count) => this.check('healthyWorkers', count));
    this.eventBus.on('productivity:changed', (value) => this.check('productivity', value));
  }

  check(trigger, value) {
    achievements.forEach((achievement) => {
      if (this.unlocked.has(achievement.id)) return;
      if (achievement.trigger !== trigger || value < achievement.target) return;
      this.unlocked.add(achievement.id);
      this.addPoints(achievement.points ?? 0);
      this.popup(achievement);
      this.soundManager?.playAchievement();
    });
  }

  addPoints(amount, reason = 'Logro desbloqueado') {
    if (!amount) return;
    this.state.ergoPuntos += amount;
    this.eventBus.emit('ergopoints:changed', { points: this.state.ergoPuntos, amount, reason });
  }

  awardPoints(amount, reason) {
    this.addPoints(amount, reason);
  }

  isUnlocked(id) {
    return this.unlocked.has(id);
  }

  popup(achievement) {
    const area = document.getElementById('achievement-area');
    const node = document.createElement('div');
    node.className = 'achievement-popup';
    node.innerHTML = `
      <div class="achieve-icon">${achievement.icon ?? '🏆'}</div>
      <div class="achieve-text">
        <div class="achieve-title">🏆 LOGRO DESBLOQUEADO</div>
        <div class="achieve-name">${achievement.name}</div>
        <div class="achieve-desc">${achievement.description} · +${achievement.points ?? 0} pts</div>
      </div>
    `;
    area.appendChild(node);
    setTimeout(() => node.remove(), 5500);
  }
}
