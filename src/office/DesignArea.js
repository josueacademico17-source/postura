import * as THREE from 'three';

export class DesignArea {
  constructor(builder) {
    this.builder = builder;
  }

  build() {
    this.builder.addSign('DISENO', new THREE.Vector3(-10.7, 2.05, 16.72), 0);
    this.builder.addDeskStation({
      id: 'design_01',
      desk: new THREE.Vector3(-10.4, 0.74, 9.3),
      worker: new THREE.Vector3(-10.4, 0, 10.0),
      rotation: Math.PI,
      creative: true,
      wristRisk: true,
    });
    this.builder.addWhiteboard(new THREE.Vector3(-15.6, 1.45, 8.2), Math.PI / 2, 'SPRINT');
    this.builder.addLoungeChair(new THREE.Vector3(-13.6, 0.38, 12.5), 0);
    this.builder.addPlant(new THREE.Vector3(-16.6, 0, 13.8), 1.15);
  }
}
