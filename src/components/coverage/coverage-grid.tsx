"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { Photograph, Sport } from "../../types/content";
import { PhotoLightbox } from "./photo-lightbox";

const sportLabels: Record<Sport, string> = {
  corrida: "Corrida",
  motocross: "Motocross",
  "esporte-de-areia-nao-confirmado": "Esporte na areia",
};

export function CoverageGrid({ photos, variant = "gallery" }: {
  photos: readonly Photograph[];
  variant?: "selection" | "gallery";
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const navigate = useCallback((direction: number) => {
    setSelected((current) => current === null ? null : (current + direction + photos.length) % photos.length);
  }, [photos.length]);

  return (
    <>
      <div className={`coverage-grid coverage-grid--${variant}`}>
        {photos.map((photo, index) => (
          <figure className="coverage-photo" key={photo.id}>
            <button
              type="button"
              className="coverage-photo__button"
              aria-label={`Ampliar fotografia: ${photo.name}`}
              aria-haspopup="dialog"
              onClick={() => setSelected(index)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 40vw"
                className="coverage-photo__image"
              />
              <span className="coverage-photo__expand" aria-hidden="true">Ampliar ↗</span>
            </button>
            <figcaption className="coverage-photo__caption">
              <span>{photo.sport ? sportLabels[photo.sport] : "Institucional"}</span>
              <span>{photo.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      {selected !== null && photos[selected] && (
        <PhotoLightbox
          photo={photos[selected]}
          position={selected}
          total={photos.length}
          onClose={close}
          onNavigate={navigate}
        />
      )}
    </>
  );
}
