import * as THREE from 'three';
import { makeCanvasLabel, makeBoxCollider, setShadow } from '../utils/Helpers.js';
import { Worker } from './Worker.js';

export class WorkerFactory {
  constructor(scene) {
    this.scene = scene;
    this.geometries = {
      torso: new THREE.BoxGeometry(0.46, 0.62, 0.26),
      shoulder: new THREE.BoxGeometry(0.6, 0.12, 0.24),
      head: new THREE.SphereGeometry(0.18, 18, 14),
      neck: new THREE.CylinderGeometry(0.065, 0.075, 0.12, 10),
      arm: new THREE.BoxGeometry(0.1, 0.42, 0.1),
      forearm: new THREE.BoxGeometry(0.09, 0.34, 0.09),
      hand: new THREE.SphereGeometry(0.058, 10, 8),
      thigh: new THREE.BoxGeometry(0.18, 0.11, 0.46),
      shoe: new THREE.BoxGeometry(0.14, 0.08, 0.28),
      ring: new THREE.TorusGeometry(0.17, 0.014, 8, 22),
      joint: new THREE.SphereGeometry(0.045, 10, 8),
    };
    this.skin = new THREE.MeshStandardMaterial({ color: 0xf0c890, roughness: 0.34, metalness: 0.02 });
    this.shoes = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.72 });
    this.jointMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0 });
  }

  create(data, index, workstation) {
    const group = new THREE.Group();
    group.position.copy(workstation.workerPosition);
    group.rotation.y = workstation.workerRotation;
    group.userData = { type: 'npc', isNPC: true, npcData: data };

    const bodyColor = [0x4a7fc7, 0xc74a7f, 0x59a86a, 0xc7a34a, 0x7f4ac7][index % 5];
    const body = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.44, metalness: 0.04 });
    const hair = new THREE.MeshStandardMaterial({
      color: [0x25170f, 0x4a3520, 0x7b411f, 0x151515, 0x654321][index % 5],
      roughness: 0.64,
    });

    const spineLean = data.posture.spine > 15 ? 0.14 : 0.045;
    const neckLean = (data.posture.neck - 12) * 0.006;

    const torso = setShadow(new THREE.Mesh(this.geometries.torso, body));
    torso.position.set(0, 0.77, 0);
    torso.rotation.x = spineLean;
    torso.userData.bodyPart = 'spine';
    group.add(torso);
    this.addJoint(group, new THREE.Vector3(0, 1.08, 0), 'spine_joint');

    const shoulder = setShadow(new THREE.Mesh(this.geometries.shoulder, body));
    shoulder.position.set(0, 1.04, 0);
    group.add(shoulder);

    const neck = setShadow(new THREE.Mesh(this.geometries.neck, this.skin));
    neck.position.set(neckLean * 0.6, 1.12, 0);
    neck.userData.bodyPart = 'neck';
    group.add(neck);
    this.addJoint(group, new THREE.Vector3(neckLean * 0.6, 1.15, 0.08), 'neck_joint');

    const headGroup = new THREE.Group();
    headGroup.position.set(neckLean, 1.31 + neckLean * 0.2, 0.02);
    headGroup.userData.bodyPart = 'head';
    const headMesh = setShadow(new THREE.Mesh(this.geometries.head, this.skin));
    headMesh.scale.y = 1.12;
    headGroup.add(headMesh);
    const hairMesh = new THREE.Mesh(new THREE.SphereGeometry(0.185, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), hair);
    hairMesh.position.y = 0.052;
    headGroup.add(hairMesh);
    group.add(headGroup);

    this.addEyes(headGroup);
    this.addArms(group, body, data);
    this.addLegs(group, body);
    this.addLabel(group, data);
    if (!data.healthy) this.addPainRing(group);

    this.scene.add(group);
    const collider = makeBoxCollider(workstation.workerPosition.clone().add(new THREE.Vector3(0, 0.82, 0)), new THREE.Vector3(0.82, 1.62, 0.82), `${data.id}_worker`);
    const worker = new Worker(data, group, collider);
    worker.bindParts();
    return worker;
  }

  addEyes(headGroup) {
    const eyeGeo = new THREE.SphereGeometry(0.024, 8, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x101010, roughness: 0.3 });
    const left = new THREE.Mesh(eyeGeo, eyeMat);
    left.position.set(-0.065, 0.02, 0.165);
    headGroup.add(left);
    const right = left.clone();
    right.position.x = 0.065;
    headGroup.add(right);
  }

  addArms(group, body, data) {
    const elbowFactor = (data.posture.elbow - 90) / 90;
    const wristAngle = data.posture.wrist > 15 ? 0.16 : 0.035;
    [
      ['left', -0.31, 1],
      ['right', 0.31, -1],
    ].forEach(([side, x, sign]) => {
      const armGroup = new THREE.Group();
      armGroup.position.set(x, 1.0, 0);
      armGroup.userData.bodyPart = `arm_${side}`;
      const upper = setShadow(new THREE.Mesh(this.geometries.arm, body));
      upper.position.set(0, -0.22, 0);
      armGroup.add(upper);
      const forearm = setShadow(new THREE.Mesh(this.geometries.forearm, this.skin));
      forearm.position.set(sign * 0.055, -0.53, 0.15);
      forearm.rotation.x = -0.42 - elbowFactor * 0.2;
      forearm.rotation.z = sign * wristAngle;
      forearm.userData.bodyPart = `wrist_${side}`;
      armGroup.add(forearm);
      const hand = setShadow(new THREE.Mesh(this.geometries.hand, this.skin));
      hand.position.set(sign * 0.09, -0.72, 0.24);
      hand.userData.bodyPart = `wrist_${side}`;
      armGroup.add(hand);
      group.add(armGroup);
      this.addJoint(group, new THREE.Vector3(x + sign * 0.09, 0.29, 0.24), `wrist_${side}_joint`);
    });
  }

  addLegs(group, body) {
    [-0.12, 0.12].forEach((x) => {
      const thigh = setShadow(new THREE.Mesh(this.geometries.thigh, body));
      thigh.position.set(x, 0.34, 0.22);
      group.add(thigh);
      const shoe = setShadow(new THREE.Mesh(this.geometries.shoe, this.shoes));
      shoe.position.set(x, 0.07, 0.48);
      group.add(shoe);
    });
  }

  addLabel(group, data) {
    const texture = makeCanvasLabel([data.name, data.role], {
      width: 512,
      height: 140,
      titleFont: '800 34px Segoe UI',
      subtitleFont: '500 23px Segoe UI',
    });
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.08, 0.3),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
    );
    mesh.position.set(0, 1.82, 0);
    mesh.userData.isLabel = true;
    group.add(mesh);
  }

  addPainRing(group) {
    const ring = new THREE.Mesh(
      this.geometries.ring,
      new THREE.MeshBasicMaterial({ color: 0xff3355, transparent: true, opacity: 0.72 }),
    );
    ring.position.set(0, 1.67, 0);
    ring.userData = { isPainRing: true, baseY: 1.67 };
    group.add(ring);
  }

  addJoint(group, position, id) {
    const joint = new THREE.Mesh(this.geometries.joint, this.jointMat.clone());
    joint.position.copy(position);
    joint.userData = { scannerJoint: true, jointId: id };
    group.add(joint);
  }
}
