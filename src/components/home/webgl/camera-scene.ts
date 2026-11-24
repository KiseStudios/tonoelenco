import * as THREE from "three";
import { createCameraModel } from "./camera-model";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/** Original procedural camera. Loaded only when the transition enters the viewport. */
export function createCameraScene(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  const view = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
  view.position.set(0, 0.35, 11.5);
  view.lookAt(0, 0.15, 0);
  let cameraModel: ReturnType<typeof createCameraModel> | undefined;
  let environment: THREE.WebGLRenderTarget | undefined;

  function dispose() {
    cameraModel?.dispose();
    environment?.dispose();
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  try {
    const studio = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    try {
      environment = pmrem.fromScene(studio, 0.04);
      scene.environment = environment.texture;
      scene.environmentIntensity = 1.2;
    } finally {
      studio.dispose();
      pmrem.dispose();
    }

    const model = createCameraModel();
    cameraModel = model;
    scene.add(model.camera);
    scene.add(new THREE.HemisphereLight(0xd9e5e8, 0x15100c, 0.6));
    const key = new THREE.DirectionalLight(0xfff4e7, 3.5);
    key.position.set(-3, 5, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd4e6f0, 2);
    rim.position.set(5, 2, -3);
    scene.add(rim);

    return {
      camera: model.camera, view, iris: model.iris,
      render() { renderer.render(scene, view); },
      resize(width: number, height: number) {
        view.aspect = width / height;
        view.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
