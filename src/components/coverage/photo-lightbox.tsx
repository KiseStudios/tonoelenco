"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Photograph } from "../../types/content";

interface PhotoLightboxProps {
  photo: Photograph;
  position: number;
  total: number;
  onClose: () => void;
  onNavigate: (direction: number) => void;
}

export function PhotoLightbox({ photo, position, total, onClose, onNavigate }: PhotoLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();

    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="photo-lightbox"
      aria-labelledby="lightbox-title"
      onClose={(event) => {
        if (!event.currentTarget.open) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          const controls = event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
          return;
        }
        if (total < 2) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          onNavigate(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="photo-lightbox__inner">
        <div className="photo-lightbox__toolbar">
          <span>ELENCO / FOTOGRAFIAS</span>
          <form method="dialog">
            <button className="photo-lightbox__control" type="submit" autoFocus>Fechar <span aria-hidden="true">×</span></button>
          </form>
        </div>
        <figure className="photo-lightbox__figure">
          <div className="photo-lightbox__image-frame">
            <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} className="photo-lightbox__image" sizes="(max-width: 768px) 100vw, 85vw" />
          </div>
          <figcaption className="photo-lightbox__caption">
            <h2 id="lightbox-title" aria-live="polite">{photo.name}</h2>
            <span>{position + 1} / {total}</span>
          </figcaption>
        </figure>
        {total > 1 && (
          <div className="photo-lightbox__navigation">
            <button className="photo-lightbox__control" onClick={() => onNavigate(-1)}><span aria-hidden="true">←</span> Anterior</button>
            <button className="photo-lightbox__control" onClick={() => onNavigate(1)}>Próxima <span aria-hidden="true">→</span></button>
          </div>
        )}
      </div>
    </dialog>
  );
}
