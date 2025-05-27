import { onCleanup, onMount } from "solid-js";
import * as THREE from "three";
import {
  createBackground,
  animateBackground,
  cleanupBackground,
} from "./Background";
import { createCube, animateCube, cleanupCube } from "./Cube";

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

    // Create and add background
    const background = createBackground();
    scene.add(background);

    // Create and add cube

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      //   animateBackground(background);

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
      cleanupBackground(background);
      renderer.dispose();
    });
  });

  return <div ref={container} style={{ width: "100vw", height: "100vh" }} />;
}
