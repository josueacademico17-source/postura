import * as THREE from 'three';
import { SCANNER } from '../utils/Constants.js';

export class ScannerEffects {
  constructor(scene) {
    this.scene = scene;
    this.highlighted = [];
    this.holograms = [];
    this.activeGroup = null;
  }

  highlight(worker) {
    this.clear();
    const group = worker.group ?? worker;
    const data = worker.data ?? group.userData.npcData;
    this.activeGroup = group;
    const color = data.healthy ? SCANNER.colorHealthy : SCANNER.colorRisk;
    group.traverse((object) => {
      if (!object.isMesh || object.userData?.isLabel || object.userData?.isPainRing) return;
      if (object.userData?.scannerJoint) {
        object.material.opacity = 0.95;
        object.material.color.setHex(SCANNER.jointColor);
        this.highlighted.push({ object, joint: true });
        return;
      }
      const original = object.material;
      const material = original.clone();
      material.emissive = new THREE.Color(color);
      material.emissiveIntensity = 0.38;
      object.material = material;
      this.highlighted.push({ object, original });
    });
    this.addHologram(group, color);
  }

  addHologram(group, color) {
    const ringMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    });
    const floorRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.012, 8, 72), ringMat);
    floorRing.rotation.x = Math.PI / 2;
    floorRing.position.copy(group.position).add(new THREE.Vector3(0, 0.04, 0));
    floorRing.userData.scannerHologram = true;
    this.scene.add(floorRing);

    const scanLine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.68, 0.012, 48, 1, true),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false }),
    );
    scanLine.position.copy(group.position).add(new THREE.Vector3(0, 0.95, 0));
    scanLine.userData.scannerHologram = true;
    this.scene.add(scanLine);
    this.holograms.push(floorRing, scanLine);
  }

  update(time) {
    this.holograms.forEach((hologram, index) => {
      hologram.rotation.z = time * (0.8 + index * 0.2);
      hologram.position.y = (index === 0 ? 0.04 : 0.8) + Math.sin(time * 2.2) * 0.16;
    });
  }

  clear() {
    this.highlighted.forEach(({ object, original, joint }) => {
      if (joint) {
        object.material.opacity = 0;
      } else if (original) {
        object.material.dispose();
        object.material = original;
      }
    });
    this.highlighted = [];
    this.holograms.forEach((object) => {
      object.geometry.dispose();
      object.material.dispose();
      this.scene.remove(object);
    });
    this.holograms = [];
    this.activeGroup = null;
  }
}
