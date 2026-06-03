import * as THREE from 'three';
import { OFFICE } from '../utils/Constants.js';
import { setShadow } from '../utils/Helpers.js';

export class FloorManager {
  constructor(scene, materials, assetLoader) {
    this.scene = scene;
    this.materials = materials;
    this.assetLoader = assetLoader;
  }

  build() {
    const floorTexture = this.assetLoader.createProceduralTexture({
      base: '#263344',
      line: '#314458',
      size: 256,
      divisions: 4,
    });

    const floor = setShadow(
      new THREE.Mesh(
        new THREE.PlaneGeometry(OFFICE.width, OFFICE.depth),
        new THREE.MeshStandardMaterial({
          map: floorTexture,
          color: 0xcfd8dc,
          roughness: 0.62,
          metalness: 0.02,
        }),
      ),
      false,
      true,
    );
    floor.rotation.x = -Math.PI / 2;
    floor.userData.floorMaterial = true;
    this.scene.add(floor);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(OFFICE.width, OFFICE.depth),
      this.materials.ceiling,
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = OFFICE.wallHeight;
    ceiling.userData.noShadow = true;
    this.scene.add(ceiling);

    const panelGeo = new THREE.BoxGeometry(3.4, 0.035, 1.55);
    for (let x = -15.3; x <= 15.3; x += 3.8) {
      for (let z = -13.6; z <= 13.6; z += 1.9) {
        const panel = new THREE.Mesh(panelGeo, this.materials.ceilingPanel);
        panel.position.set(x, OFFICE.wallHeight - 0.06, z);
        panel.userData.noShadow = true;
        this.scene.add(panel);
      }
    }
  }
}
