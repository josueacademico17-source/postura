export class ErgonomicsPanel {
  constructor(state) {
    this.state = state;
    this.panel = document.getElementById('ergo-panel');
    this.closeButton = document.getElementById('ergo-close');
  }

  setup() {
    this.closeButton?.addEventListener('click', () => this.close());
  }

  toggle() {
    if (this.state.ergoOpen) this.close();
    else this.open();
  }

  open() {
    this.state.ergoOpen = true;
    this.panel.classList.add('open');
    if (document.pointerLockElement) document.exitPointerLock();
  }

  close() {
    this.state.ergoOpen = false;
    this.panel.classList.remove('open');
  }
}
