"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { gsap } from "gsap";
import type { createCameraScene } from "./webgl/camera-scene";

type DeviceNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

export function LensScrollTransition() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const screen = window.matchMedia("(max-width: 767px)");
    const nav = navigator as DeviceNavigator;
    const lowPower = nav.connection?.saveData === true || (nav.deviceMemory !== undefined && nav.deviceMemory <= 4);
    let scene: ReturnType<typeof createCameraScene> | undefined;
    let context: gsap.Context | undefined;
    let observer: IntersectionObserver | undefined;
    let disposed = false;

    const release = () => {
      context?.revert();
      context = undefined;
      const activeScene = scene;
      scene = undefined;
      activeScene?.dispose();
      delete canvas.dataset.engine;
      root.dataset.mode = "fallback";
    };
    const resize = () => {
      if (!scene || disposed || document.hidden) return;
      scene.resize(root.clientWidth, root.clientHeight);
      scene.render();
    };
    const changePreference = () => {
      if (motion.matches || screen.matches) release();
    };
    const restore = (event: Event) => {
      event.preventDefault();
      release();
    };
    const loadScene = async () => {
      if (disposed || motion.matches || screen.matches || lowPower) return;
      try {
        const [engine, gsapModule, scrollModule] = await Promise.all([
          import("./webgl/camera-scene"), import("gsap"), import("gsap/ScrollTrigger"),
        ]);
        if (disposed || motion.matches || screen.matches) return;
        const gsap = gsapModule.gsap;
        gsap.registerPlugin(scrollModule.ScrollTrigger);
        const activeScene = engine.createCameraScene(canvas);
        scene = activeScene;
        canvas.dataset.engine = "three.js";
        resize();
        root.dataset.mode = "webgl";
        const focus = { x: 0, y: 0.15 };
        context = gsap.context(() => {
          gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root, start: "top top", end: "+=1450", scrub: 0.7, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
            onUpdate: () => {
              if (disposed || !scene || document.hidden) return;
              activeScene.view.lookAt(focus.x, focus.y, 0);
              activeScene.render();
            },
          })
            .to(activeScene.camera.rotation, { x: 0, y: 0, z: 0, duration: 0.6 }, 0)
            .to(activeScene.view.position, { x: 0.82, y: 0.4, z: 2.65, duration: 1 }, 0.18)
            .to(focus, { x: 0.82, y: 0.4, duration: 0.6 }, 0.18)
            .to(activeScene.iris.rotation, { z: Math.PI / 5, duration: 0.65 }, 0.2)
            .to(activeScene.iris.scale, { x: 1.8, y: 1.8, duration: 0.65 }, 0.2)
            .to(".lens-transition__caption", { opacity: 0, y: -28, duration: 0.28 }, 0.15)
            .to(canvas, { opacity: 0, duration: 0.2 }, 0.98);
        }, root);
        activeScene.render();
      } catch {
        release();
      }
    };
    if (!motion.matches && !screen.matches && !lowPower && "WebGLRenderingContext" in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer?.disconnect();
          void loadScene();
        }
      }, { rootMargin: "240px 0px" });
      observer.observe(root);
    }
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", resize);
    motion.addEventListener("change", changePreference);
    screen.addEventListener("change", changePreference);
    canvas.addEventListener("webglcontextlost", restore);
    return () => {
      disposed = true;
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", resize);
      motion.removeEventListener("change", changePreference);
      screen.removeEventListener("change", changePreference);
      canvas.removeEventListener("webglcontextlost", restore);
      release();
    };
  }, []);

  return (
    <section ref={rootRef} className="lens-transition" aria-labelledby="lens-transition-title" data-mode="fallback">
      <div className="lens-transition__pin">
        <canvas ref={canvasRef} className="lens-transition__canvas" aria-hidden="true" />
        <div className="lens-transition__fallback" aria-hidden="true">
          <Image src="/images/camera-studio.webp" alt="" fill sizes="(max-width: 767px) 100vw, 80vw" />
        </div>
        <div className="lens-transition__caption">
          <p className="lens-transition__eyebrow">ELENCO · Fotografia esportiva</p>
          <h2 id="lens-transition-title">O instante<br /><span>se revela.</span></h2>
          <p className="lens-transition__hint">Continue rolando para entrar na galeria</p>
        </div>
      </div>
    </section>
  );
}
