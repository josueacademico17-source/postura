import * as THREE from 'three';

export class DecorationSystem {
  constructor(builder) {
    this.builder = builder;
  }

  build() {
    this.builder.addMeetingRoom(new THREE.Vector3(-4.1, 0, 1.4));
    this.builder.addCafeteria(new THREE.Vector3(3.6, 0, 1.5));
    this.builder.addBreakArea(new THREE.Vector3(-4.2, 0, 12.7));
    this.builder.addPlant(new THREE.Vector3(-17.1, 0, -14.4), 1.25);
    this.builder.addPlant(new THREE.Vector3(17.1, 0, -14.4), 1.25);
    this.builder.addPlant(new THREE.Vector3(-17.1, 0, 15.0), 1.15);
    this.builder.addPlant(new THREE.Vector3(17.1, 0, 15.0), 1.15);
    this.builder.addCorporateLogo(new THREE.Vector3(0, 2.05, -16.62));
  }
}
