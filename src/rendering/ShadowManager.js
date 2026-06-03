export class ShadowManager {
  constructor(scene) {
    this.scene = scene;
  }

  optimize() {
    this.scene.traverse((object) => {
      if (!object.isMesh) return;
      if (object.userData?.noShadow) {
        object.castShadow = false;
        object.receiveShadow = false;
        return;
      }
      object.castShadow = object.castShadow ?? true;
      object.receiveShadow = object.receiveShadow ?? true;
    });
  }
}
