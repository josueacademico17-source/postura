import * as THREE from 'three';

export function damp(current, target, lambda, dt) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function dampVector2(current, target, lambda, dt) {
  current.x = damp(current.x, target.x, lambda, dt);
  current.y = damp(current.y, target.y, lambda, dt);
  return current;
}

export function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

export function lerpColorHex(a, b, t) {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return ca.lerp(cb, clamp01(t)).getHex();
}
