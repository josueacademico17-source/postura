export class HUD {
  constructor(state, eventBus) {
    this.state = state;
    this.eventBus = eventBus;
    this.budget = document.getElementById('budget-val');
    this.productivity = document.getElementById('prod-val');
    this.productivityFill = document.getElementById('prod-fill');
    this.transformFill = document.getElementById('transform-fill');
    this.hint = document.getElementById('hint');
    this.splash = document.getElementById('splash');
    this.loadBar = document.getElementById('load-bar');
    this.loadText = document.getElementById('load-text');
    this.startButton = document.getElementById('start-btn');
    this.clickOverlay = document.getElementById('click-overlay');
    this.dpad = document.getElementById('dpad');
  }

  setup() {
    this.eventBus.on('budget:changed', (value) => this.updateBudget(value));
    this.eventBus.on('productivity:changed', (value) => this.updateProductivity(value));
    this.eventBus.on('transform:changed', (value) => this.updateTransform(value));
    this.updateBudget(this.state.budget);
    this.updateProductivity(this.state.productivity);
    this.updateTransform(this.state.transformLevel);
    this.simulateLoading();
  }

  simulateLoading() {
    const messages = ['CARGANDO MODELOS 3D...', 'INICIALIZANDO SISTEMAS...', 'CARGANDO DATOS POSTURALES...', 'PREPARANDO ESCANER...', 'LISTO'];
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const pct = Math.min(step * 22, 100);
      this.loadBar.style.width = `${pct}%`;
      this.loadText.textContent = messages[Math.min(step - 1, messages.length - 1)];
      if (pct >= 100) {
        clearInterval(interval);
        this.startButton.style.display = 'block';
      }
    }, 330);
  }

  onStart(callback) {
    this.startButton.addEventListener('click', () => {
      this.splash.classList.add('hidden');
      setTimeout(() => {
        this.splash.style.display = 'none';
        this.clickOverlay.classList.remove('hidden');
        this.dpad.classList.add('visible');
        callback();
      }, 900);
    });
  }

  setPointerLocked(isLocked) {
    this.clickOverlay.classList.toggle('hidden', isLocked);
  }

  updateBudget(value) {
    this.budget.textContent = `${value.toLocaleString('es')} EUR`;
  }

  updateProductivity(value) {
    this.productivity.textContent = `${value}%`;
    this.productivityFill.style.width = `${value}%`;
  }

  updateTransform(value) {
    this.transformFill.style.width = `${value}%`;
  }

  showHint(text) {
    this.hint.textContent = text;
    this.hint.classList.add('visible');
  }

  hideHint() {
    this.hint.classList.remove('visible');
  }
}
