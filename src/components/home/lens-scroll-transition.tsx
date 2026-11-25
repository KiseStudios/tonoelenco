"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { decodeSheet, renderSheet } from "./contact-sheet";

export function LensScrollTransition() {
  const rootRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const matteRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    const logo = logoRef.current;
    const sheet = sheetRef.current;
    const matte = matteRef.current;
    const stage = root?.firstElementChild;
    if (!root || !sheet || !matte || !logo || !(stage instanceof HTMLElement)) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = () => {};
    let generation = 0;
    async function setup() {
      const version = ++generation;
      cleanup();
      if (!root || !sheet || !matte || !logo || !(stage instanceof HTMLElement)) return;
      if (motion.matches) {
        root.dataset.mode = "static";
        return;
      }

      root.dataset.mode = "pending";
      if (!CSS.supports("mask-composite", "exclude")) {
        root.dataset.mode = "static";
        return;
      }
      try {
        const [photos] = await Promise.all([decodeSheet(), logo.decode()]);
        if (version !== generation) return;
        sheet.replaceChildren(...photos);
      } catch {
        if (version === generation) root.dataset.mode = "static";
        return;
      }
      root.dataset.mode = "scrub";
      let raf = 0;
      let last = -1;
      let visible = false;
      let range = Math.max(1, root.offsetHeight - stage.offsetHeight);
      function draw() {
        raf = 0;
        if (!visible || !root || !logo || !sheet || !matte) return;
        const p = Math.min(1, Math.max(0, -root.getBoundingClientRect().top / range));
        if (p === last) return;
        last = p;
        renderSheet(sheet, matte, logo, p);
        root.dataset.progress = p.toFixed(4);
      }
      const queue = () => { if (visible && !raf) raf = requestAnimationFrame(draw); };
      const resize = new ResizeObserver(() => {
        range = Math.max(1, root.offsetHeight - stage.offsetHeight);
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
        sheet.replaceChildren();
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
      <div className="contact-sheet" ref={sheetRef} aria-hidden="true" />
      <div className="contact-matte" ref={matteRef} aria-hidden="true" />
      <Image className="contact-brand" ref={logoRef} src="/brand/logo-horizontal.png" alt="ELENCO · Fotografia Esportiva" width={710} height={200} loading="eager" />
    </div>
  </section>;
}
