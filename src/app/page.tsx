import Link from "next/link";
import { ContactClosing } from "../components/contact/contact-closing";
import { CoverageSection } from "../components/coverage/coverage-section";
import { HomeHero } from "../components/home/home-hero";
import { LensScrollTransition } from "../components/home/lens-scroll-transition";
import { Container, Eyebrow } from "../components/brand";

const editorialItems = [
  { label: "MODALIDADE", value: "Motocross" },
  { label: "OLHAR", value: "Fotografia esportiva" },
  { label: "REGISTRO", value: "Cada momento importa" },
];

export default function Home() {
  return (
    <main>
      <HomeHero />
      <section className="home-editorial-strip" aria-label="Informações editoriais">
        <Container className="home-editorial-strip__inner">
          {editorialItems.map((item, index) => (
            <div className="home-editorial-item" key={item.label}>
              <span className="home-editorial-item__index">0{index + 1}</span>
              <div>
                <p>{item.label}</p>
                <strong>{item.value}</strong>
              </div>
            </div>
          ))}
        </Container>
      </section>
      <LensScrollTransition />
      <CoverageSection />
      <section id="sobre-elenco" className="home-about">
        <Container className="home-about__inner">
          <Eyebrow>ELENCO · Fotografia Esportiva</Eyebrow>
          <h2>O esporte acontece em um instante. A fotografia faz ele ficar.</h2>
          <p>
            O ELENCO registra a energia de cada prova e aproxima atletas,
            equipes e pessoas das imagens que contam suas histórias.
          </p>
          <Link className="home-about__link" href="/sobre">Conheça o ELENCO</Link>
        </Container>
      </section>
      <ContactClosing />
    </main>
  );
}
