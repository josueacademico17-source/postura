import * as THREE from 'three';

export class AssetLoader {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.cache = new Map();
  }

  async loadTexture(path, options = {}) {
    if (this.cache.has(path)) return this.cache.get(path);
    const texture = await this.textureLoader.loadAsync(path);
    texture.colorSpace = options.colorSpace ?? THREE.SRGBColorSpace;
    texture.wrapS = options.wrapS ?? THREE.RepeatWrapping;
    texture.wrapT = options.wrapT ?? THREE.RepeatWrapping;
    if (options.repeat) texture.repeat.set(options.repeat.x, options.repeat.y);
    this.cache.set(path, texture);
    return texture;
  }

  createProceduralTexture({ base = '#243244', line = '#334458', size = 256, divisions = 8 } = {}) {
    const key = `${base}-${line}-${size}-${divisions}`;
    if (this.cache.has(key)) return this.cache.get(key);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    for (let i = 0; i <= divisions; i += 1) {
      const p = (i / divisions) * size;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, size);
      ctx.moveTo(0, p);
      ctx.lineTo(size, p);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);
    this.cache.set(key, texture);
    return texture;
  }
}
