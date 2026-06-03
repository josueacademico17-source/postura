import { SHOP_ITEMS } from '../utils/Constants.js';

export class InspectionPanel {
  constructor(state, eventBus, workerManager, budgetSystem, productivitySystem, notifications) {
    this.state = state;
    this.eventBus = eventBus;
    this.workerManager = workerManager;
    this.budgetSystem = budgetSystem;
    this.productivitySystem = productivitySystem;
    this.notifications = notifications;
    this.shop = document.getElementById('shop');
    this.list = document.getElementById('shop-items-list');
    this.select = document.getElementById('shop-npc-sel');
    this.closeButton = document.getElementById('shop-close');
  }

  setup() {
    this.workerManager.data.forEach((worker) => {
      const option = document.createElement('option');
      option.value = worker.id;
      option.textContent = `${worker.initials} - ${worker.name} / ${worker.role}`;
      this.select.appendChild(option);
    });

    SHOP_ITEMS.forEach((item) => {
      const node = document.createElement('div');
      node.className = 'shop-item';
      node.id = `shop-item-${item.id}`;
      node.innerHTML = `
        <div class="shop-item-header">
          <div class="shop-item-icon">${item.icon}</div>
          <div>
            <div class="shop-item-name">${item.name}</div>
            <div class="shop-item-desc">${item.desc}</div>
          </div>
        </div>
        <div class="shop-item-price">${item.price.toLocaleString('es')} EUR</div>
        <div class="shop-item-effect">${item.tags.map((tag) => `<span class="effect-tag">${tag}</span>`).join('')}</div>
      `;
      node.addEventListener('click', () => this.purchase(item));
      this.list.appendChild(node);
    });

    this.closeButton.addEventListener('click', () => this.close());
    this.shop.addEventListener('click', (event) => {
      if (event.target === this.shop) this.close();
    });
    this.eventBus.on('budget:changed', () => this.refresh());
    this.refresh();
  }

  toggle() {
    if (this.state.shopOpen) this.close();
    else this.open();
  }

  open() {
    this.state.shopOpen = true;
    this.shop.classList.add('open');
    if (document.pointerLockElement) document.exitPointerLock();
    this.refresh();
  }

  close() {
    this.state.shopOpen = false;
    this.shop.classList.remove('open');
  }

  selectWorker(workerId) {
    if ([...this.select.options].some((option) => option.value === workerId)) this.select.value = workerId;
  }

  refresh() {
    SHOP_ITEMS.forEach((item) => {
      const node = document.getElementById(`shop-item-${item.id}`);
      if (node) node.classList.toggle('disabled', this.state.budget < item.price);
    });
  }

  purchase(item) {
    if (!this.budgetSystem.spend(item.price)) {
      this.notifications.show('Presupuesto insuficiente.', 'error');
      return;
    }

    const targetId = this.select.value;
    this.workerManager.applyEffects(targetId, item.effects);
    this.state.totalPurchases += 1;
    const productivity = this.productivitySystem.recalculate();
    this.state.transformLevel = Math.min(100, this.state.transformLevel + 8);
    this.eventBus.emit('transform:changed', this.state.transformLevel);
    this.eventBus.emit('purchase:completed', { item, targetId, productivity });
    this.notifications.show(`${item.name} adquirido correctamente.`, 'success');
    this.close();
  }
}
