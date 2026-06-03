import * as THREE from 'three';

export class AdministrationArea {
  constructor(builder) {
    this.builder = builder;
  }

  build() {
    this.builder.addSign('ADMIN', new THREE.Vector3(16.72, 2.05, -6.6), -Math.PI / 2);
    this.builder.addDeskStation({
      id: 'admin_01',
      desk: new THREE.Vector3(10.6, 0.74, -6.2),
      worker: new THREE.Vector3(10.6, 0, -5.5),
      rotation: Math.PI,
    });
    this.builder.addDeskStation({
      id: 'admin_02',
      desk: new THREE.Vector3(14.2, 0.74, -6.2),
      worker: new THREE.Vector3(14.2, 0, -5.5),
      rotation: Math.PI,
    });
    this.builder.addCabinet(new THREE.Vector3(16.6, 0.72, -9.6), new THREE.Vector3(0.54, 1.44, 2.8));
  }
}
