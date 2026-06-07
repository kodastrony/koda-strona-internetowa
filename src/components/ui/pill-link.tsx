import Link from "next/link";
import { cn } from "@/lib/utils";
import { EASE, cssBezier } from "@/lib/motion";

interface PillLinkProps {
  href: string;
  children: React.ReactNode;
  /**
   * Extra classes. Thanks to tailwind-merge these OVERRIDE the defaults, so a
   * call site can tweak padding / gap / text-colour (e.g. "px-7 py-3.5 text-white/50").
   */
  className?: string;
  /** Pill background. Default #1a1a1a (dark sections). */
  bg?: string;
  /** Pill border colour. Default a hair of white. */
  border?: string;
}

const EXPO = cssBezier(EASE.expo);

/**
 * KODA's signature pill call-to-action: rounded capsule, uppercase heading
 * label, and a trailing "+" that rotates 45° on hover. Used across the hero,
 * work and contact sections — one source of truth so they stay consistent.
 */
export function PillLink({
  href,
  children,
  className,
  bg = "#1a1a1a",
  border = "rgba(255,255,255,0.07)",
}: PillLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-5 rounded-full px-8 py-4",
        "font-heading text-[11px] font-bold tracking-[0.18em] uppercase",
        "text-white/60 transition-[color,transform,box-shadow] duration-300 hover:text-white active:scale-[0.97]",
        className
      )}
      style={{
        backgroundColor: bg,
        border: `1px solid ${border}`,
        transitionTimingFunction: EXPO,
      }}
    >
      {children}
      <span
        aria-hidden="true"
        className="text-xl leading-none font-normal transition-transform duration-500 group-hover:rotate-45"
        style={{ transitionTimingFunction: EXPO }}
      >
        +
      </span>
    </Link>
  );
}
