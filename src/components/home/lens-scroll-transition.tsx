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
      if (!root || !logo || !(stage instanceof HTMLElement)) return;
      if (motion.matches) {
        root.dataset.mode = "static";
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      let art: ReturnType<typeof createMotion>;
      root.dataset.mode = "pending";
      try {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await logo.decode();
          if (version !== generation) return;
          art = createMotion(ctx, logo);
        }
      } catch {
        // Keep the official signature available when the drawing surface or image cannot initialize.
      }
      if (version !== generation) return;
      if (!art) {
        root.dataset.mode = "static";
        return;
      }

      stage.prepend(canvas);
      root.dataset.mode = "scrub";
      let raf = 0;
      let last = -1;
      let visible = false;
      let needsResize = true;
      function draw() {
        raf = 0;
        if (!visible || !root || !(stage instanceof HTMLElement) || !art) return;
        if (needsResize) {
          art.resize();
          needsResize = false;
          last = -1;
        }
        const p = Math.min(1, Math.max(0, -root.getBoundingClientRect().top / Math.max(1, root.offsetHeight - stage.offsetHeight)));
        if (p === last) return;
        last = p;
        art.draw(p);
        root.dataset.progress = p.toFixed(4);
      }
      const queue = () => { if (visible && !raf) raf = requestAnimationFrame(draw); };
      const resize = new ResizeObserver(() => {
        needsResize = true;
        queue();
      });
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        queue();
      });
      resize.observe(stage);
      intersection.observe(stage);
      window.addEventListener("scroll", queue, { passive: true });
      cleanup = () => {
        resize.disconnect();
        intersection.disconnect();
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
  return <section className="lens-transition" ref={rootRef} data-mode="pending" aria-label="ELENCO · Fotografia Esportiva">
    <div className="lens-transition__stage">
      <Image ref={logoRef} src="/brand/logo-horizontal.png" alt="ELENCO · Fotografia Esportiva" width={710} height={200} loading="eager" />
    </div>
  </section>;
}
