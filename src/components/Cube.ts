import * as THREE from "three";

export function createCube(): THREE.Mesh {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
}

export function animateCube(cube: THREE.Mesh): void {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}

export function cleanupCube(cube: THREE.Mesh): void {
  cube.geometry.dispose();
  if (cube.material instanceof THREE.Material) {
    cube.material.dispose();
  }
}
