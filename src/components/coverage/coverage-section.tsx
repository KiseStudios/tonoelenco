import Link from "next/link";
import { Container, Eyebrow } from "../brand";
import { photographs } from "../../data/coverage";
import { CoverageGrid } from "./coverage-grid";

const selectionIds = ["corrida-atleta-azul", "esporte-areia-atleta-bola", "motocross-piloto-lateral"];
const selection = photographs.filter((photo) => selectionIds.includes(photo.id));

export function CoverageSection() {
  return (
    <section className="coverage-section" aria-labelledby="coverage-title">
      <Container>
        <Eyebrow>Coberturas · O que nos move</Eyebrow>
        <div className="coverage-intro">
          <h2 id="coverage-title" className="coverage-title">UM OLHAR<br />DE QUEM<br /><span>TÁ DENTRO.</span></h2>
          <p>A disputa. O movimento. A vibração. Cada imagem nasce da experiência de quem vive o esporte.</p>
        </div>
        <CoverageGrid photos={selection} variant="selection" />
        <div className="coverage-section__footer">
          <p>O esporte acontece. O ELENCO registra.</p>
          <Link className="coverage-link" href="/galeria">Explore as fotografias <span aria-hidden="true">↗</span></Link>
        </div>
      </Container>
    </section>
  );
}
