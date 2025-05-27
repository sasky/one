import * as THREE from "three";
import { BACKGROUND_COLORS } from "../constants/colors";

export function createBackground(): THREE.Group {
  const group = new THREE.Group();
  const shapes: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial>[] = [];

  const numShapes = 10;
  const generateNumPoints = () => {
    const minPoints = 3;
    const maxPoints = 20;
    return Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;
  };
  const generateScale = () => {
    const minScale = 0.5;
    const maxScale = 50;
    return Math.random() * (maxScale - minScale) + minScale;
  };
  // Create multiple shapes with different geometries
  for (let i = 0; i < numShapes; i++) {
    const shape = new THREE.Shape();
    const points = [];
    const numPoints = generateNumPoints();

    for (let j = 0; j < numPoints; j++) {
      const angle = (j / numPoints) * Math.PI * 2;
      const radius = Math.random() * 2 + 1;
      points.push(
        new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius)
      );
    }

    shape.setFromPoints(points);

    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({
      color:
        BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)],
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      -5
    );
    mesh.rotation.z = Math.random() * Math.PI * 2;
    mesh.scale.setScalar(generateScale());

    shapes.push(mesh);
    group.add(mesh);
  }

  return group;
}

export function animateBackground(background: THREE.Group): void {
  background.rotation.z += 0.001;
  background.children.forEach((shape) => {
    if (shape instanceof THREE.Mesh) {
      shape.rotation.z += 0.002;
    }
  });
}

export function cleanupBackground(background: THREE.Group): void {
  background.children.forEach((shape) => {
    if (shape instanceof THREE.Mesh) {
      shape.geometry.dispose();
      shape.material.dispose();
    }
  });
}
