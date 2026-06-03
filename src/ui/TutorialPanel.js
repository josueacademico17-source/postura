export class TutorialPanel {
  constructor(state, hud) {
    this.state = state;
    this.hud = hud;
    this.panel = document.getElementById('tutorial');
    this.startButton = document.getElementById('tut-start');
    this.noShowButton = document.getElementById('tut-no-show');
  }

  setup() {
    this.startButton?.addEventListener('click', () => this.close());
    this.noShowButton?.addEventListener('click', () => {
      try {
        localStorage.setItem('ip_tutorial_done', '1');
      } catch {
        // Ignore storage restrictions.
      }
      this.close();
    });
  }

  showIfNeeded() {
    let done = false;
    try {
      done = localStorage.getItem('ip_tutorial_done') === '1';
    } catch {
      done = false;
    }
    if (done) {
      this.hud.showClickOverlay();
      return;
    }
    this.open();
  }

  open() {
    this.state.tutorialOpen = true;
    this.panel.classList.add('open');
    if (document.pointerLockElement) document.exitPointerLock();
  }

  close() {
    this.state.tutorialOpen = false;
    this.panel.classList.remove('open');
    this.hud.showClickOverlay();
  }
}
