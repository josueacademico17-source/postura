import * as THREE from 'three';

export class LightingManager {
  constructor(scene) {
    this.scene = scene;
    this.keyLights = [];
    this.ambient = null;
  }

  setup() {
    this.ambient = new THREE.HemisphereLight(0xf6fbff, 0x253146, 1.5);
    this.scene.add(this.ambient);

    const sun = new THREE.DirectionalLight(0xfff1df, 2.4);
    sun.position.set(9, 13, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 54;
    sun.shadow.camera.left = -22;
    sun.shadow.camera.right = 22;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    sun.shadow.bias = -0.0008;
    this.scene.add(sun);
    this.keyLights.push(sun);

    const fixtures = [
      [-12, -11], [-4, -11], [4, -11], [12, -11],
      [-12, -3], [-4, -3], [4, -3], [12, -3],
      [-12, 5], [-4, 5], [4, 5], [12, 5],
      [-12, 13], [-4, 13], [4, 13], [12, 13],
    ];

    fixtures.forEach(([x, z], index) => {
      const light = new THREE.PointLight(index % 3 === 0 ? 0xcfe8ff : 0xfff5df, 0.42, 7.5, 1.6);
      light.position.set(x, 2.82, z);
      this.scene.add(light);
    });

    const accent = new THREE.PointLight(0x00d4c8, 1.1, 18, 2);
    accent.position.set(-15, 2.2, -14);
    this.scene.add(accent);

    const warm = new THREE.PointLight(0xffb86b, 0.85, 12, 2);
    warm.position.set(12, 2.3, 10);
    this.scene.add(warm);
  }

  setTransformation(level) {
    const t = Math.max(0, Math.min(1, level / 100));
    if (this.ambient) this.ambient.intensity = 1.18 + t * 0.72;
    this.keyLights.forEach((light) => {
      light.intensity = 1.7 + t * 1.05;
    });
  }
}
