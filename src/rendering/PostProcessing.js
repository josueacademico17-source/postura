import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import * as THREE from 'three';

export class PostProcessing {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.enabled = true;

    try {
      this.composer = new EffectComposer(renderer);
      this.renderPass = new RenderPass(scene, camera);
      this.composer.addPass(this.renderPass);

      this.ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
      this.ssaoPass.kernelRadius = 16;
      this.ssaoPass.minDistance = 0.004;
      this.ssaoPass.maxDistance = 0.12;
      this.composer.addPass(this.ssaoPass);

      this.bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.38,
        0.55,
        0.78,
      );
      this.composer.addPass(this.bloomPass);
    } catch (error) {
      console.warn('Postprocessing disabled:', error);
      this.enabled = false;
    }
  }

  resize(width, height) {
    if (!this.enabled) return;
    this.composer.setSize(width, height);
    this.ssaoPass.setSize(width, height);
  }

  setTransformation(level) {
    if (!this.enabled || !this.bloomPass) return;
    const t = Math.max(0, Math.min(1, level / 100));
    this.bloomPass.strength = 0.28 + t * 0.3;
    this.bloomPass.radius = 0.48 + t * 0.16;
  }

  render() {
    if (this.enabled) {
      this.composer.render();
      return;
    }
    this.renderer.render(this.scene, this.camera);
  }
}
