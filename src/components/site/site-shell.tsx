"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import type { ReactNode } from "react";

import { siteNavigation } from "../../lib/navigation";
import { officialLinks, externalLinkProps } from "../../lib/links";

export function SiteShell({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <a className="site-skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="site-header" onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          toggleRef.current?.focus();
        }
      }}>
        <div className="site-header__inner">
          <Link className="site-wordmark" href="/" aria-label="ELENCO — página inicial" onClick={() => setMenuOpen(false)}>
            <Image src="/brand/logo-horizontal.png" alt="ELENCO Fotografia Esportiva" width={220} height={62} priority className="site-wordmark__image" />
          </Link>

          <button
            ref={toggleRef}
            className="site-menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>

          <nav
            id="site-navigation"
            className={`site-navigation${menuOpen ? " site-navigation--open" : ""}`}
            aria-label="Navegação principal"
          >
            {siteNavigation.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`site-navigation__link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              className="site-navigation__archive"
              href={officialLinks.archive}
              {...externalLinkProps}
              onClick={() => setMenuOpen(false)}
            >
              Encontre suas fotos
              <span className="coverage-sr-only"> no acervo geral Banlek (abre em nova aba)</span>
            </a>
          </nav>
        </div>
      </header>

      <div id="conteudo" tabIndex={-1}>{children}</div>

      {footer}
    </div>
  );
}
