"use client";
import Link from "next/link";
import type { CSSProperties } from "react";

interface Props {
  href: string;
  style?: CSSProperties;
  hoverStyle?: CSSProperties;
  children: React.ReactNode;
  className?: string;
}

export default function HoverLink({ href, style, hoverStyle, children, className }: Props) {
  return (
    <Link href={href} style={style} className={className}
      onMouseEnter={e => { if (hoverStyle) Object.assign(e.currentTarget.style, hoverStyle); }}
      onMouseLeave={e => { if (style) Object.assign(e.currentTarget.style, style); }}>
      {children}
    </Link>
  );
}
