
import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathDisplayProps {
  math: string;
  block?: boolean;
}

const MathDisplay: React.FC<MathDisplayProps> = ({ math, block = false }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          throwOnError: false,
          displayMode: block,
        });
      } catch (e) {
        console.error("KaTeX error:", e);
      }
    }
  }, [math, block]);

  return <span ref={containerRef} className={block ? "block my-4 overflow-x-auto" : ""} />;
};

export default MathDisplay;
