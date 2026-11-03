import Link from "next/link";

type VMSLogoProps = {
  href?: string;
  showBackArrow?: boolean;
  className?: string;
};

export function VMSLogo({ href = "/", showBackArrow = false, className = "" }: VMSLogoProps) {
  const content = (
    <>
      {showBackArrow && <span aria-hidden className="mr-1.5">←</span>}
      <span
        className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex-shrink-0 shadow-lg shadow-teal-500/30 border border-teal-400/30"
        aria-hidden
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          {/* Clipboard / checklist style - visitor management */}
          <rect x="5" y="3" width="14" height="18" rx="2" ry="2" />
          <path d="M9 3v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3" />
          <path d="M8 11h8" />
          <path d="M8 15h5" />
          <path d="M10 7l2 2 3-3" />
        </svg>
      </span>
      <span className="font-bold tracking-tight ml-2.5 text-[1.05em]">VMS</span>
    </>
  );

  const wrapperClass = `inline-flex items-center text-stone-800 hover:text-teal-700 transition-colors ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={wrapperClass}>
        {content}
      </Link>
    );
  }
  return <span className={wrapperClass}>{content}</span>;
}
