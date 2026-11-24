import type { Metadata } from "next";
import { Container, Eyebrow } from "../../components/brand";
import { FounderSection } from "../../components/about/founder-section";
import { ContactClosing } from "../../components/contact/contact-closing";

const description = "Conheça a proposta do ELENCO e o olhar por trás das fotografias. Aqui todo mundo faz parte do esporte.";

export const metadata: Metadata = {
  title: "Sobre",
  description,
  openGraph: { title: "Sobre o ELENCO — Fotografia Esportiva", description, type: "website", locale: "pt_BR" },
};

export default function SobrePage() {
  return (
    <main className="about-page">
      <header className="about-opening">
        <Container>
          <Eyebrow>ELENCO · Quem somos</Eyebrow>
          <h1>MAIS QUE<br />FOTOGRAFIA.<br /><span>FAZER PARTE<br />DO ESPORTE.</span></h1>
          <div className="about-opening__statement">
            <p>Aqui todo mundo faz parte.</p>
            <p>Quem compete. Quem acompanha. Quem vive cada instante.</p>
          </div>
        </Container>
      </header>
      <section className="about-purpose" aria-labelledby="purpose-title">
        <Container className="about-purpose__layout">
          <Eyebrow>A nossa proposta</Eyebrow>
          <div>
            <h2 id="purpose-title">O INSTANTE PASSA.<br />A HISTÓRIA FICA.</h2>
            <p>Fotografar o esporte é reconhecer o que cada pessoa coloca em movimento. O esforço, a concentração, a alegria de estar ali.</p>
            <p>O ELENCO aproxima atletas, equipes e público dessas histórias. Um registro para se reconhecer, compartilhar e guardar.</p>
          </div>
        </Container>
      </section>
      <FounderSection />
      <ContactClosing />
    </main>
  );
}
