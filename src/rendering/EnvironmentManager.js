import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export class EnvironmentManager {
  constructor(renderer) {
    this.renderer = renderer;
    this.pmrem = new THREE.PMREMGenerator(renderer);
  }

  apply(scene) {
    const env = new RoomEnvironment();
    const environmentMap = this.pmrem.fromScene(env, 0.04).texture;
    scene.environment = environmentMap;
    scene.background = new THREE.Color(0x07111c);
    scene.fog = new THREE.FogExp2(0x0a1522, 0.018);
    env.dispose();
  }
}
