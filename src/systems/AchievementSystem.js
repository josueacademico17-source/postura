import achievements from '../data/achievements.json';

export class AchievementSystem {
  constructor(state, eventBus, notifications) {
    this.state = state;
    this.eventBus = eventBus;
    this.notifications = notifications;
    this.unlocked = new Set();
  }

  setup() {
    this.eventBus.on('scanner:scanned', () => this.check('scan', this.state.scannedNPCs.size));
    this.eventBus.on('purchase:completed', () => this.check('purchase', this.state.totalPurchases));
    this.eventBus.on('productivity:changed', (value) => this.check('productivity', value));
  }

  check(trigger, value) {
    achievements.forEach((achievement) => {
      if (this.unlocked.has(achievement.id)) return;
      if (achievement.trigger !== trigger || value < achievement.target) return;
      this.unlocked.add(achievement.id);
      this.notifications.show(`Logro desbloqueado: ${achievement.name}`, 'success');
    });
  }
}
