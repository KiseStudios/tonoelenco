import { createCameraScene } from "./camera-scene";

export type CameraFrame = {
  width: number;
  height: number;
  progress: number;
};

export type CameraRequest = CameraFrame & {
  canvas?: OffscreenCanvas;
  pixelRatio?: number;
};

export type CameraReply = "rendered" | "unavailable";

let scene: ReturnType<typeof createCameraScene> | undefined;

function unavailable() {
  scene?.dispose();
  scene = undefined;
  self.postMessage("unavailable" satisfies CameraReply);
  self.close();
}

self.addEventListener("message", ({ data }: MessageEvent<CameraRequest>) => {
  try {
    if (data.canvas) {
      data.canvas.addEventListener("webglcontextlost", unavailable, { once: true });
      scene = createCameraScene(data.canvas, data.pixelRatio ?? 1);
    }
    if (!scene) {
      unavailable();
      return;
    }

    scene.render(data);
    self.postMessage("rendered" satisfies CameraReply);
  } catch {
    unavailable();
  }
});
