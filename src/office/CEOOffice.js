import * as THREE from 'three';

export class CEOOffice {
  constructor(builder) {
    this.builder = builder;
  }

  build() {
    this.builder.addSign('CEO', new THREE.Vector3(16.72, 2.08, 2.2), -Math.PI / 2);
    this.builder.addExecutiveDesk(new THREE.Vector3(13.5, 0.78, 2.2));
    this.builder.addLoungeChair(new THREE.Vector3(10.4, 0.38, 2.3), Math.PI / 2);
    this.builder.addPlant(new THREE.Vector3(16.2, 0, 4.6), 1.2);
  }
}
