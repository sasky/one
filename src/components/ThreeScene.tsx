import { onCleanup, onMount } from "solid-js";
import * as THREE from "three";
import {
  createBackground,
  animateBackground,
  cleanupBackground,
} from "./Background";
import { createCube, animateCube, cleanupCube } from "./Cube";
import { noise } from "../utils/randomUtils";

export default function ThreeScene() {
  let container: HTMLDivElement | undefined;

  onMount(() => {
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000033); // Dark blue background
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 1. Create a noise-based terrain
    const terrainSize = 20;
    const terrainResolution = 50;
    const terrainGeometry = new THREE.PlaneGeometry(
      terrainSize,
      terrainSize,
      terrainResolution,
      terrainResolution
    );

    // Apply noise to terrain vertices
    const vertices = terrainGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 2];
      vertices[i + 1] = noise(x * 0.2, z * 0.2) * 2; // Y position
    }
    terrainGeometry.computeVertexNormals();

    const terrainMaterial = new THREE.MeshStandardMaterial({
      color: 0x44aa88,
      wireframe: false,
      flatShading: true,
    });
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2;
    scene.add(terrain);

    // 2. Create a dynamic background shape with noise-based shading
    const backgroundShape = new THREE.Mesh(
      new THREE.SphereGeometry(5, 32, 32),
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          noiseScale: { value: 0.5 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform float noiseScale;
          varying vec2 vUv;
          
          // Simple noise function
          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          void main() {
            vec2 uv = vUv * noiseScale;
            float n = noise(uv + time);
            vec3 color = mix(
              vec3(0.1, 0.2, 0.3),  // Dark blue
              vec3(0.2, 0.3, 0.4),  // Lighter blue
              n
            );
            gl_FragColor = vec4(color, 1.0);
          }
        `,
      })
    );
    backgroundShape.position.z = -10;
    scene.add(backgroundShape);

    // 3. Create particle system
    const particleCount = 1000;
    const particles = new THREE.Group();
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.userData = {
        originalX: (Math.random() - 0.5) * 10,
        originalY: (Math.random() - 0.5) * 10,
        originalZ: (Math.random() - 0.5) * 10,
        timeOffset: Math.random() * 1000,
      };
      particles.add(particle);
    }
    scene.add(particles);

    // Create and add background
    const background = createBackground();
    scene.add(background);

    // Create and add cube

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 15;
    camera.position.y = 5;
    camera.lookAt(0, 0, 0);

    let time = 0;
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Update background shape shader
      if (backgroundShape.material instanceof THREE.ShaderMaterial) {
        backgroundShape.material.uniforms.time.value = time;
      }

      // Animate particles
      particles.children.forEach((particle) => {
        const { originalX, originalY, originalZ, timeOffset } =
          particle.userData;
        const noiseX = noise(originalX * 0.1, time * 0.1 + timeOffset) * 2;
        const noiseY =
          noise(originalY * 0.1, time * 0.1 + timeOffset + 100) * 2;
        const noiseZ =
          noise(originalZ * 0.1, time * 0.1 + timeOffset + 200) * 2;

        particle.position.x = originalX + noiseX;
        particle.position.y = originalY + noiseY;
        particle.position.z = originalZ + noiseZ;
      });

      // Rotate terrain and particles
      terrain.rotation.z += 0.001;
      particles.rotation.y += 0.001;

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
