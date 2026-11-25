import Image from "next/image";
import Link from "next/link";
import { Container } from "../brand";
import { siteNavigation } from "../../lib/navigation";
import { officialLinks, externalLinkProps } from "../../lib/links";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="institutional-footer">
      <Container>
        <div className="institutional-footer__main">
          <div className="institutional-footer__identity">
            <Link href="/" aria-label="ELENCO — página inicial">
              <Image
                src="/brand/logo-horizontal.png"
                alt="ELENCO — Fotografia Esportiva"
                width={710}
                height={200}
                className="institutional-footer__logo"
              />
            </Link>
            <p>Aqui todo mundo faz parte.</p>
          </div>
          <nav aria-label="Navegação do rodapé" className="institutional-footer__navigation">
            {siteNavigation.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </nav>
          <div className="institutional-footer__channels">
            <a href={officialLinks.whatsapp} {...externalLinkProps}>
              WhatsApp
              <span className="coverage-sr-only"> (abre em nova aba)</span>
            </a>
            <a href={officialLinks.instagram} {...externalLinkProps}>
              Instagram @tonoelenco
              <span className="coverage-sr-only"> (abre em nova aba)</span>
            </a>
            <a href={officialLinks.archive} {...externalLinkProps}>
              Acervo geral no Banlek
              <span className="coverage-sr-only"> (abre em nova aba)</span>
            </a>
          </div>
        </div>
        <div className="institutional-footer__legal">
          <p>© {year} ELENCO — Fotografia Esportiva.</p>
          <p>Todos os direitos reservados.</p>
        </div>
      </Container>
    </footer>
  );
}
