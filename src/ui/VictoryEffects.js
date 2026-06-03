export class VictoryEffects {
  constructor(notifications, soundManager) {
    this.notifications = notifications;
    this.soundManager = soundManager;
    this.container = document.getElementById('confetti-container');
    this.flash = document.getElementById('victory-flash');
    this.colors = ['#00d4c8', '#0088ff', '#ff4444', '#ffaa00', '#00ff88', '#ff88cc', '#8866ff'];
  }

  trigger() {
    this.soundManager?.playVictory();
    this.flash.classList.add('flash');
    setTimeout(() => this.flash.classList.remove('flash'), 400);
    this.spawnConfetti(150);
    setTimeout(() => this.spawnConfetti(100), 1200);
    this.notifications.show('🏆 ¡MISIÓN COMPLETADA! Empresa transformada al 100%.', 'success');
  }

  spawnConfetti(count) {
    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement('div');
      const size = 6 + Math.random() * 10;
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.width = `${size}px`;
      piece.style.height = `${size * 0.4}px`;
      piece.style.background = this.colors[Math.floor(Math.random() * this.colors.length)];
      piece.style.animationDuration = `${2 + Math.random() * 3}s`;
      piece.style.animationDelay = `${Math.random() * 1.5}s`;
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      this.container.appendChild(piece);
      setTimeout(() => piece.remove(), 5500);
    }
  }
}
