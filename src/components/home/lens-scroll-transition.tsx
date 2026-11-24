"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mountCameraPreview } from "./webgl/camera-preview";

export function LensScrollTransition() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!root || !stage || !canvas) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 48rem) and (pointer: fine)",
    }, ({ conditions }) => {
      if (!conditions?.motion) return;

      const { desktop } = conditions;
      const preview = desktop ? mountCameraPreview(root, canvas) : undefined;
      const frame = { progress: 0 };
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => "+=" + (root.offsetHeight - stage.offsetHeight),
          scrub: true,
        },
      });
      timeline
        .to(frame, { progress: 1, duration: 1, onUpdate: () => preview?.update(frame.progress) }, 0)
        .to(".lens-transition__fallback", { scale: desktop ? 4.2 : 3.1, duration: 0.81 }, 0.14)
        .to(".lens-transition__caption", { opacity: 0, y: -24, duration: 0.27 }, 0.14)
        .to(".lens-transition__art", { opacity: 0, duration: 0.24 }, 0.76);

      // Recalculate only this trigger if the sticky range or the Hero above it changes size.
      const resize = new ResizeObserver(() => timeline.scrollTrigger?.refresh());
      resize.observe(root);
      resize.observe(stage);
      if (root.previousElementSibling) resize.observe(root.previousElementSibling);
      return () => {
        resize.disconnect();
        preview?.dispose();
      };
    }, root);
    return () => media.revert();
  }, []);

  return (
    <section ref={rootRef} className="lens-transition" aria-labelledby="lens-transition-title" data-mode="fallback">
      <div ref={stageRef} className="lens-transition__stage">
        <div className="lens-transition__art" aria-hidden="true">
          <div ref={canvasRef} className="lens-transition__canvas" />
          <div className="lens-transition__fallback">
            <Image src="/images/camera-studio.webp" alt="" fill sizes="(max-width: 767px) 100vw, 80vw" />
          </div>
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
