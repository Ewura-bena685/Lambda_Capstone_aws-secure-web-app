"use client";

import { useState, useEffect } from "react";

type TypewriterProps = {
  text: string;
  speed?: number;
  className?: string;
  cursorClassName?: string;
};

export function Typewriter({
  text,
  speed = 50,
  className = "",
  cursorClassName = "bg-teal-500",
}: TypewriterProps) {
  const [display, setDisplay] = useState("");
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (index >= text.length) return;
    const t = setTimeout(() => {
      setDisplay((d) => d + text[index]);
      setIndex((i) => i + 1);
    }, speed);
    return () => clearTimeout(t);
  }, [index, text, speed]);

  return (
    <span className={className}>
      {display}
      <span
        className={`inline-block w-0.5 h-[1em] ml-0.5 align-middle animate-pulse ${cursorClassName}`}
        aria-hidden
      />
    </span>
  );
}
