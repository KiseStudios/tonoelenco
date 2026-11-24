"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Galeria", href: "/galeria" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <a className="site-skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="site-wordmark" href="/" aria-label="ELENCO — página inicial" onClick={() => setMenuOpen(false)}>
            <Image src="/brand/logo-horizontal.png" alt="ELENCO Fotografia Esportiva" width={220} height={62} priority className="site-wordmark__image" />
          </Link>

          <button
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
            {navigation.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
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
          </nav>
        </div>
      </header>

      <div id="conteudo" tabIndex={-1}>{children}</div>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <Image src="/brand/logo-horizontal.png" alt="ELENCO Fotografia Esportiva" width={180} height={51} className="site-footer__logo" />
          <p>Fotografia Esportiva</p>
        </div>
      </footer>
    </div>
  );
}
