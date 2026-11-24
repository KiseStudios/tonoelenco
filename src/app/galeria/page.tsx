import type { Metadata } from "next";
import { Container, Eyebrow } from "../../components/brand";

export const metadata: Metadata = {
  title: "Galeria",
};

export default function GaleriaPage() {
  return (
    <main className="site-page">
      <Container>
        <Eyebrow>ELENCO · Fotografia Esportiva</Eyebrow>
        <h1 className="brand-display site-page__title">Galeria</h1>
        <p className="site-page__intro">
          Este espaço está reservado para as galerias de fotografias esportivas.
        </p>
      </Container>
    </main>
  );
}
