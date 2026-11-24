import Image from "next/image";
import Link from "next/link";
import { Container, Eyebrow } from "../brand";
import { heroPhoto } from "../../data/coverage";

export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <picture className="home-hero__visual">
        <source
          media="(max-width: 40rem)"
          srcSet={`/images/motocross-hero-480.webp 480w, /images/motocross-hero-original.jpg ${heroPhoto.width}w`}
          sizes="100vw"
        />
        <Image
          src="/images/motocross-hero-original.jpg"
          alt={heroPhoto.alt}
          fill
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
    </section>
  );
}
