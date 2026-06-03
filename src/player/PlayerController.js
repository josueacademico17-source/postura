import * as THREE from 'three';
import { PLAYER } from '../utils/Constants.js';
import { dampVector2 } from '../utils/MathUtils.js';

export class PlayerController {
  constructor(camera, inputManager, cameraController, colliders, state) {
    this.camera = camera;
    this.input = inputManager;
    this.cameraController = cameraController;
    this.colliders = colliders;
    this.state = state;
    this.velocity = new THREE.Vector2();
    this.targetVelocity = new THREE.Vector2();
    this.nextPosition = new THREE.Vector3();
  }

  update(dt) {
    this.cameraController.update();
    if (!this.state.gameStarted || !this.cameraController.locked || this.state.shopOpen || this.state.paused) {
      this.velocity.set(0, 0);
      return;
    }

    const input = this.input.getMovementVector();
    const length = Math.hypot(input.x, input.y);
    const normalized = length > 0 ? { x: input.x / length, y: input.y / length } : { x: 0, y: 0 };
    const yaw = this.cameraController.yaw;
    const forward = new THREE.Vector2(-Math.sin(yaw), -Math.cos(yaw));
    const right = new THREE.Vector2(Math.cos(yaw), -Math.sin(yaw));
    const speed = PLAYER.walkSpeed * (this.input.isSprinting() ? PLAYER.sprintMultiplier : 1);

    this.targetVelocity
      .copy(right.multiplyScalar(normalized.x))
      .add(forward.multiplyScalar(normalized.y))
      .multiplyScalar(speed);

    const lambda = length > 0 ? PLAYER.acceleration : PLAYER.deceleration;
    dampVector2(this.velocity, this.targetVelocity, lambda, dt);

    const dx = this.velocity.x * dt;
    const dz = this.velocity.y * dt;
    this.moveAxis(dx, 0);
    this.moveAxis(0, dz);
    this.camera.position.y = PLAYER.eyeHeight;
  }

  moveAxis(dx, dz) {
    if (Math.abs(dx) + Math.abs(dz) < 0.00001) return;
    this.nextPosition.copy(this.camera.position);
    this.nextPosition.x += dx;
    this.nextPosition.z += dz;
    if (!this.collides(this.nextPosition)) {
      this.camera.position.copy(this.nextPosition);
      return;
    }
    if (dx !== 0) this.velocity.x = 0;
    if (dz !== 0) this.velocity.y = 0;
  }

  collides(position) {
    for (const collider of this.colliders) {
      const box = collider.box;
      if (box.max.y < 0.12 || box.min.y > PLAYER.eyeHeight) continue;
      const closestX = Math.max(box.min.x, Math.min(position.x, box.max.x));
      const closestZ = Math.max(box.min.z, Math.min(position.z, box.max.z));
      const diffX = position.x - closestX;
      const diffZ = position.z - closestZ;
      if (diffX * diffX + diffZ * diffZ < PLAYER.radius * PLAYER.radius) return true;
    }
    return false;
  }
}
