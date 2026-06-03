import narrativeEvents from '../data/narrativeEvents.json';

export class NarrativeSystem {
  constructor(state, eventBus, notifications, budgetSystem) {
    this.state = state;
    this.eventBus = eventBus;
    this.notifications = notifications;
    this.budgetSystem = budgetSystem;
    this.triggered = new Set();
  }

  setup() {
    this.eventBus.on('game:started', () => this.check('immediate', 0));
    this.eventBus.on('scanner:scanned', () => this.check('scan', this.state.scannedNPCs.size));
    this.eventBus.on('purchase:completed', () => this.check('purchase', this.state.totalPurchases));
    this.eventBus.on('productivity:changed', (value) => this.check('productivity', value));
  }

  check(type, value) {
    narrativeEvents.forEach((event) => {
      if (this.triggered.has(event.id)) return;
      let shouldTrigger = event.triggerType === 'immediate' && type === 'immediate';
      if (event.triggerType === type && typeof event.triggerVal === 'number') shouldTrigger = value >= event.triggerVal;
      if (!shouldTrigger) return;
      this.triggered.add(event.id);
      this.notifications.email(event);
      if (event.category === 'positive' && event.triggerType === 'productivity') {
        this.budgetSystem.add(500, 'ceo_bonus');
      }
    });
  }
}
