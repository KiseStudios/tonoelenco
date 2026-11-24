import Image from "next/image";
import Link from "next/link";
import { Container, Eyebrow } from "../brand";
import { heroPhoto } from "../../data/coverage";

export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero__visual">
        <Image
          src="/images/motocross-hero-original.jpg"
          alt={heroPhoto.alt}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 832px) 100vw, 62vw"
          className="home-hero__image"
        />
      </div>
      <div className="home-hero__scrim" aria-hidden="true" />
      <Container className="home-hero__content">
        <Eyebrow>ELENCO · Fotografia Esportiva</Eyebrow>
        <h1 id="home-title" className="home-hero__title">
          AQUI TODO
          <br />
          MUNDO FAZ
          <br />
          <span>PARTE.</span>
        </h1>
        <p className="home-hero__copy">
          Cada prova tem uma história. Encontre a sua.
        </p>
        <div className="home-hero__actions">
          <Link className="home-button home-button--primary" href="/galeria">
            Encontre suas fotos <span aria-hidden="true">↗</span>
          </Link>
          <a className="home-button home-button--secondary" href="#sobre-elenco">
            Descubra o ELENCO <span aria-hidden="true">↓</span>
          </a>
        </div>
      </Container>
      <div className="home-hero__edge" aria-hidden="true">FOTOGRAFIA ESPORTIVA / MOMENTOS QUE FICAM</div>
    </section>
  );
}
