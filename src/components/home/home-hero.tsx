import Image from "next/image";
import Link from "next/link";
import { Container, Eyebrow } from "../brand";

export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <Image
        src="/images/motocross-front.webp"
        alt="Piloto de motocross acelerando em uma pista de terra durante a prova"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="home-hero__image"
      />
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
