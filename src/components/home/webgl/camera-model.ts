import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/** Shared procedural geometry for the live scene and its static studio rendering. */
export function createCameraModel() {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  // Deterministic micrograin gives rubber a surface response at grazing angles.
  const grain = new Uint8Array(128 * 128 * 4);
  let seed = 17;
  for (let i = 0; i < grain.length; i += 4) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const value = 100 + (seed % 100);
    grain.set([value, value, value, 255], i);
  }
  const bump = new THREE.DataTexture(grain, 128, 128);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(5, 5);
  bump.needsUpdate = true;
  textures.add(bump);
  const rubber = new THREE.MeshStandardMaterial({ color: 0x17191b, roughness: 0.78, metalness: 0.08, bumpMap: bump, bumpScale: 0.018 });
  const magnesium = new THREE.MeshStandardMaterial({ color: 0x24282b, metalness: 0.78, roughness: 0.32 });
  const black = new THREE.MeshStandardMaterial({ color: 0x080a0b, roughness: 0.34, metalness: 0.55 });
  const silver = new THREE.MeshStandardMaterial({ color: 0x9ca3a5, roughness: 0.24, metalness: 1 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x658b83, metalness: 0, roughness: 0.075, transmission: 0.96, thickness: 0.45, ior: 1.52, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.8 });
  const coating = new THREE.MeshPhysicalMaterial({ color: 0x273639, metalness: 0.15, roughness: 0.12, clearcoat: 1 });

  const camera = new THREE.Group();
  camera.rotation.set(-0.14, -0.43, -0.045);
  camera.position.set(0.45, 0.45, 0);

  function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D = camera) {
    geometries.add(geometry);
    materials.add(material);
    const object = new THREE.Mesh(geometry, material);
    parent.add(object);
    return object;
  }
  function box(w: number, h: number, d: number, radius: number, material: THREE.Material, x: number, y: number, z: number) {
    const object = mesh(new RoundedBoxGeometry(w, h, d, 3, radius), material);
    object.position.set(x, y, z);
    return object;
  }
  function ring(radius: number, tube: number, z: number, material: THREE.Material, parent: THREE.Object3D) {
    const object = mesh(new THREE.TorusGeometry(radius, tube, 10, 96), material, parent);
    object.position.z = z;
    return object;
  }
  box(4.65, 2.55, 1.2, 0.16, magnesium, 0, 0, -0.7);
  box(1.02, 2.72, 1.66, 0.25, rubber, -1.94, -0.04, -0.35);
  box(0.94, 0.66, 1.1, 0.11, black, 0.23, 1.47, -0.7);
  box(0.69, 0.08, 0.59, 0.025, silver, 0.23, 1.83, -0.75);
  box(1.05, 0.95, 0.028, 0.04, rubber, 1.68, -0.32, -0.082);
  const lens = new THREE.Group();
  lens.position.set(0.37, -0.05, 0);
  camera.add(lens);
  const barrel = mesh(new THREE.CylinderGeometry(1.06, 1.12, 1.8, 96, 1, true), black, lens);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = 0.75;
  ring(1.12, 0.07, -0.06, silver, lens);
  ring(1.08, 0.06, 0.2, magnesium, lens);
  ring(1.065, 0.045, 1.55, silver, lens);
  ring(0.98, 0.07, 1.62, black, lens);
  ring(0.89, 0.025, 1.65, magnesium, lens);
  [0.38, 0.5, 0.62, 0.74, 0.86, 0.98, 1.1].forEach((z) => ring(1.065, 0.015, z, rubber, lens));
  const ribGeometry = new THREE.BoxGeometry(0.025, 0.045, 0.64);
  geometries.add(ribGeometry);
  materials.add(rubber);
  const ribs = new THREE.InstancedMesh(ribGeometry, rubber, 96);
  const transform = new THREE.Object3D();
  for (let i = 0; i < 96; i++) {
    const angle = i * Math.PI * 2 / 96;
    transform.position.set(Math.cos(angle) * 1.074, Math.sin(angle) * 1.074, 0.76);
    transform.rotation.z = angle - Math.PI / 2;
    transform.updateMatrix();
    ribs.setMatrixAt(i, transform.matrix);
  }
  lens.add(ribs);
  const opticalBack = mesh(new THREE.SphereGeometry(0.87, 48, 24), coating, lens);
  opticalBack.scale.z = 0.08;
  opticalBack.position.z = 0.94;
  const iris = new THREE.Group();
  iris.position.z = 1.1;
  lens.add(iris);
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0.16, -0.1);
  bladeShape.lineTo(0.87, -0.4);
  bladeShape.lineTo(0.93, 0.06);
  bladeShape.lineTo(0.3, 0.27);
  bladeShape.closePath();
  const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.006, bevelEnabled: false });
  for (let i = 0; i < 6; i++) {
    const blade = mesh(bladeGeometry, magnesium, iris);
    blade.rotation.z = i * Math.PI / 3;
    blade.position.z = i * 0.007;
  }
  const frontGlass = mesh(new THREE.SphereGeometry(0.87, 64, 32), glass, lens);
  frontGlass.scale.z = 0.12;
  frontGlass.position.z = 1.42;

  // Mode dial, shutter, strap lugs and fasteners make the silhouette readable.
  [-1.3, 1.65].forEach((x) => {
    const dial = mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.18, 40), black);
    dial.position.set(x, 1.36, -0.64);
    for (let i = 0; i < 24; i++) {
      const mark = mesh(new THREE.BoxGeometry(0.018, 0.12, 0.035), silver);
      const angle = i * Math.PI / 12;
      mark.position.set(x + Math.cos(angle) * 0.335, 1.36, -0.64 + Math.sin(angle) * 0.335);
      mark.rotation.y = -angle;
    }
  });
  const shutter = mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.09, 32), silver);
  shutter.position.set(-1.98, 1.4, 0.05);
  [-2.38, 2.38].forEach((x) => {
    const lug = mesh(new THREE.TorusGeometry(0.11, 0.035, 8, 20), silver);
    lug.position.set(x, 0.92, -0.48);
    lug.rotation.y = Math.PI / 2;
  });
  [[-1.32, -0.94], [1.94, 0.92], [1.95, -1.0]].forEach(([x, y]) => {
    const screw = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.025, 12), silver);
    screw.rotation.x = Math.PI / 2;
    screw.position.set(x, y, -0.08);
  });
  if (typeof OffscreenCanvas !== "undefined" || typeof document !== "undefined") {
    const labelCanvas = typeof document === "undefined" ? new OffscreenCanvas(512, 128) : document.createElement("canvas");
    labelCanvas.width = 512;
    labelCanvas.height = 128;
    const context = labelCanvas.getContext("2d");
    if (context && "fillText" in context) {
      context.fillStyle = "#d1d5d3";
      context.font = "italic 900 72px Arial";
      context.fillText("ELENCO", 14, 82);
      const label = new THREE.CanvasTexture(labelCanvas);
      label.colorSpace = THREE.SRGBColorSpace;
      textures.add(label);
      const print = mesh(new THREE.PlaneGeometry(0.86, 0.215), new THREE.MeshBasicMaterial({ map: label, transparent: true, depthWrite: false }));
      print.position.set(-0.83, 0.94, -0.075);
    }
  }
  return {
    camera, iris,
    dispose() {
      ribs.dispose();
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
    },
  };
}
