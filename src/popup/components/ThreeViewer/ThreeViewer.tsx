import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface ThreeViewerProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  onSceneSetup?: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => void;
  animate?: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => void;
  cameraPosition?: THREE.Vector3;
}

const ThreeViewer: React.FC<ThreeViewerProps> = ({
  id,
  className,
  style,
  onSceneSetup,
  animate,
  cameraPosition = new THREE.Vector3(0, 0, 5),
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);

  // Initialize
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.copy(cameraPosition);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene setup
    if (onSceneSetup) {
      onSceneSetup(scene, camera, renderer);
    }

    // Animation loop
    const renderLoop = () => {
      if (animate) {
        animate(scene, camera, renderer);
      }

      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // Resize handler
    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      // Prevent memory leaks
      cancelAnimationFrame(frameIdRef.current!);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      id={id}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
      ref={mountRef}
    />
  );
};

export default ThreeViewer;
