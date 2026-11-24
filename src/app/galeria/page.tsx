import type { Metadata } from "next";
import { Container, Eyebrow } from "../../components/brand";
import { CoverageGrid } from "../../components/coverage/coverage-grid";
import { photographs } from "../../data/coverage";
import { externalLinkProps, officialLinks } from "../../lib/links";

export const metadata: Metadata = {
  title: "Galeria",
  description: "Um olhar de dentro do esporte. Explore a seleção de fotografias do ELENCO.",
};

const editorialPhotos = photographs.filter((photo) => photo.kind === "editorial");

export default function GaleriaPage() {
  return (
    <main className="editorial-gallery">
      <Container>
        <header className="editorial-gallery__header">
          <Eyebrow>ELENCO · Seleção fotográfica</Eyebrow>
          <div className="coverage-intro">
            <h1 className="coverage-title">O ESPORTE.<br /><span>POR DENTRO.</span></h1>
            <div className="editorial-gallery__intro">
              <p>Instantes de corrida, terra e areia. Explore as fotografias e veja cada detalhe de perto.</p>
              <a className="coverage-link" href={officialLinks.archive} {...externalLinkProps}>Acesse o acervo geral no Banlek <span aria-hidden="true">↗</span><span className="coverage-sr-only"> (abre em nova aba)</span></a>
            </div>
          </div>
        </header>
        <CoverageGrid photos={editorialPhotos} />
        <aside className="editorial-gallery__outro" aria-label="Acervo oficial">
          <h2>ENCONTRE<br />O SEU INSTANTE.</h2>
          <div>
            <p>Procura suas fotos? Consulte as fotografias disponíveis no acervo geral do ELENCO.</p>
            <a className="coverage-link" href={officialLinks.archive} {...externalLinkProps}>Ir ao acervo geral no Banlek <span aria-hidden="true">↗</span><span className="coverage-sr-only"> (abre em nova aba)</span></a>
            <a className="editorial-gallery__instagram" href={officialLinks.instagram} {...externalLinkProps}>Acompanhe @tonoelenco no Instagram<span className="coverage-sr-only"> (abre em nova aba)</span></a>
          </div>
        </aside>
      </Container>
    </main>
  );
}
