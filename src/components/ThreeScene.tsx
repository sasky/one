import { onCleanup, onMount } from "solid-js";
import * as THREE from "three";

export default function ThreeScene() {
  let container: HTMLDivElement | undefined;

  onMount(() => {
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create background shapes
    const createBackgroundShape = () => {
      const group = new THREE.Group();

      // Create abstract shapes
      const shapes: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial>[] =
        [];
      const colors = [0x2a9d8f, 0x264653, 0xe9c46a, 0xf4a261, 0xe76f51];

      // Create multiple shapes with different geometries
      for (let i = 0; i < 15; i++) {
        const shape = new THREE.Shape();
        const points = [];
        const numPoints = Math.floor(Math.random() * 3) + 3; // 3-5 points

        for (let j = 0; j < numPoints; j++) {
          const angle = (j / numPoints) * Math.PI * 2;
          const radius = Math.random() * 2 + 1;
          points.push(
            new THREE.Vector2(
              Math.cos(angle) * radius,
              Math.sin(angle) * radius
            )
          );
        }

        shape.setFromPoints(points);

        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: colors[Math.floor(Math.random() * colors.length)],
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          -5
        );
        mesh.rotation.z = Math.random() * Math.PI * 2;
        mesh.scale.setScalar(Math.random() * 0.5 + 0.5);

        shapes.push(mesh);
        group.add(mesh);
      }

      return group;
    };

    const background = createBackgroundShape();
    scene.add(background);

    // Add a simple cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate background shapes slowly
      background.rotation.z += 0.001;
      background.children.forEach((shape) => {
        if (shape instanceof THREE.Mesh) {
          shape.rotation.z += 0.002;
        }
      });

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
      container?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      background.children.forEach((shape) => {
        if (shape instanceof THREE.Mesh) {
          shape.geometry.dispose();
          shape.material.dispose();
        }
      });
      renderer.dispose();
    });
  });

  return <div ref={container} style={{ width: "100vw", height: "100vh" }} />;
}
