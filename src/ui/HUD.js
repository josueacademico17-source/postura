export class HUD {
  constructor(state, eventBus) {
    this.state = state;
    this.eventBus = eventBus;
    this.budget = document.getElementById('budget-val');
    this.productivity = document.getElementById('prod-val');
    this.productivityFill = document.getElementById('prod-fill');
    this.transformFill = document.getElementById('transform-fill');
    this.healthFill = document.getElementById('health-fill');
    this.ergoPoints = document.getElementById('ergo-pts');
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
    this.eventBus.on('ergopoints:changed', ({ points }) => this.updateErgoPoints(points));
    this.updateBudget(this.state.budget);
    this.updateProductivity(this.state.productivity);
    this.updateTransform(this.state.transformLevel);
    this.updateErgoPoints(this.state.ergoPuntos ?? 0);
    this.simulateLoading();
  }

  simulateLoading() {
    const messages = [
      'CARGANDO MODELOS 3D...',
      'INICIALIZANDO SISTEMAS DE DIAGNÓSTICO...',
      'CARGANDO DATOS POSTURALES...',
      'PREPARANDO ESCÁNER ERGONÓMICO...',
      'GENERANDO TEXTURAS PBR...',
      'COMPILANDO SHADERS...',
      '¡SISTEMAS LISTOS!',
    ];
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const pct = Math.min(step * (100 / messages.length), 100);
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
        if (window.matchMedia('(pointer: coarse), (max-width: 760px)').matches) {
          this.dpad.classList.add('visible');
        }
        callback();
      }, 1100);
    });
  }

  setPointerLocked(isLocked) {
    this.clickOverlay.classList.toggle('hidden', isLocked);
  }

  showClickOverlay() {
    this.clickOverlay.classList.remove('hidden');
  }

  updateBudget(value) {
    this.budget.textContent = `${value.toLocaleString('es')} €`;
  }

  updateProductivity(value) {
    this.productivity.textContent = `${value}%`;
    this.productivityFill.style.width = `${value}%`;
    const healthyCount = this.state.healthyWorkers ?? 0;
    const totalWorkers = this.state.totalWorkers ?? 5;
    const healthScore = value * 0.8 + (healthyCount / totalWorkers) * 20;
    this.healthFill.style.width = `${Math.min(100, healthScore)}%`;
  }

  updateTransform(value) {
    this.transformFill.style.width = `${value}%`;
  }

  updateErgoPoints(value) {
    this.ergoPoints.textContent = value;
  }

  showHint(text) {
    this.hint.textContent = text;
    this.hint.classList.add('visible');
  }

  hideHint() {
    this.hint.classList.remove('visible');
  }
}
