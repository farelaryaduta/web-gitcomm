import { Fragment, type ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { PackageCommands } from "@/components/package-commands";
import type { Block } from "@/lib/docs";

const INLINE = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;

export function renderInline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      const isExternal = href.startsWith("http");
      return (
        <a
          key={index}
          href={href}
          {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        >
          {label}
        </a>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function DocContent({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-docs">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "h2":
            return (
              <h2 key={index} id={block.id}>
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} id={block.id}>
                {block.text}
              </h3>
            );
          case "p":
            return <p key={index}>{renderInline(block.text)}</p>;
          case "code":
            return (
              <CodeBlock
                key={index}
                code={block.code}
                lang={block.lang}
                caption={block.caption}
              />
            );
          case "pm":
            return (
              <PackageCommands
                key={index}
                variants={block.variants}
                caption={block.caption}
                note={block.note}
              />
            );
          case "list": {
            const items = block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInline(item)}</li>
            ));
            return block.ordered ? (
              <ol key={index}>{items}</ol>
            ) : (
              <ul key={index}>{items}</ul>
            );
          }
          case "table":
            return (
              <div key={index} className="overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-[15px]">
                  <thead>
                    <tr className="border-b border-line-strong">
                      {block.head.map((cell, cellIndex) => (
                        <th
                          key={cellIndex}
                          scope="col"
                          className={`py-2.5 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint ${
                            block.align?.[cellIndex] === "right" ? "text-right" : "text-left"
                          }`}
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-line">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`py-3 pr-4 align-top ${
                              block.align?.[cellIndex] === "right"
                                ? "text-right"
                                : "text-left"
                            }`}
                          >
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "note":
            return (
              <aside
                key={index}
                className="rounded border border-line bg-surface px-4 py-3.5"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                  {block.title}
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed">
                  {renderInline(block.text)}
                </p>
              </aside>
            );
          case "divider":
            return (
              <div key={index} className="commit-rule">
                <span>{block.label}</span>
              </div>
            );
        }
      })}
    </div>
  );
}