import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Transaction } from "../../types/transaction";

export function bitmapSceneSetup(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  transactions: Transaction[],
  onHover: (tx: Transaction | null) => void
) {
  // Check if scene is already set up to avoid resetting camera
  const hasExistingSetup = scene.children.some(
    (child) => child.userData && child.userData.type === "transaction-mesh"
  );

  // Setup scene theme (only if not already set up)
  if (!hasExistingSetup) {
    scene.background = new THREE.Color("#0d0d0d"); // Dark Bitcoin background

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    const directionalLight = new THREE.DirectionalLight(0xffa500, 1.2);
    directionalLight.position.set(10, 20, 10);
    scene.add(ambientLight, directionalLight);

    // Position camera properly (only on first setup)
    camera.position.set(0, 50, 120);
    camera.lookAt(0, 0, 30);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // Grid helper
    const grid = new THREE.GridHelper(200, 50, 0xff9900, 0x222222);
    scene.add(grid);
  }

  // Transaction cuboids
  const txMeshes: THREE.Mesh[] = [];

  const txColor = new THREE.Color("#f7931a"); // Bitcoin orange
  const baseMaterial = new THREE.MeshStandardMaterial({ color: txColor });

  transactions.forEach((tx, i) => {
    const size = tx.size;
    const value = tx.vout?.[0]?.value || 0;

    const area = Math.sqrt(size); // to improve
    const height = (value / 1e8) * 10; // scale BTC to height (e.g., 1 BTC = 10 units)

    const geometry = new THREE.BoxGeometry(area, height, area);
    const material = baseMaterial.clone();
    material.color = txColor.clone();

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(
      (i % 10) * 12 - 60, // X (spread out in a grid)
      height / 2, // Y (lift by half height so base is on grid)
      Math.floor(i / 10) * 12 // Z
    );

    // Add userData to mesh for identification
    mesh.userData = {
      type: "transaction-mesh",
      transaction: tx,
    };

    scene.add(mesh);
    txMeshes.push(mesh);
  });

  // Raycasting
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  let lastHovered: THREE.Mesh | null = null;

  function onMouseMove(event: MouseEvent) {
    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(txMeshes);

    if (intersects.length > 0) {
      const mesh = intersects[0]!.object as THREE.Mesh;

      if (lastHovered !== mesh) {
        if (lastHovered) {
          (lastHovered.material as THREE.MeshStandardMaterial).emissive.set(
            0x000000
          );
        }

        lastHovered = mesh;
        (mesh.material as THREE.MeshStandardMaterial).emissive.set(0xffa500);

        onHover(mesh.userData.transaction as Transaction);
      }
    } else {
      if (lastHovered) {
        (lastHovered.material as THREE.MeshStandardMaterial).emissive.set(
          0x000000
        );
        lastHovered = null;
      }
      onHover(null);
    }
  }

  renderer.domElement.addEventListener("mousemove", onMouseMove);
}

export function bitmapAnimate(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) {
  renderer.render(scene, camera);
}
