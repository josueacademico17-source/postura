import * as THREE from 'three';

export class ReceptionArea {
  constructor(builder) {
    this.builder = builder;
  }

  build() {
    this.builder.addSign('RECEPCION', new THREE.Vector3(0, 2.12, -16.72), 0);
    this.builder.addReceptionCounter(new THREE.Vector3(0, 0.55, -13.2));
    this.builder.addDeskStation({
      id: 'reception_01',
      desk: new THREE.Vector3(0, 0.74, -12.1),
      worker: new THREE.Vector3(0, 0, -11.35),
      rotation: Math.PI,
      compact: true,
    });
    this.builder.addPlant(new THREE.Vector3(-4.3, 0, -14.1), 1.05);
    this.builder.addPlant(new THREE.Vector3(4.3, 0, -14.1), 1.05);
  }
}
