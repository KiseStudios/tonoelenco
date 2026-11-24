import * as THREE from "three";
import { createCameraModel } from "./camera-model";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { CameraFrame } from "./camera-worker";

/** The original studio camera, rendered off the main thread. */
export function createCameraScene(canvas: OffscreenCanvas, pixelRatio: number) {
  const context = canvas.getContext("webgl2", { alpha: true, antialias: true, failIfMajorPerformanceCaveat: true });
  if (!context) return;

  const renderer = new THREE.WebGLRenderer({ canvas, context });
  renderer.setPixelRatio(Math.min(pixelRatio, 1.5));
  renderer.transmissionResolutionScale = 0.5;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  const view = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
  let cameraModel: ReturnType<typeof createCameraModel> | undefined;
  let environment: THREE.WebGLRenderTarget | undefined;

  function dispose() {
    cameraModel?.dispose();
    environment?.dispose();
    scene.clear();
    renderer.dispose();
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

    const initialRotation = model.camera.rotation.clone();
    let lastWidth = 0;
    let lastHeight = 0;
    return {
      render({ width, height, progress }: CameraFrame) {
        if (width !== lastWidth || height !== lastHeight) {
          lastWidth = width;
          lastHeight = height;
          view.aspect = width / height;
          view.updateProjectionMatrix();
          renderer.setSize(width, height, false);
        }

        const time = progress * 1.18;
        const rotation = 1 - Math.min(time / 0.6, 1);
        const approach = THREE.MathUtils.clamp(time - 0.18, 0, 1);
        const focus = Math.min(approach / 0.6, 1);
        const aperture = THREE.MathUtils.clamp((time - 0.2) / 0.65, 0, 1);
        model.camera.rotation.set(initialRotation.x * rotation, initialRotation.y * rotation, initialRotation.z * rotation);
        view.position.set(0.82 * approach, THREE.MathUtils.lerp(0.35, 0.4, approach), THREE.MathUtils.lerp(11.5, 2.65, approach));
        view.lookAt(0.82 * focus, THREE.MathUtils.lerp(0.15, 0.4, focus), 0);
        model.iris.rotation.z = Math.PI / 5 * aperture;
        model.iris.scale.set(1 + 0.8 * aperture, 1 + 0.8 * aperture, 1);
        renderer.render(scene, view);
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
