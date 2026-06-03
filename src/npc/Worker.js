export class Worker {
  constructor(data, group, collider) {
    this.data = data;
    this.group = group;
    this.collider = collider;
    this.baseY = group.position.y;
    this.label = null;
    this.head = null;
    this.leftArm = null;
    this.rightArm = null;
    this.painRing = null;
  }

  bindParts() {
    this.group.traverse((object) => {
      if (object.userData?.bodyPart === 'head') this.head = object;
      if (object.userData?.bodyPart === 'arm_left') this.leftArm = object;
      if (object.userData?.bodyPart === 'arm_right') this.rightArm = object;
      if (object.userData?.isPainRing) this.painRing = object;
      if (object.userData?.isLabel) this.label = object;
    });
  }

  update(time, camera, index) {
    const breathe = Math.sin(time * 1.25 + index * 1.37) * 0.008;
    this.group.position.y = this.baseY + breathe;

    if (this.head) {
      this.head.rotation.y = Math.sin(time * 0.5 + index) * 0.052;
      this.head.rotation.x = Math.sin(time * 0.36 + index) * 0.025;
    }

    if (this.leftArm && this.rightArm) {
      const typing = this.data.healthy ? 0.012 : 0.038;
      this.leftArm.rotation.x = Math.sin(time * 4.8 + index) * typing;
      this.rightArm.rotation.x = Math.sin(time * 4.8 + index + Math.PI) * typing;
    }

    if (this.painRing) {
      this.painRing.position.y = this.painRing.userData.baseY + Math.sin(time * 2.2 + index) * 0.045;
      this.painRing.material.opacity = 0.45 + Math.sin(time * 3 + index) * 0.25;
      this.painRing.rotation.z = time * 0.55;
    }

    if (this.label) this.label.lookAt(camera.position);
  }
}
