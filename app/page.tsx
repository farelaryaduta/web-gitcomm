import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { AetherParticles } from "@/components/aether-particles";
import { SiteJsonLd } from "@/components/json-ld";
import { PackageCommands } from "@/components/package-commands";
import { docPages } from "@/lib/docs";
import { globalCommands, runCommands } from "@/lib/package-managers";
import { siteConfig } from "@/lib/site";

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="commit-rule mb-6">
      <span>
        {index} / {children}
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <SiteJsonLd />
      <section className="relative overflow-hidden border-x border-line">
        <div aria-hidden="true" className="hero-particles">
          <AetherParticles />
        </div>
        <div className="relative border-b border-line px-6 py-20 sm:px-12 sm:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
            npm package · node ≥ 20.12
          </p>

          <h1 className="mt-6 text-[clamp(3.25rem,13vw,9rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-ink">
            gitcomm
            <span className="text-ink-faint">.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl sm:leading-relaxed">
            gitcomm reads your staged diff and your commit history, then suggests
            messages that sound like they came from you. You pick one, and it
            commits for you.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/docs/getting-started"
              className="rounded-sm bg-inverted px-5 py-2.5 text-sm font-medium text-inverted-ink transition-opacity hover:opacity-85"
            >
              Get started
            </Link>
            <Link
              href="/docs/commands"
              className="rounded-sm border border-line-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
            >
              Command reference
            </Link>
          </div>

          <div className="mt-12 max-w-md">
            <PackageCommands variants={runCommands()} />
          </div>
        </div>

        <dl className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ["01", "Reads your history", "Conventional Commits, plain sentences, English or Indonesian, emoji or none. Suggestions match."],
            ["02", "Redacts before sending", "Lockfiles and generated files skipped, diffs truncated, secret patterns stripped."],
            ["03", "Works with no network", "The same rule-based engine answers when the service is down or rate limited."],
          ].map(([index, title, body]) => (
            <div key={index} className="px-6 py-8 sm:px-8">
              <dt className="font-mono text-xs tracking-[0.12em] text-ink-faint">
                {index}
              </dt>
              <dd className="mt-3">
                <p className="font-medium text-ink">{title}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">
                  {body}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-x border-t border-line px-6 py-20 sm:px-12 sm:py-24">
        <SectionLabel index="01">What it does</SectionLabel>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
              Commit messages usually go wrong in one of two ways: too vague to
              read six months later, or too detailed to scan.
            </h2>
            <div className="mt-8 max-w-2xl space-y-4 text-[17px] leading-relaxed text-ink-muted">
              <p>
                gitcomm sends a small, redacted slice of your staged diff
                together with a style summary pulled from your recent commits.
                It classifies each staged file by role first, so it knows a
                controller from a migration, and it can propose a scope without
                being told one.
              </p>
              <p>
                You get a short list. Take the first one, take another, or write
                your own. The commit runs through your own Git, so hooks, config,
                and signing behave exactly as they normally would.
              </p>
            </div>
          </div>

          <div className="lg:border-l lg:border-line lg:pl-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
              Detected style
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
              {[
                "Conventional Commits or plain sentences",
                "English, Indonesian, or mixed",
                "Subject length and capitalisation",
                "Emoji prefixes, if you use them",
                "Scopes inferred from directory names",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1 shrink-0 bg-ink-faint" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-x border-t border-line px-6 py-20 sm:px-12 sm:py-24">
        <SectionLabel index="02">A run, start to finish</SectionLabel>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div className="max-w-2xl space-y-4 text-[17px] leading-relaxed text-ink-muted">
            <p>
              Stage what belongs in the commit, then run gitcomm. It prints what
              it read before it asks anything, so a misread is visible before
              you commit to an answer.
            </p>
            <p>
              Hints come from the diff: a new controller and model in an{" "}
              <code className="font-mono text-[0.9em] text-ink">app/</code>{" "}
              tree reads as <code className="font-mono text-[0.9em] text-ink">feat</code>{" "}
              with a scope. Force either when detection guesses wrong.
            </p>
          </div>
          <div className="lg:border-l lg:border-line lg:pl-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
              Force it yourself
            </p>
            <div className="mt-4">
              <CodeBlock code={"npx gitcomm -t feat -s auth"} lang="bash" />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <CodeBlock
            lang="text"
            caption="npx gitcomm"
            code={[
              "◆  gitcomm",
              "",
              "┌─ repository status ────────────────────────────────┐",
              "│ branch: main                                       │",
              "│ 4 staged file(s)                                   │",
              "│   A  app/Http/Controllers/TaskController.php  ctrl   │",
              "│   A  app/Models/Task.php                      model  │",
              "│   M  routes/web.php                           route  │",
              "│   M  composer.lock                            deps   │",
              "│ hints: type=feat, scope=task                       │",
              "│ style: conventional commits, en, subject <= 72 chars│",
              "└─────────────────────────────────────────────────────┘",
              "",
              "◆ Choose a commit message:",
              "● feat(task): add task controller and model",
              "○ feat(task): implement task CRUD with controller, model, and routing",
              "○ feat(task): scaffold task module with controller and eloquent model",
              "○ Write my own message",
              "○ Cancel",
            ].join("\n")}
          />
        </div>
      </section>

      <section className="border-x border-t border-line px-6 py-20 sm:px-12 sm:py-24">
        <SectionLabel index="03">Install</SectionLabel>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div>
            <PackageCommands
              variants={runCommands()}
              caption="Per command, no install."
            />
            <div className="mt-6">
              <PackageCommands
                variants={globalCommands()}
                caption="Or install once and call gitcomm from anywhere."
              />
            </div>
          </div>
          <div className="space-y-4 text-[15px] leading-relaxed text-ink-muted lg:border-l lg:border-line lg:pl-10">
            <p>Node.js 20.12 or newer. No native modules, no config file.</p>
            <p>
              For a team, pin it as a dev dependency so everyone commits the same
              way.
            </p>
            <CodeBlock code="npm install --save-dev gitcomm" lang="bash" />
          </div>
        </div>
      </section>

      <section className="border-x border-t border-line px-6 py-20 sm:px-12 sm:py-24">
        <SectionLabel index="04">Read next</SectionLabel>
        <ul className="grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {docPages.map((page, index) => (
            <li key={page.slug} className="bg-canvas">
              <Link
                href={`/docs/${page.slug}`}
                className="flex h-full flex-col p-6 transition-colors hover:bg-surface"
              >
                <span className="font-mono text-[11px] tracking-[0.12em] text-ink-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-3 font-medium text-ink">{page.title}</span>
                <span className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                  {page.summary}
                </span>
              </Link>
            </li>
          ))}
          <li
            aria-hidden="true"
            className="read-next-watermark hidden bg-canvas sm:flex"
          >
            gitcomm
          </li>
          <li
            aria-hidden="true"
            className="read-next-watermark read-next-watermark-alt hidden bg-canvas lg:flex"
          >
            gitcomm
          </li>
        </ul>

        <p className="mt-10 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
          Ready to try it?{" "}
          <Link href="/docs/getting-started" className="text-ink underline decoration-line-strong underline-offset-[3px] hover:decoration-ink">
            Start with getting started
          </Link>
          , or read how your code leaves the machine on the{" "}
          <Link href="/docs/safety-and-privacy" className="text-ink underline decoration-line-strong underline-offset-[3px] hover:decoration-ink">
            safety and privacy
          </Link>{" "}
          page first. Prefer reading source? It is on{" "}
          <a
            href={siteConfig.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink underline decoration-line-strong underline-offset-[3px] hover:decoration-ink"
          >
            GitHub
          </a>
          .
        </p>
      </section>

      <section className="border-x border-t border-line px-6 py-16 sm:px-12">
        <h2 className="max-w-3xl text-[clamp(1.75rem,5vw,2.75rem)] font-semibold leading-tight tracking-[-0.02em]">
          Write commit easily with{" "}
          <span className="mark">
            gitcomm
            <span className="mark-caret" aria-hidden="true" />
            <span className="mark-rule" aria-hidden="true" />
          </span>
          <span className="text-ink-faint">.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
          A commit message is the only documentation that is guaranteed to be
          read by the person who needs it, usually urgently.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/docs/getting-started"
            className="rounded-sm bg-inverted px-5 py-2.5 text-sm font-medium text-inverted-ink transition-opacity hover:opacity-85"
          >
            Read the docs
          </Link>
          <a
            href={siteConfig.npm}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-sm border border-line-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
          >
            View on npm
          </a>
        </div>
      </section>
    </div>
  );
}