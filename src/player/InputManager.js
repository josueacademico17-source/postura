export class InputManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.keys = {};
  }

  setup() {
    document.addEventListener('keydown', (event) => {
      if (!this.keys[event.code]) this.handleAction(event.code);
      this.keys[event.code] = true;
    });
    document.addEventListener('keyup', (event) => {
      this.keys[event.code] = false;
    });
    this.setupDpad();
  }

  handleAction(code) {
    if (code === 'KeyQ') this.eventBus.emit('input:scanner');
    if (code === 'KeyB') this.eventBus.emit('input:shop');
    if (code === 'KeyE') this.eventBus.emit('input:interact');
    if (code === 'KeyR') this.eventBus.emit('input:ergo');
    if (code === 'KeyT') this.eventBus.emit('input:report');
    if (code === 'Escape') this.eventBus.emit('input:escape');
  }

  getMovementVector() {
    let x = 0;
    let y = 0;
    if (this.keys.KeyW || this.keys.ArrowUp) y += 1;
    if (this.keys.KeyS || this.keys.ArrowDown) y -= 1;
    if (this.keys.KeyA || this.keys.ArrowLeft) x -= 1;
    if (this.keys.KeyD || this.keys.ArrowRight) x += 1;
    return { x, y };
  }

  isSprinting() {
    return Boolean(this.keys.ShiftLeft || this.keys.ShiftRight);
  }

  setupDpad() {
    const dpad = document.getElementById('dpad');
    if (!dpad) return;
    dpad.querySelectorAll('[data-key]').forEach((button) => {
      const code = button.dataset.key;
      const isMovement = ['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(code);
      const press = (event) => {
        event.preventDefault();
        button.classList.add('pressed');
        if (isMovement) {
          this.keys[code] = true;
          return;
        }
        this.handleAction(code);
        setTimeout(() => button.classList.remove('pressed'), 180);
      };
      const release = (event) => {
        event.preventDefault();
        if (isMovement) {
          this.keys[code] = false;
          button.classList.remove('pressed');
        }
      };
      button.addEventListener('mousedown', press);
      button.addEventListener('mouseup', release);
      button.addEventListener('mouseleave', release);
      button.addEventListener('touchstart', press, { passive: false });
      button.addEventListener('touchend', release, { passive: false });
      button.addEventListener('touchcancel', release, { passive: false });
    });
  }
}
