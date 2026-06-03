import * as THREE from 'three';
import { SCANNER } from '../utils/Constants.js';
import { findAncestorWithUserData } from '../utils/Helpers.js';
import { PostureSystem } from '../npc/PostureSystem.js';
import { ScannerEffects } from './ScannerEffects.js';
import { ScannerOverlay } from './ScannerOverlay.js';

export class ErgonomicScanner {
  constructor(state, camera, scene, workerManager, eventBus, inspectionPanel, notifications) {
    this.state = state;
    this.camera = camera;
    this.workerManager = workerManager;
    this.eventBus = eventBus;
    this.notifications = notifications;
    this.overlay = new ScannerOverlay(state, inspectionPanel);
    this.effects = new ScannerEffects(scene);
    this.posture = new PostureSystem();
    this.raycaster = new THREE.Raycaster();
    this.center = new THREE.Vector2(0, 0);
    this.lastScannedId = null;
  }

  setup() {
    this.eventBus.on('input:scanner', () => this.toggle());
    this.eventBus.on('worker:selected', (workerData) => {
      if (!this.state.scannerActive) this.toggle();
      const worker = this.workerManager.findById(workerData.id);
      if (worker) this.scan(worker);
    });
  }

  toggle() {
    if (!this.state.gameStarted) return;
    this.state.scannerActive = !this.state.scannerActive;
    this.overlay.setActive(this.state.scannerActive);
    if (this.state.scannerActive) {
      this.notifications.show('Escaner postural activado. Apunta a un empleado.', 'info');
      return;
    }
    this.lastScannedId = null;
    this.effects.clear();
  }

  update(time) {
    this.effects.update(time);
    if (!this.state.scannerActive || !this.state.gameStarted) return;
    const worker = this.pickWorker();
    if (!worker) {
      if (this.lastScannedId) {
        this.lastScannedId = null;
        this.effects.clear();
        this.overlay.emptyDiagnostic();
        this.overlay.hideWorkerCard();
        this.overlay.status.textContent = 'ESCANER: ACTIVO';
      }
      return;
    }
    const distance = this.camera.position.distanceTo(worker.group.position);
    if (distance > SCANNER.range) {
      this.overlay.outOfRange();
      return;
    }
    this.scan(worker);
  }

  scan(worker) {
    const evaluation = this.posture.evaluate(worker.data);
    if (worker.data.id !== this.lastScannedId) {
      this.lastScannedId = worker.data.id;
      this.state.scannedNPCs.add(worker.data.id);
      this.effects.highlight(worker);
      this.eventBus.emit('scanner:scanned', worker.data);
    }
    this.overlay.showWorker(worker, evaluation);
  }

  pickWorker() {
    this.raycaster.setFromCamera(this.center, this.camera);
    const hits = this.raycaster.intersectObjects(this.workerManager.groups, true);
    for (const hit of hits) {
      const group = findAncestorWithUserData(hit.object, 'isNPC');
      if (!group) continue;
      return this.workerManager.findById(group.userData.npcData.id);
    }
    return null;
  }
}
