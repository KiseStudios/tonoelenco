import Image from "next/image";
export type BrandLogoVariant = "primary" | "horizontal" | "symbol";
export type BrandLogoTone = "on-light" | "on-dark";
type BrandLogoProps = { variant: BrandLogoVariant; tone: BrandLogoTone; alt?: string; src?: string; className?: string };
const labels: Record<BrandLogoVariant, string> = {
  primary: "Logo principal empilhado", horizontal: "Logo horizontal", symbol: "Símbolo E",
};
const assets: Record<BrandLogoVariant, Record<BrandLogoTone, string>> = {
  primary: { "on-light": "/brand/logo-primary-black.svg", "on-dark": "/brand/logo-primary-white.svg" },
  horizontal: { "on-light": "/brand/logo-horizontal-black.svg", "on-dark": "/brand/logo-horizontal-white.svg" },
  symbol: { "on-light": "/brand/symbol-e-black.svg", "on-dark": "/brand/symbol-e-white.svg" },
};
export function BrandLogo({ variant, tone, alt, src, className = "" }: BrandLogoProps) {
  const label = alt ?? labels[variant];
  const assetPath = src ?? assets[variant][tone];
  const dimensions = variant === "symbol" ? { width: 160, height: 120 } : variant === "horizontal" ? { width: 560, height: 160 } : { width: 360, height: 240 };
  return (
    <div className={`brand-logo-frame brand-logo-frame--${tone} brand-logo-frame--${variant} ${className}`.trim()}>
      {src ? (
        <Image src={assetPath} alt={label} width={dimensions.width} height={dimensions.height} sizes="(max-width: 48rem) 70vw, 420px" className="brand-logo" />
      ) : (
        <div className="brand-logo-pending" role="img" aria-label={`${label}: arquivo vetorial oficial pendente`}>
          <span>{label}</span><small>SVG oficial pendente</small>
        </div>
      )}
    </div>
  );
}
