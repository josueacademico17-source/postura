import * as THREE from 'three';
import { findAncestorWithUserData } from '../utils/Helpers.js';

export class InteractionSystem {
  constructor(camera, workerManager, hud, eventBus) {
    this.camera = camera;
    this.workerManager = workerManager;
    this.hud = hud;
    this.eventBus = eventBus;
    this.raycaster = new THREE.Raycaster();
    this.center = new THREE.Vector2(0, 0);
    this.current = null;
  }

  update() {
    this.current = this.pickWorker(5);
    if (this.current) {
      this.hud.showHint(`[E] Hablar con ${this.current.userData.npcData.name}`);
      return;
    }
    this.hud.hideHint();
  }

  interact() {
    const workerGroup = this.pickWorker(5);
    if (!workerGroup) return false;
    this.eventBus.emit('worker:selected', workerGroup.userData.npcData);
    return true;
  }

  pickWorker(maxDistance = Infinity) {
    this.raycaster.setFromCamera(this.center, this.camera);
    const hits = this.raycaster.intersectObjects(this.workerManager.groups, true);
    for (const hit of hits) {
      const group = findAncestorWithUserData(hit.object, 'isNPC');
      if (!group) continue;
      if (this.camera.position.distanceTo(group.position) <= maxDistance) return group;
    }
    return null;
  }
}
