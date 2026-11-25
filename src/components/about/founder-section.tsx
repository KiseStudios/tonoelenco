import Image from "next/image";
import { Container, Eyebrow } from "../brand";
import { photographs } from "../../data/coverage";

export function FounderSection() {
  const founder = photographs.find((photo) => photo.id === "fundador-retrato");
  if (!founder) throw new Error("O retrato oficial do fundador está ausente do manifesto.");

  return (
    <section className="founder-section" aria-labelledby="founder-title">
      <Container className="founder-section__layout">
        <figure className="founder-section__portrait">
          <div className="founder-section__frame">
            <Image
              src={founder.src}
              alt={founder.alt}
              width={founder.width}
              height={founder.height}
              sizes="(max-width: 767px) min(80vw, 320px), 384px"
              loading="lazy"
            />
          </div>
        </figure>
        <div className="founder-section__copy">
          <Eyebrow>O fundador · A presença por trás da câmera</Eyebrow>
          <h2 id="founder-title">POR TRÁS DE CADA REGISTRO,<br /><span>EXISTE UM OLHAR.</span></h2>
          <p>Estar perto muda a forma de enxergar. É desse encontro com o esporte que nasce a proposta do ELENCO.</p>
          <p>Do gesto antes da largada à emoção depois da prova, a fotografia dá espaço às pessoas que fazem cada momento acontecer.</p>
        </div>
      </Container>
    </section>
  );
}
