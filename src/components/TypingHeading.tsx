import React, { useState, useEffect } from 'react';

interface TypingHeadingProps {
  prefix?: string;
  name?: string;
  durationMs?: number;
}

export const TypingHeading: React.FC<TypingHeadingProps> = ({
  prefix = "Hi, I'm ",
  name = "Shishir Pokhrel",
  durationMs = 1000,
}) => {
  const fullText = `${prefix}${name}`;
  const [displayedCount, setDisplayedCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    // Total duration is exactly durationMs (1000ms = 1 second)
    const totalChars = fullText.length;
    const intervalTime = Math.max(20, Math.floor(durationMs / totalChars));

    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      if (current <= totalChars) {
        setDisplayedCount(current);
      } else {
        clearInterval(timer);
        setIsFinished(true);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [fullText, durationMs]);

  // Determine what part of prefix and name are typed
  const prefixLength = prefix.length;
  const typedPrefix = fullText.slice(0, Math.min(displayedCount, prefixLength));
  const typedName = displayedCount > prefixLength ? fullText.slice(prefixLength, displayedCount) : '';

  return (
    <h1
      id="hero-typing-name-heading"
      className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-blue-950 inline-flex flex-wrap items-center justify-center gap-x-2"
    >
      {/* Prefix: "Hi, I'm " */}
      <span>{typedPrefix}</span>

      {/* Highlighted Name: "Shishir Pokhrel" */}
      {typedName.length > 0 && (
        <span
          id="highlighted-user-name"
          className="relative inline-block px-3 py-0.5 rounded-2xl bg-amber-300 text-blue-950 border-b-4 border-amber-400 shadow-sm transition-all"
        >
          {typedName}
        </span>
      )}

      {/* Typing cursor that blinks and fades after finishing */}
      {!isFinished && (
        <span
          className="inline-block w-1 h-9 sm:h-12 bg-blue-700 ml-1 animate-pulse align-middle rounded-full"
          aria-hidden="true"
        />
      )}
    </h1>
  );
};
