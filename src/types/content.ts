export type Sport = "corrida" | "motocross" | "esporte-de-areia-nao-confirmado";

export interface ConfirmedAlbum {
  url: string;
  /** Fonte que comprova o destino específico deste álbum. */
  evidence: string;
}

export interface Photograph {
  id: string;
  name: string;
  src: `/images/${string}`;
  kind: "editorial" | "institucional";
  sport: Sport | null;
  alt: string;
  width: number;
  height: number;
  credit: { name: string; evidence: string } | null;
  source: { archive: string; file: string; sha256: string };
  authorization: {
    suppliedFor: "desenvolvimento-do-site";
    publication: "pendente" | "confirmada" | "restrita";
    evidence: string | null;
  };
  album: ConfirmedAlbum | null;
}

interface CoverageContent {
  id: string;
  title: string;
  sport: Sport;
  coverPhotoId: string | null;
  photoIds: readonly string[];
  description: string | null;
}

export type Coverage = CoverageContent & (
  | { availability: "disponivel"; album: ConfirmedAlbum }
  | { availability: "pendente"; album: null }
);
