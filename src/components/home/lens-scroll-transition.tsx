"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createMotion } from "./editorial-motion";

export function LensScrollTransition() {
  const rootRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    const logo = logoRef.current;
    const stage = root?.firstElementChild;
    if (!root || !logo || !(stage instanceof HTMLElement)) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = () => {};
    let generation = 0;
    async function setup() {
      const version = ++generation;
      cleanup();
      if (!root || !logo || !(stage instanceof HTMLElement) || motion.matches) return;
      try { await logo.decode(); } catch { return; }
      if (version !== generation) return;
      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      const art = createMotion(canvas, logo);
      if (!art) return;
      stage.prepend(canvas);
      root.dataset.mode = "scrub";
      let raf = 0;
      let last = -1;
      function draw() {
        raf = 0;
        if (!root || !(stage instanceof HTMLElement)) return;
        const p = Math.min(1, Math.max(0, -root.getBoundingClientRect().top / Math.max(1, root.offsetHeight - stage.offsetHeight)));
        if (p === last) return;
        last = p;
        art?.draw(p);
        root.dataset.progress = p.toFixed(4);
      }
      const queue = () => { if (!raf) raf = requestAnimationFrame(draw); };
      const resize = () => { art.resize(); last = -1; queue(); };
      const observer = new ResizeObserver(resize);
      observer.observe(stage);
      window.addEventListener("scroll", queue, { passive: true });
      resize();
      cleanup = () => {
        observer.disconnect();
        window.removeEventListener("scroll", queue);
        cancelAnimationFrame(raf);
        canvas.remove();
        logo.style.removeProperty("opacity");
        root.dataset.mode = "static";
        delete root.dataset.progress;
      };
    }
    void setup();
    motion.addEventListener("change", setup);
    return () => { generation++; motion.removeEventListener("change", setup); cleanup(); };
  }, []);
  return <section className="lens-transition" ref={rootRef} data-mode="static" aria-label="ELENCO · Fotografia Esportiva">
    <div className="lens-transition__stage">
      <Image ref={logoRef} src="/brand/logo-horizontal.png" alt="ELENCO · Fotografia Esportiva" width={710} height={200} loading="eager" />
    </div>
  </section>;
}
