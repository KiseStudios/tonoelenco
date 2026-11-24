import type { CameraFrame, CameraReply, CameraRequest } from "./camera-worker";

type DeviceNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

export function mountCameraPreview(root: HTMLElement, host: HTMLElement) {
  const nav = navigator as DeviceNavigator;
  if (
    !("transferControlToOffscreen" in HTMLCanvasElement.prototype) ||
    nav.connection?.saveData ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 4)
  ) return;

  let worker: Worker | undefined;
  let canvas: HTMLCanvasElement | undefined;
  let rendered = false;
  let inFlight = false;
  let active = false;
  let failed = false;
  let slowFrames = 0;
  let sentAt = 0;
  let lastFrame: CameraFrame | undefined;
  let progress = 0;

  function stop() {
    worker?.terminate();
    worker = undefined;
    canvas?.remove();
    root.dataset.mode = "fallback";
    observer.disconnect();
    resize.disconnect();
  }

  function fail() {
    failed = true;
    stop();
  }

  function render() {
    if (failed || !worker || inFlight || !active || document.hidden) return;
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    if (lastFrame?.width === width && lastFrame.height === height && lastFrame.progress === progress) return;

    const frame = { width, height, progress };
    try {
      if (!lastFrame && canvas) {
        const offscreen = canvas.transferControlToOffscreen();
        const request: CameraRequest = { ...frame, canvas: offscreen, pixelRatio: window.devicePixelRatio || 1 };
        worker.postMessage(request, [offscreen]);
      } else {
        worker.postMessage(frame satisfies CameraRequest);
      }
      lastFrame = frame;
      sentAt = performance.now();
      inFlight = true;
    } catch {
      fail();
    }
  }

  function start() {
    try {
      canvas = document.createElement("canvas");
      host.append(canvas);
      worker = new Worker(new URL("./camera-worker.ts", import.meta.url), { type: "module" });
      worker.addEventListener("error", fail);
      worker.addEventListener("message", ({ data }: MessageEvent<CameraReply>) => {
        if (data === "unavailable") {
          fail();
          return;
        }

        inFlight = false;
        if (rendered) {
          slowFrames = performance.now() - sentAt > 100 ? slowFrames + 1 : 0;
          if (slowFrames >= 5) {
            fail();
            return;
          }
        }
        rendered = true;
        // Keep the same representation during the approach if 3D finishes late.
        if (progress < 0.12) root.dataset.mode = "webgl";
        render();
      });
    } catch {
      fail();
    }
  }

  const resize = new ResizeObserver(render);
  const observer = new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    if (active && !worker && !failed) start();
    render();
  }, { rootMargin: "55% 0px" });
  resize.observe(host);
  observer.observe(root);
  document.addEventListener("visibilitychange", render);

  return {
    update(value: number) {
      progress = value;
      if (rendered && !failed && progress < 0.12) root.dataset.mode = "webgl";
      render();
    },
    dispose() {
      document.removeEventListener("visibilitychange", render);
      stop();
    },
  };
}
