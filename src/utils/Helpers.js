import * as THREE from 'three';

export function setShadow(mesh, cast = true, receive = true) {
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  return mesh;
}

export function makeBoxCollider(center, size, name = 'collider') {
  const half = new THREE.Vector3(size.x / 2, size.y / 2, size.z / 2);
  return {
    name,
    center: center.clone(),
    size: size.clone(),
    box: new THREE.Box3(center.clone().sub(half), center.clone().add(half)),
  };
}

export function makeCanvasLabel(lines, options = {}) {
  const width = options.width ?? 512;
  const height = options.height ?? 160;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = options.background ?? 'rgba(5, 13, 20, 0.86)';
  roundRect(ctx, 8, 8, width - 16, height - 16, 24);
  ctx.fill();
  ctx.strokeStyle = options.stroke ?? 'rgba(0, 212, 200, 0.55)';
  ctx.lineWidth = 3;
  roundRect(ctx, 8, 8, width - 16, height - 16, 24);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = options.color ?? '#ffffff';
  ctx.font = options.titleFont ?? '700 42px Segoe UI';
  ctx.fillText(lines[0] ?? '', width / 2, 68);
  if (lines[1]) {
    ctx.fillStyle = options.accent ?? '#00d4c8';
    ctx.font = options.subtitleFont ?? '500 28px Segoe UI';
    ctx.fillText(lines[1], width / 2, 114);
  }
  return new THREE.CanvasTexture(canvas);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

export function findAncestorWithUserData(object, key) {
  let current = object;
  while (current) {
    if (current.userData?.[key]) return current;
    current = current.parent;
  }
  return null;
}
