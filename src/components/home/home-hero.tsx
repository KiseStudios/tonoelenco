import Image from "next/image";
import Link from "next/link";
import { Container, Eyebrow } from "../brand";
import { heroPhoto } from "../../data/coverage";

export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero__layout">
        <picture className="home-hero__photograph">
          <source media="(min-width: 48rem)" srcSet="/images/motocross-hero-horizontal.webp" width={1866} height={843} />
          <Image
            src="/images/motocross-hero-original.jpg"
            alt={heroPhoto.alt}
            width={heroPhoto.width}
            height={heroPhoto.height}
            loading="eager"
            fetchPriority="high"
            className="home-hero__image"
          />
        </picture>
        <Container className="home-hero__content">
          <Eyebrow>ELENCO · Fotografia Esportiva</Eyebrow>
          <h1 id="home-title" className="home-hero__title">
            AQUI TODO
            <br />
            MUNDO FAZ
            <br />
            PARTE.
          </h1>
          <p className="home-hero__copy">
            Cada prova tem uma história. Encontre a sua.
          </p>
          <div className="home-hero__actions">
            <Link className="home-button home-button--primary" href="/galeria">
              Encontre suas fotos
            </Link>
            <a className="home-button home-button--secondary" href="#sobre-elenco">
              Descubra o ELENCO
            </a>
          </div>
        </Container>
      </div>
    </section>
  );
}
