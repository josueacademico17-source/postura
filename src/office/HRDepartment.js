import * as THREE from 'three';

export class HRDepartment {
  constructor(builder) {
    this.builder = builder;
  }

  build() {
    this.builder.addSign('RRHH', new THREE.Vector3(-16.72, 2.05, -6.7), Math.PI / 2);
    this.builder.addDeskStation({
      id: 'hr_01',
      desk: new THREE.Vector3(-10.8, 0.74, -6.4),
      worker: new THREE.Vector3(-10.8, 0, -5.7),
      rotation: Math.PI,
      badMonitor: true,
    });
    this.builder.addCabinet(new THREE.Vector3(-16.6, 0.75, -8.8), new THREE.Vector3(0.54, 1.5, 2.4));
    this.builder.addRoundTable(new THREE.Vector3(-13.6, 0.42, -2.9), 0.8, 0.12, 'quick_meeting');
  }
}
