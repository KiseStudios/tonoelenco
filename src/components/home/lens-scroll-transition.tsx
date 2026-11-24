"use client";

import { useEffect, useRef } from "react";
import type { Mesh, Object3D, Scene, WebGLRenderer } from "three";
import type { gsap } from "gsap";

type DeviceNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

function isMesh(object: Object3D): object is Mesh {
  return "isMesh" in object && object.isMesh === true;
}

export function LensScrollTransition() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let observer: IntersectionObserver | undefined;
    let renderer: WebGLRenderer | undefined;
    let scene: Scene | undefined;
    let timeline: gsap.core.Timeline | undefined;
    let resizeHandler: (() => void) | undefined;
    let disposed = false;

    const nav = navigator as DeviceNavigator;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smallScreen = window.matchMedia("(max-width: 767px)").matches;
    const lowPower = nav.connection?.saveData === true || (nav.deviceMemory !== undefined && nav.deviceMemory <= 4);

    if (reducedMotion || smallScreen || lowPower || !("WebGLRenderingContext" in window)) {
      root.dataset.mode = "fallback";
      return;
    }

    const loadScene = async () => {
      try {
        const nearViewport = await new Promise<boolean>((resolve) => {
          observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              observer?.disconnect();
              resolve(true);
            }
          }, { rootMargin: "240px 0px" });
          observer.observe(root);
        });
        if (!nearViewport || disposed) return;

        const [THREE, gsapModule, scrollModule] = await Promise.all([
          import("three"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (disposed) return;

        const gsap = gsapModule.gsap ?? gsapModule.default;
        const ScrollTrigger = scrollModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        const activeScene = new THREE.Scene();
        scene = activeScene;
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.set(0, 0, 9);

        const activeRenderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
        renderer = activeRenderer;
        activeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        activeRenderer.setClearColor(0x000000, 0);

        const lens = new THREE.Group();
        activeScene.add(lens);

        const metal = new THREE.MeshStandardMaterial({ color: 0x262626, metalness: 0.88, roughness: 0.24 });
        const edge = new THREE.MeshStandardMaterial({ color: 0x858585, metalness: 0.92, roughness: 0.2 });
        const dark = new THREE.MeshStandardMaterial({ color: 0x08090b, metalness: 0.45, roughness: 0.28 });
        const glass = new THREE.MeshPhysicalMaterial({
          color: 0x9db5c0,
          metalness: 0.2,
          roughness: 0.08,
          transmission: 0.62,
          transparent: true,
          opacity: 0.88,
          thickness: 0.8,
          ior: 1.45,
        });

        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(2.18, 2.3, 1.15, 96, 1, false), metal);
        barrel.rotation.x = Math.PI / 2;
        lens.add(barrel);

        const innerBarrel = new THREE.Mesh(new THREE.CylinderGeometry(1.92, 2.02, 0.5, 96), dark);
        innerBarrel.rotation.x = Math.PI / 2;
        innerBarrel.position.z = 0.63;
        lens.add(innerBarrel);

        [1.94, 2.12, 2.27].forEach((radius, index) => {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, index === 1 ? 0.075 : 0.035, 12, 96), edge);
          ring.position.z = index === 0 ? 0.82 : index === 1 ? 0.42 : -0.25;
          lens.add(ring);
        });

        const glassDisk = new THREE.Mesh(new THREE.CircleGeometry(1.83, 96), glass);
        glassDisk.position.z = 0.9;
        lens.add(glassDisk);

        const iris = new THREE.Group();
        iris.position.z = 1.02;
        lens.add(iris);
        const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x111316, metalness: 0.72, roughness: 0.32, side: THREE.DoubleSide });
        const bladeShape = new THREE.Shape();
        bladeShape.moveTo(0.28, -0.12);
        bladeShape.lineTo(1.82, -0.48);
        bladeShape.lineTo(1.9, 0.08);
        bladeShape.lineTo(0.58, 0.36);
        bladeShape.closePath();

        for (let index = 0; index < 6; index += 1) {
          const blade = new THREE.Mesh(new THREE.ShapeGeometry(bladeShape), bladeMaterial);
          blade.rotation.z = (Math.PI * 2 * index) / 6;
          iris.add(blade);
        }

        const centerRing = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.055, 10, 64), edge);
        centerRing.position.z = 0.04;
        iris.add(centerRing);

        const ambient = new THREE.AmbientLight(0xffffff, 1.45);
        activeScene.add(ambient);
        const keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
        keyLight.position.set(-3, 4, 7);
        activeScene.add(keyLight);
        const rimLight = new THREE.PointLight(0x91b7ca, 18, 16);
        rimLight.position.set(3, -2, 4);
        activeScene.add(rimLight);

        const render = () => {
          if (disposed || !renderer) return;
          activeRenderer.render(activeScene, camera);
        };

        const resize = () => {
          if (disposed || !renderer) return;
          const bounds = root.getBoundingClientRect();
          const width = Math.max(1, bounds.width);
          const height = Math.max(1, bounds.height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          activeRenderer.setSize(width, height, false);
          render();
        };
        resize();
        resizeHandler = resize;
        window.addEventListener("resize", resize, { passive: true });

        root.dataset.mode = "webgl";
        const activeTimeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=1450",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          onUpdate: render,
        });

        timeline = activeTimeline;

        activeTimeline
          .to(lens.scale, { x: 4.7, y: 4.7, z: 4.7 }, 0)
          .to(lens.rotation, { z: Math.PI * 2, y: 0.22 }, 0)
          .to(camera.position, { z: 4.4 }, 0)
          .to(iris.scale, { x: 1.72, y: 1.72, z: 1 }, 0.18)
          .to(glass, { opacity: 0.12 }, 0.62)
          .to(root, { backgroundColor: "#f1f0e9" }, 0.72)
          .to(canvas, { opacity: 0 }, 0.88);

        render();
      } catch {
        if (!disposed) root.dataset.mode = "fallback";
        renderer?.dispose();
        renderer = undefined;
      }
    };

    void loadScene();

    return () => {
      disposed = true;
      observer?.disconnect();
      window.removeEventListener("resize", resizeHandler ?? (() => undefined));
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
      if (scene) {
        scene.traverse((object) => {
          if (!isMesh(object)) return;
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        });
      }
      renderer?.dispose();
      root.style.backgroundColor = "";
    };
  }, []);

  return (
    <section ref={rootRef} className="lens-transition" aria-labelledby="lens-transition-title" data-mode="fallback">
      <div className="lens-transition__pin">
        <canvas ref={canvasRef} className="lens-transition__canvas" aria-hidden="true" />
        <div className="lens-transition__fallback" aria-hidden="true">
          <span className="lens-transition__fallback-ring lens-transition__fallback-ring--outer" />
          <span className="lens-transition__fallback-ring lens-transition__fallback-ring--inner" />
          <span className="lens-transition__fallback-iris" />
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
