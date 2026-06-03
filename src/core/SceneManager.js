import * as THREE from 'three';
import { BuildingManager } from '../office/BuildingManager.js';
import { LightingManager } from '../rendering/LightingManager.js';
import { EnvironmentManager } from '../rendering/EnvironmentManager.js';
import { ShadowManager } from '../rendering/ShadowManager.js';

export class SceneManager {
  constructor(assetLoader, renderer) {
    this.assetLoader = assetLoader;
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 220);
    this.camera.position.set(0, 1.65, -8.5);
    this.lighting = new LightingManager(this.scene);
    this.building = new BuildingManager(this.scene, assetLoader);
    this.colliders = [];
    this.workstations = new Map();
  }

  build() {
    new EnvironmentManager(this.renderer).apply(this.scene);
    this.lighting.setup();
    const buildingData = this.building.build();
    this.colliders = buildingData.colliders;
    this.workstations = buildingData.workstations;
    new ShadowManager(this.scene).optimize();
  }

  setTransformation(level) {
    this.building.setTransformation(level);
    this.lighting.setTransformation(level);
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
