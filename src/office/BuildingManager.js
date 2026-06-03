import * as THREE from 'three';
import { OFFICE } from '../utils/Constants.js';
import { makeBoxCollider, makeCanvasLabel, setShadow } from '../utils/Helpers.js';
import { FloorManager } from './FloorManager.js';
import { ReceptionArea } from './ReceptionArea.js';
import { HRDepartment } from './HRDepartment.js';
import { AdministrationArea } from './AdministrationArea.js';
import { CallCenterArea } from './CallCenterArea.js';
import { DesignArea } from './DesignArea.js';
import { CEOOffice } from './CEOOffice.js';
import { DecorationSystem } from './DecorationSystem.js';

export class BuildingManager {
  constructor(scene, assetLoader) {
    this.scene = scene;
    this.assetLoader = assetLoader;
    this.colliders = [];
    this.workstations = new Map();
    this.transformables = [];
    this.geometries = {
      cube: new THREE.BoxGeometry(1, 1, 1),
      cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 24),
      plantLeaf: new THREE.ConeGeometry(0.5, 1, 9),
      screen: new THREE.BoxGeometry(1, 1, 0.08),
    };
    this.materials = this.createMaterials();
  }

  createMaterials() {
    return {
      wallCold: new THREE.MeshStandardMaterial({ color: 0x223046, roughness: 0.58, metalness: 0.02 }),
      wallWarm: new THREE.MeshStandardMaterial({ color: 0xdfe7ec, roughness: 0.48, metalness: 0.02 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x9fd7ff,
        roughness: 0.08,
        metalness: 0,
        transparent: true,
        opacity: 0.45,
        transmission: 0.35,
      }),
      ceiling: new THREE.MeshStandardMaterial({ color: 0xdfe5ea, roughness: 0.55, metalness: 0.01 }),
      ceilingPanel: new THREE.MeshStandardMaterial({ color: 0xf2f4f6, roughness: 0.42 }),
      desk: new THREE.MeshStandardMaterial({ color: 0x8e6b4e, roughness: 0.44, metalness: 0.04 }),
      deskDark: new THREE.MeshStandardMaterial({ color: 0x273246, roughness: 0.5, metalness: 0.08 }),
      chair: new THREE.MeshStandardMaterial({ color: 0x1b2b3f, roughness: 0.46, metalness: 0.08 }),
      chairAccent: new THREE.MeshStandardMaterial({ color: 0x00a8a0, roughness: 0.42, metalness: 0.12 }),
      black: new THREE.MeshStandardMaterial({ color: 0x101820, roughness: 0.38, metalness: 0.28 }),
      screen: new THREE.MeshStandardMaterial({
        color: 0x10203b,
        emissive: 0x1f66ff,
        emissiveIntensity: 0.55,
        roughness: 0.22,
        metalness: 0.18,
      }),
      plantPot: new THREE.MeshStandardMaterial({ color: 0x7a4f32, roughness: 0.8 }),
      leaf: new THREE.MeshStandardMaterial({ color: 0x2f8b4a, roughness: 0.62 }),
      sofa: new THREE.MeshStandardMaterial({ color: 0x435a70, roughness: 0.55, metalness: 0.04 }),
      sign: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }),
      coffee: new THREE.MeshStandardMaterial({ color: 0xefe4d0, roughness: 0.5 }),
      metal: new THREE.MeshStandardMaterial({ color: 0x8d9aa5, roughness: 0.25, metalness: 0.65 }),
    };
  }

  build() {
    new FloorManager(this.scene, this.materials, this.assetLoader).build();
    this.buildShell();
    this.buildInternalPartitions();
    new ReceptionArea(this).build();
    new HRDepartment(this).build();
    new AdministrationArea(this).build();
    new CallCenterArea(this).build();
    new DesignArea(this).build();
    new CEOOffice(this).build();
    new DecorationSystem(this).build();
    return {
      colliders: this.colliders,
      workstations: this.workstations,
      transformables: this.transformables,
    };
  }

  buildShell() {
    const w = OFFICE.width;
    const d = OFFICE.depth;
    const h = OFFICE.wallHeight;
    this.addWall(new THREE.Vector3(-w / 2, h / 2, 0), new THREE.Vector3(0.34, h, d), 'west');
    this.addWall(new THREE.Vector3(w / 2, h / 2, 0), new THREE.Vector3(0.34, h, d), 'east');
    this.addWall(new THREE.Vector3(0, h / 2, -d / 2), new THREE.Vector3(w, h, 0.34), 'south');
    this.addWall(new THREE.Vector3(0, h / 2, d / 2), new THREE.Vector3(w, h, 0.34), 'north');

    [-10, -3.3, 3.3, 10].forEach((x) => {
      const windowMesh = this.addBox(
        new THREE.Vector3(x, 1.65, -16.83),
        new THREE.Vector3(4.2, 1.55, 0.06),
        this.materials.glass,
        { cast: false, receive: false },
      );
      windowMesh.userData.noShadow = true;
    });
  }

  buildInternalPartitions() {
    const mat = this.materials.wallWarm;
    [
      [0, 1.35, -4.0, 0.16, 2.7, 8.2],
      [-7.4, 1.35, 3.6, 0.16, 2.7, 8.0],
      [7.4, 1.35, 3.6, 0.16, 2.7, 8.0],
      [-12.1, 1.35, 0.3, 9.6, 2.7, 0.16],
      [12.1, 1.35, 0.3, 9.6, 2.7, 0.16],
    ].forEach(([x, y, z, sx, sy, sz], index) => {
      const mesh = this.addBox(new THREE.Vector3(x, y, z), new THREE.Vector3(sx, sy, sz), mat, {}, `partition_${index}`);
      this.transformables.push({ mesh, cold: 0x9ba7b2, warm: 0xf3f7f8 });
    });
  }

  addWall(center, size, name) {
    const mesh = this.addBox(center, size, this.materials.wallCold, {}, `wall_${name}`);
    this.transformables.push({ mesh, cold: 0x223046, warm: 0xf1f4f6 });
  }

  addBox(center, size, material, shadow = {}, colliderName = null) {
    const mesh = new THREE.Mesh(this.geometries.cube, material);
    mesh.position.copy(center);
    mesh.scale.copy(size);
    setShadow(mesh, shadow.cast ?? true, shadow.receive ?? true);
    this.scene.add(mesh);
    if (colliderName) this.addCollider(center, size, colliderName);
    return mesh;
  }

  addCollider(center, size, name) {
    this.colliders.push(makeBoxCollider(center, size, name));
  }

  addDeskStation({ id, desk, worker, rotation = 0, badMonitor = false, wristRisk = false, creative = false, compact = false }) {
    const width = compact ? 1.55 : 2.05;
    const depth = compact ? 0.75 : 1.05;
    this.addBox(desk, new THREE.Vector3(width, 0.08, depth), this.materials.desk, {}, `${id}_desk`);
    this.addBox(desk.clone().add(new THREE.Vector3(0, -0.39, -depth * 0.36)), new THREE.Vector3(width, 0.68, 0.08), this.materials.deskDark);
    this.addChair(worker.clone().add(new THREE.Vector3(0, 0.38, 0.2)), rotation);
    this.addMonitor(desk.clone().add(new THREE.Vector3(0, badMonitor ? 0.24 : 0.41, -0.24)));
    this.addKeyboard(desk.clone().add(new THREE.Vector3(0, 0.07, 0.22)), wristRisk);
    if (creative) this.addTablet(desk.clone().add(new THREE.Vector3(0.54, 0.09, 0.18)));

    this.workstations.set(id, {
      id,
      workerPosition: worker.clone(),
      workerRotation: rotation,
      deskPosition: desk.clone(),
    });
  }

  addMonitor(center) {
    this.addBox(center.clone().add(new THREE.Vector3(0, -0.24, 0)), new THREE.Vector3(0.08, 0.32, 0.08), this.materials.black);
    this.addBox(center, new THREE.Vector3(0.78, 0.46, 0.06), this.materials.screen, { cast: true, receive: false });
  }

  addKeyboard(center, risky = false) {
    const keyboard = this.addBox(center, new THREE.Vector3(0.66, 0.035, 0.2), this.materials.black, { cast: true, receive: false });
    keyboard.rotation.x = risky ? -0.11 : 0;
  }

  addTablet(center) {
    const tablet = this.addBox(center, new THREE.Vector3(0.52, 0.035, 0.36), this.materials.screen, { cast: true, receive: false });
    tablet.rotation.y = -0.24;
  }

  addChair(center, rotation = 0) {
    const group = new THREE.Group();
    group.position.copy(center);
    group.rotation.y = rotation;
    this.scene.add(group);

    const seat = new THREE.Mesh(this.geometries.cube, this.materials.chair);
    seat.position.set(0, 0, 0);
    seat.scale.set(0.58, 0.1, 0.58);
    setShadow(seat);
    group.add(seat);

    const back = new THREE.Mesh(this.geometries.cube, this.materials.chairAccent);
    back.position.set(0, 0.35, 0.28);
    back.scale.set(0.58, 0.62, 0.08);
    back.rotation.x = 0.08;
    setShadow(back);
    group.add(back);
  }

  addCabinet(center, size) {
    this.addBox(center, size, this.materials.deskDark, {}, `cabinet_${center.x}_${center.z}`);
  }

  addReceptionCounter(center) {
    this.addBox(center, new THREE.Vector3(4.6, 1.1, 0.72), this.materials.deskDark, {}, 'reception_counter');
    this.addBox(center.clone().add(new THREE.Vector3(0, 0.61, -0.02)), new THREE.Vector3(4.75, 0.11, 0.9), this.materials.desk);
  }

  addExecutiveDesk(center) {
    this.addBox(center, new THREE.Vector3(2.8, 0.12, 1.25), this.materials.desk, {}, 'executive_desk');
    this.addBox(center.clone().add(new THREE.Vector3(0, -0.42, -0.5)), new THREE.Vector3(2.4, 0.7, 0.12), this.materials.deskDark);
    this.addMonitor(center.clone().add(new THREE.Vector3(0, 0.42, -0.34)));
  }

  addRoundTable(center, radius, height, name) {
    const mesh = new THREE.Mesh(this.geometries.cylinder, this.materials.desk);
    mesh.position.copy(center);
    mesh.scale.set(radius, height, radius);
    setShadow(mesh);
    this.scene.add(mesh);
    this.addCollider(center, new THREE.Vector3(radius * 2, height * 2.2, radius * 2), name);
  }

  addMeetingRoom(center) {
    this.addSign('SALA REUNIONES', center.clone().add(new THREE.Vector3(0, 2.1, -4.05)), 0);
    this.addBox(center.clone().add(new THREE.Vector3(0, 0.74, 0)), new THREE.Vector3(4.2, 0.12, 1.35), this.materials.desk, {}, 'meeting_table');
    [-1.55, -0.5, 0.5, 1.55].forEach((x) => {
      this.addChair(center.clone().add(new THREE.Vector3(x, 0.38, -1.25)), 0);
      this.addChair(center.clone().add(new THREE.Vector3(x, 0.38, 1.25)), Math.PI);
    });
    this.addWhiteboard(center.clone().add(new THREE.Vector3(-2.7, 1.45, -3.9)), 0, 'ERGONOMIA');
  }

  addCafeteria(center) {
    this.addSign('CAFETERIA', center.clone().add(new THREE.Vector3(0, 2.1, -4.15)), 0);
    this.addBox(center.clone().add(new THREE.Vector3(0, 0.5, 0)), new THREE.Vector3(3.2, 1.0, 0.72), this.materials.coffee, {}, 'cafeteria_bar');
    this.addRoundTable(center.clone().add(new THREE.Vector3(3.1, 0.42, 1.9)), 0.62, 0.12, 'cafe_table_1');
    this.addRoundTable(center.clone().add(new THREE.Vector3(0.9, 0.42, 2.6)), 0.62, 0.12, 'cafe_table_2');
    this.addPlant(center.clone().add(new THREE.Vector3(4.8, 0, 3.3)), 1);
  }

  addBreakArea(center) {
    this.addSign('DESCANSO', center.clone().add(new THREE.Vector3(0, 2.1, 3.85)), Math.PI);
    this.addLoungeChair(center.clone().add(new THREE.Vector3(-1.2, 0.38, 0)), Math.PI / 2);
    this.addLoungeChair(center.clone().add(new THREE.Vector3(1.0, 0.38, 0)), -Math.PI / 2);
    this.addRoundTable(center.clone().add(new THREE.Vector3(0, 0.32, -1.2)), 0.58, 0.1, 'break_table');
  }

  addLoungeChair(center, rotation = 0) {
    const base = this.addBox(center, new THREE.Vector3(1.4, 0.32, 0.76), this.materials.sofa, {}, `lounge_${center.x}_${center.z}`);
    base.rotation.y = rotation;
    const back = this.addBox(center.clone().add(new THREE.Vector3(0, 0.42, 0.34)), new THREE.Vector3(1.4, 0.74, 0.16), this.materials.sofa);
    back.rotation.y = rotation;
  }

  addPlant(center, scale = 1) {
    const pot = new THREE.Mesh(this.geometries.cylinder, this.materials.plantPot);
    pot.position.copy(center).add(new THREE.Vector3(0, 0.18 * scale, 0));
    pot.scale.set(0.26 * scale, 0.34 * scale, 0.26 * scale);
    setShadow(pot);
    this.scene.add(pot);
    for (let i = 0; i < 3; i += 1) {
      const leaf = new THREE.Mesh(this.geometries.plantLeaf, this.materials.leaf);
      leaf.position.copy(center).add(new THREE.Vector3(0, (0.55 + i * 0.22) * scale, 0));
      leaf.scale.set((0.36 - i * 0.05) * scale, (0.62 - i * 0.08) * scale, (0.36 - i * 0.05) * scale);
      leaf.rotation.y = i * 1.9;
      setShadow(leaf);
      this.scene.add(leaf);
    }
    this.addCollider(center.clone().add(new THREE.Vector3(0, 0.45 * scale, 0)), new THREE.Vector3(0.72 * scale, 0.9 * scale, 0.72 * scale), `plant_${center.x}_${center.z}`);
  }

  addWhiteboard(center, rotation = 0, title = 'PLAN') {
    const board = this.addBox(center, new THREE.Vector3(2.7, 1.25, 0.06), this.materials.ceiling, { cast: false, receive: true });
    board.rotation.y = rotation;
    const label = this.addSign(title, center.clone().add(new THREE.Vector3(0, 0.05, 0.04)), rotation, 1.6, 0.52);
    label.userData.noShadow = true;
  }

  addCorporateLogo(center) {
    this.addSign('INSPECTOR POSTURAL', center, 0, 3.8, 0.55);
  }

  addSign(text, center, rotation = 0, width = 1.8, height = 0.42) {
    const texture = makeCanvasLabel([text, 'GLOBAL CORP'], {
      width: 640,
      height: 180,
      titleFont: '800 46px Segoe UI',
      subtitleFont: '500 24px Segoe UI',
    });
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
    );
    mesh.position.copy(center);
    mesh.rotation.y = rotation;
    mesh.userData.noShadow = true;
    this.scene.add(mesh);
    return mesh;
  }

  setTransformation(level) {
    const t = Math.max(0, Math.min(1, level / 100));
    this.transformables.forEach(({ mesh, cold, warm }) => {
      mesh.material.color.set(cold).lerp(new THREE.Color(warm), t);
    });
  }
}
