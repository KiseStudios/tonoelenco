import Link from "next/link";
import { Container, Eyebrow } from "../brand";

export function ContactClosing() {
  return (
    <section className="contact-closing" aria-labelledby="contact-closing-title">
      <Container className="contact-closing__layout">
        <div>
          <Eyebrow>Vamos conversar</Eyebrow>
          <h2 id="contact-closing-title">FAÇA PARTE DO<br />PRÓXIMO REGISTRO.</h2>
        </div>
        <Link className="institutional-action" href="/contato">Converse com o ELENCO</Link>
      </Container>
    </section>
  );
}
