"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type RevealVariant = "fade" | "clip" | "line";

interface ScrollRevealProps {
  children?: ReactNode;
  className?: string;
  stagger?: boolean;
  variant?: RevealVariant;
  as?: ElementType;
}

const VARIANT_CLASS: Record<RevealVariant, string> = {
  fade: "reveal",
  clip: "clip-reveal",
  line: "line-reveal",
};

export function ScrollReveal({
  children,
  className = "",
  stagger = false,
  variant = "fade",
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const selector = stagger ? `.${VARIANT_CLASS[variant]}` : null;
    const targets = selector
      ? el.querySelectorAll(selector)
      : [el];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [stagger, variant]);

  const baseClass = stagger ? "reveal-stagger" : VARIANT_CLASS[variant];

  return (
    <Tag ref={ref} className={`${baseClass} ${className}`}>
      {children}
    </Tag>
  );
}
