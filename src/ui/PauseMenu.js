export class PauseMenu {
  constructor(state, notifications) {
    this.state = state;
    this.notifications = notifications;
  }

  toggle() {
    this.state.paused = !this.state.paused;
    this.notifications.show(this.state.paused ? 'Juego en pausa.' : 'Juego reanudado.', 'info');
  }
}
