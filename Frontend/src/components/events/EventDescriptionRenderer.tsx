import React from "react";

interface EventDescriptionRendererProps {
  description?: string | null;
  topHeading?: string | null;
  className?: string;
  mode?: "all" | "first" | "remaining";
}

interface Block {
  type: "h4" | "p" | "ul" | "ol";
  content?: string;
  items?: string[];
}

interface SectionGroup {
  heading?: string;
  blocks: Block[];
}

function renderInlineFormatting(text: string): React.ReactNode[] {
  // Parses inline **bold**, *italic*, and `code`
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-semibold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded text-sm font-mono">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function parseFormattedEventContent(rawText: string): Block[] {
  if (!rawText || !rawText.trim()) return [];
  const lines = rawText.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  let currentParagraph: string[] = [];
  let currentList: string[] = [];
  let isNumberedList = false;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: "p", content: currentParagraph.join(" ").trim() });
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({
        type: isNumberedList ? "ol" : "ul",
        items: [...currentList],
      });
      currentList = [];
      isNumberedList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Markdown Header (# Heading, ## Heading, ### Heading, #### Heading)
    const mdMatch = line.match(/^#{1,6}\s+(.+)$/);
    if (mdMatch) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h4", content: mdMatch[1].trim() });
      continue;
    }

    // Bold standalone line: **Heading**
    const boldMatch = line.match(/^\*\*([^*]+)\*\*$|^__([^_]+)__$/);
    if (boldMatch) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h4", content: (boldMatch[1] || boldMatch[2]).trim() });
      continue;
    }

    // Bullet list items (- Item, * Item, • Item)
    const bulletMatch = line.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      if (isNumberedList) flushList();
      isNumberedList = false;
      currentList.push(bulletMatch[1].trim());
      continue;
    }

    // Numbered list items (1. Item, 2. Item)
    const numMatch = line.match(/^\d+[.)]\s+(.+)$/);
    if (numMatch) {
      flushParagraph();
      if (!isNumberedList && currentList.length > 0) flushList();
      isNumberedList = true;
      currentList.push(numMatch[1].trim());
      continue;
    }

    // Plain text heading heuristic
    const isPunctuationEnding = /[.,;!?]$/.test(line);
    const wordCount = line.split(/\s+/).length;
    const isShort = line.length <= 80 && wordCount <= 12;

    if (isShort && !isPunctuationEnding) {
      const nextLine = lines.slice(i + 1).find((l) => l.trim().length > 0)?.trim();
      const prevLine = i > 0 ? lines[i - 1].trim() : "";

      const isStart = currentParagraph.length === 0 && (!prevLine || i === 0);
      const endsWithColon = line.endsWith(":");
      const nextIsBody =
        nextLine &&
        (nextLine.length > 70 ||
          nextLine.split(/\s+/).length > 10 ||
          /[.,;!?]$/.test(nextLine) ||
          /^[-*•\d]/.test(nextLine));

      if ((isStart && (nextIsBody || !prevLine || !nextLine)) || endsWithColon) {
        flushParagraph();
        flushList();
        blocks.push({ type: "h4", content: line.replace(/:$/, "").trim() });
        continue;
      }
    }

    // Regular line
    flushList();
    currentParagraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

function groupBlocksIntoSections(blocks: Block[], topHeading?: string | null): SectionGroup[] {
  const sections: SectionGroup[] = [];
  let current: SectionGroup | null = null;

  for (const block of blocks) {
    if (block.type === "h4") {
      if (current) {
        sections.push(current);
      }
      current = { heading: block.content, blocks: [] };
    } else {
      if (!current) {
        current = { heading: topHeading || undefined, blocks: [] };
      }
      current.blocks.push(block);
    }
  }

  if (current) {
    sections.push(current);
  }

  // If topHeading was supplied and first section has no heading, apply topHeading
  if (topHeading && sections.length > 0 && !sections[0].heading) {
    sections[0].heading = topHeading;
  }

  return sections;
}

export default function EventDescriptionRenderer({
  description,
  topHeading,
  className = "",
  mode = "all",
}: EventDescriptionRendererProps) {
  if (!description && !topHeading) return null;

  const rawBlocks = parseFormattedEventContent(description || "");
  const allSections = groupBlocksIntoSections(rawBlocks, topHeading);

  let targetSections: SectionGroup[] = [];
  if (mode === "first") {
    targetSections = allSections.slice(0, 1);
  } else if (mode === "remaining") {
    targetSections = allSections.slice(1);
  } else {
    targetSections = allSections;
  }

  if (targetSections.length === 0) return null;

  return (
    <div className={`space-y-8 text-justify ${className}`}>
      {targetSections.map((sec, secIdx) => (
        <div key={secIdx} className="space-y-3">
          {sec.heading && (
            <h4 className="text-lg md:text-xl font-semibold text-slate-700 leading-snug tracking-normal mb-2.5">
              {sec.heading}
            </h4>
          )}

          {sec.blocks.map((block, blockIdx) => {
            if (block.type === "p" && block.content) {
              return (
                <p
                  key={blockIdx}
                  className="text-base md:text-lg text-slate-600 leading-relaxed font-normal mb-3 last:mb-0"
                >
                  {renderInlineFormatting(block.content)}
                </p>
              );
            }

            if (block.type === "ul" && block.items && block.items.length > 0) {
              return (
                <ul
                  key={blockIdx}
                  className="list-disc pl-6 space-y-1.5 mb-3 text-slate-600 text-base md:text-lg"
                >
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="leading-relaxed">
                      {renderInlineFormatting(item)}
                    </li>
                  ))}
                </ul>
              );
            }

            if (block.type === "ol" && block.items && block.items.length > 0) {
              return (
                <ol
                  key={blockIdx}
                  className="list-decimal pl-6 space-y-1.5 mb-3 text-slate-600 text-base md:text-lg"
                >
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="leading-relaxed">
                      {renderInlineFormatting(item)}
                    </li>
                  ))}
                </ol>
              );
            }

            return null;
          })}
        </div>
      ))}
    </div>
  );
}
