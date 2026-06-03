import * as THREE from 'three';

export class CallCenterArea {
  constructor(builder) {
    this.builder = builder;
  }

  build() {
    this.builder.addSign('CALL CENTER', new THREE.Vector3(10.4, 2.05, 16.72), 0);
    this.builder.addDeskStation({
      id: 'call_01',
      desk: new THREE.Vector3(9.4, 0.74, 9.7),
      worker: new THREE.Vector3(9.4, 0, 10.4),
      rotation: Math.PI,
      badMonitor: true,
    });
    this.builder.addDeskStation({
      id: 'call_02',
      desk: new THREE.Vector3(13.2, 0.74, 9.7),
      worker: new THREE.Vector3(13.2, 0, 10.4),
      rotation: Math.PI,
    });
    this.builder.addCabinet(new THREE.Vector3(16.65, 0.8, 12.4), new THREE.Vector3(0.52, 1.6, 3.2));
  }
}
