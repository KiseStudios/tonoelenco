import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "../../components/brand";
import { officialLinks, externalLinkProps } from "../../lib/links";

const description = "Converse com o ELENCO pelo WhatsApp ou Instagram, ou encontre suas fotografias no acervo oficial do Banlek.";

export const metadata: Metadata = {
  title: "Contato",
  description,
  openGraph: { title: "Contato — ELENCO Fotografia Esportiva", description, type: "website", locale: "pt_BR" },
};

export default function ContatoPage() {
  return (
    <main className="contact-page">
      <Container>
        <header className="contact-opening">
          <Eyebrow>ELENCO · Vamos conversar</Eyebrow>
          <h1>O PRÓXIMO<br />CAPÍTULO PODE<br /><span>SER O SEU.</span></h1>
          <p>Seu evento merece ser lembrado. Entre em contato com o ELENCO e faça parte do próximo registro.</p>
        </header>
        <section className="contact-channels" aria-labelledby="channels-title">
          <h2 id="channels-title">POR ONDE COMEÇAMOS?</h2>
          <a className="contact-channel" href={officialLinks.whatsapp} {...externalLinkProps}>
            <span className="contact-channel__context">Contato direto</span>
            <span className="contact-channel__title">CONVERSAR NO WHATSAPP</span>
          </a>
          <a className="contact-channel" href={officialLinks.instagram} {...externalLinkProps}>
            <span className="contact-channel__context">Para conversar sobre o seu evento</span>
            <span className="contact-channel__title">FALAR NO INSTAGRAM</span>
          </a>
          <a className="contact-channel" href={officialLinks.archive} {...externalLinkProps}>
            <span className="contact-channel__context">Para encontrar suas fotografias</span>
            <span className="contact-channel__title">ACESSAR O ACERVO NO BANLEK</span>
          </a>
        </section>
        <div className="contact-page__return">
          <p>Cada história começa com um encontro.</p>
          <Link href="/" className="institutional-text-link">Voltar ao início</Link>
        </div>
      </Container>
    </main>
  );
}
