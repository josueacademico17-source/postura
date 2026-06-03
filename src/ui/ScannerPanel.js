export class ScannerPanel {
  constructor() {
    this.status = document.getElementById('scanner-status');
  }

  setStatus(text, active = true) {
    this.status.textContent = text;
    this.status.classList.toggle('active-status', active);
  }
}
