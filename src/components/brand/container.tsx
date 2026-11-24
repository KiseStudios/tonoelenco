import type { HTMLAttributes } from "react";
type ContainerProps = HTMLAttributes<HTMLDivElement> & { width?: "content" | "wide" | "full" };
export function Container({ width = "wide", className = "", ...props }: ContainerProps) {
  return <div className={`brand-container brand-container--${width} ${className}`.trim()} {...props} />;
}
