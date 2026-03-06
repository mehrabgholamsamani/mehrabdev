import React, { useEffect, useRef, useState } from "react";

type TokenType = "kw" | "fn" | "key" | "str" | "punc" | "nl";

interface Token {
  char: string;
  type: TokenType;
}

interface Run {
  text: string;
  type: TokenType;
}

function t(chars: string, type: TokenType): Token[] {
  return chars.split("").map((char) => ({ char, type }));
}

const NL: Token = { char: "\n", type: "nl" };

type Seg = [string, TokenType];

function buildTokens(lines: Seg[][]): Token[] {
  const tokens: Token[] = [];
  for (let i = 0; i < lines.length; i++) {
    for (const [text, type] of lines[i]) {
      tokens.push(...t(text, type));
    }
    if (i < lines.length - 1) tokens.push(NL);
  }
  return tokens;
}

const SNIPPETS: Token[][] = [
  // Snippet 1
  buildTokens([
    [["const", "kw"], [" ", "punc"], ["developer", "fn"], [" = {", "punc"]],
    [["  ", "punc"], ["role", "key"], [": ", "punc"], ['"Full-Stack Developer"', "str"], [",", "punc"]],
    [["  ", "punc"], ["superpowers", "key"], [": [", "punc"]],
    [["    ", "punc"], ['"Real-time systems with WebSockets"', "str"], [",", "punc"]],
    [["    ", "punc"], ['"Making React apps actually fast"', "str"]],
    [["  ],", "punc"]],
    [["  ", "punc"], ["shipped", "key"], [": ", "punc"], ['"10+ production projects"', "str"]],
    [["};", "punc"]],
  ]),

  // Snippet 2
  buildTokens([
    [["const", "kw"], [" ", "punc"], ["developer", "fn"], [" = {", "punc"]],
    [["  ", "punc"], ["mission", "key"], [": ", "punc"], ['"Build fast, scalable web apps"', "str"], [",", "punc"]],
    [["  ", "punc"], ["specialties", "key"], [": [", "punc"]],
    [["    ", "punc"], ['"React + TypeScript architecture"', "str"], [",", "punc"]],
    [["    ", "punc"], ['"Next.js SSR optimization"', "str"]],
    [["  ],", "punc"]],
    [["  ", "punc"], ["achievement", "key"], [": ", "punc"], ['"40% faster page load times"', "str"]],
    [["};", "punc"]],
  ]),

  // Snippet 3
  buildTokens([
    [["const", "kw"], [" ", "punc"], ["developer", "fn"], [" = {", "punc"]],
    [["  ", "punc"], ["role", "key"], [": ", "punc"], ['"Full-Stack Developer"', "str"], [",", "punc"]],
    [["  ", "punc"], ["knownFor", "key"], [": [", "punc"]],
    [["    ", "punc"], ['"Debugging production at 2AM"', "str"], [",", "punc"]],
    [["    ", "punc"], ['"Building full-stack apps solo"', "str"]],
    [["  ],", "punc"]],
    [["  ", "punc"], ["techStack", "key"], [": [", "punc"], ['"React"', "str"], [", ", "punc"], ['"Next.js"', "str"], [", ", "punc"], ['"Node.js"', "str"], ["]", "punc"]],
    [["};", "punc"]],
  ]),
];

function countLines(tokens: Token[]): number {
  return tokens.filter((tok) => tok.type === "nl").length + 1;
}

function buildVisibleLines(tokens: Token[], charIndex: number): Token[][] {
  const numLines = countLines(tokens);
  const lines: Token[][] = Array.from({ length: numLines }, () => []);
  let lineIdx = 0;
  for (let i = 0; i < charIndex && i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "nl") {
      lineIdx = Math.min(lineIdx + 1, numLines - 1);
    } else {
      lines[lineIdx].push(token);
    }
  }
  return lines;
}

function buildRuns(tokens: Token[]): Run[] {
  const runs: Run[] = [];
  for (const tok of tokens) {
    if (tok.type === "nl") continue;
    const last = runs[runs.length - 1];
    if (last && last.type === tok.type) {
      last.text += tok.char;
    } else {
      runs.push({ text: tok.char, type: tok.type });
    }
  }
  return runs;
}

type Phase = "typing" | "pausing" | "deleting";

function useCyclingTypewriter(active: boolean) {
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    if (!active) return;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCharIndex(SNIPPETS[snippetIdx].length);
      setPhase("pausing");
      return;
    }

    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const tokens = SNIPPETS[snippetIdx];

    if (phase === "typing") {
      if (charIndex >= tokens.length) {
        // Fully typed — pause before deleting
        timer = setTimeout(() => {
          if (alive) setPhase("pausing");
        }, 800);
      } else {
        const next = tokens[charIndex];
        const delay = next?.type === "nl" ? 140 : 32 + Math.random() * 22;
        timer = setTimeout(() => {
          if (alive) setCharIndex((i) => i + 1);
        }, delay);
      }
    } else if (phase === "pausing") {
      timer = setTimeout(() => {
        if (alive) setPhase("deleting");
      }, 2200);
    } else if (phase === "deleting") {
      if (charIndex <= 0) {
        // Done deleting — advance to next snippet
        const next = (snippetIdx + 1) % SNIPPETS.length;
        if (alive) {
          setSnippetIdx(next);
          setPhase("typing");
        }
      } else {
        const prev = tokens[charIndex - 1];
        const delay = prev?.type === "nl" ? 50 : 10;
        timer = setTimeout(() => {
          if (alive) setCharIndex((i) => i - 1);
        }, delay);
      }
    }

    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [active, snippetIdx, charIndex, phase]);

  return { tokens: SNIPPETS[snippetIdx], charIndex, phase };
}

export function CodeEditor() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const { tokens, charIndex, phase } = useCyclingTypewriter(active);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const numLines = countLines(tokens);
  const lines = buildVisibleLines(tokens, charIndex);

  let cursorLine = 0;
  for (let i = 0; i < charIndex && i < tokens.length; i++) {
    if (tokens[i].type === "nl") cursorLine++;
  }

  return (
    <section className="code-editor-section" ref={sectionRef}>
      <div className="code-editor-card">
        <div className="code-editor-titlebar" aria-hidden="true">
          <div className="code-editor-traffic">
            <span className="ced-dot ced-red" />
            <span className="ced-dot ced-yellow" />
            <span className="ced-dot ced-green" />
          </div>
          <span className="code-editor-filename">mehrab.js</span>
          <div className="ced-titlebar-filler" />
        </div>
        <div
          className="code-editor-body"
          role="img"
          aria-label="Animated code snippet introducing Mehrab as a Full-Stack Developer"
        >
          <div className="code-editor-lines">
            {Array.from({ length: numLines }, (_, i) => {
              const runs = buildRuns(lines[i]);
              const isCurrentLine = i === cursorLine;

              return (
                <div className="code-line" key={i}>
                  <span className="code-ln" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="code-content">
                    {runs.length === 0 && isCurrentLine ? (
                      <span className="code-cursor" aria-hidden="true" />
                    ) : (
                      runs.map((run, ri) => {
                        const isLastRun = ri === runs.length - 1;
                        return (
                          <span className={`tok-${run.type}`} key={ri}>
                            {run.text}
                            {isCurrentLine && isLastRun && (
                              <span className="code-cursor" aria-hidden="true" />
                            )}
                          </span>
                        );
                      })
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
