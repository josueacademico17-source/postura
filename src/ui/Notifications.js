export class Notifications {
  constructor() {
    this.area = document.getElementById('notif-area');
    this.emailArea = document.getElementById('email-notif');
  }

  show(message, type = 'success') {
    const node = document.createElement('div');
    node.className = `notif ${type}`;
    node.textContent = message;
    this.area.appendChild(node);
    setTimeout(() => node.remove(), 4200);
  }

  email(event) {
    const node = document.createElement('div');
    node.className = 'email-toast';
    const label = { urgent: 'ALERTA', warning: 'AVISO', positive: 'OK', report: 'DATA' }[event.category] ?? 'MAIL';
    node.innerHTML = `<div class="email-icon">${label}</div><div class="email-content"><strong>NUEVO CORREO</strong>${event.subject}</div>`;
    this.emailArea.appendChild(node);
    setTimeout(() => node.remove(), 5200);
  }
}
