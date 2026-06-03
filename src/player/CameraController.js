import * as THREE from 'three';
import { PLAYER } from '../utils/Constants.js';

export class CameraController {
  constructor(canvas, camera, eventBus, hud) {
    this.canvas = canvas;
    this.camera = camera;
    this.eventBus = eventBus;
    this.hud = hud;
    this.yaw = 0;
    this.pitch = 0;
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.locked = false;
  }

  setup() {
    this.canvas.addEventListener('click', () => {
      if (!document.pointerLockElement) this.canvas.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.canvas;
      this.hud.setPointerLocked(this.locked);
      this.eventBus.emit('camera:lockChanged', this.locked);
    });

    document.addEventListener('mousemove', (event) => {
      if (!this.locked) return;
      this.yaw -= event.movementX * PLAYER.lookSensitivity;
      this.pitch -= event.movementY * PLAYER.lookSensitivity;
      this.pitch = Math.max(PLAYER.maxPitchDown, Math.min(PLAYER.maxPitchUp, this.pitch));
    });
  }

  update() {
    this.euler.set(this.pitch, this.yaw, 0, 'YXZ');
    this.camera.quaternion.setFromEuler(this.euler);
  }
}
