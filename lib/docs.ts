import {
  devCommands,
  globalCommands,
  latestCommands,
  runCommands,
  type PackageCommand,
} from "@/lib/package-managers";

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; id: string; text: string }
  | { kind: "h3"; id: string; text: string }
  | { kind: "code"; code: string; lang?: string; caption?: string }
  | { kind: "pm"; variants: PackageCommand[]; caption?: string; note?: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | { kind: "table"; head: string[]; rows: string[][]; align?: ("left" | "right")[] }
  | { kind: "note"; tone: "info" | "warn"; title: string; text: string }
  | { kind: "divider"; label: string };

export type DocPage = {
  slug: string;
  title: string;
  summary: string;
  blocks: Block[];
};

export type DocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

const gettingStarted: DocPage = {
  slug: "getting-started",
  title: "Getting Started",
  summary:
    "What gitcomm does, what it needs from you, and how a single command turns a staged diff into a committed change.",
  blocks: [
    {
      kind: "p",
      text: "gitcomm reads your staged changes, learns how your repository writes commit messages, and proposes a few that sound like they came from you. Pick one, edit it, or write your own. gitcomm runs `git commit` for you.",
    },
    {
      kind: "code",
      lang: "bash",
      code: "npx gitcomm",
      caption: "The whole tool. Run it inside any Git repository.",
    },
    {
      kind: "p",
      text: "There is no config file to write and no account to create. The first run reads whatever history already exists in the repository and works from there.",
    },

    { kind: "h2", id: "how-it-works", text: "How it works" },
    {
      kind: "p",
      text: "Four steps happen between your staged files and a commit on disk.",
    },
    {
      kind: "list",
      ordered: true,
      items: [
        "Reads the staged diff and classifies each file by role. Built-in presets cover Laravel and Next.js; everything else falls back to naming and path rules.",
        "Reads your recent commit history to work out the style: Conventional Commits or plain sentences, English or Indonesian, short or verbose subjects, emoji or none.",
        "Sends a small, redacted slice of the diff to the suggestion service and gets back several candidate messages in your detected style.",
        "Shows you the candidates. Your pick runs through `git commit`, optionally followed by `git push`.",
      ],
    },
    {
      kind: "note",
      tone: "info",
      title: "Your secrets stay out of it",
      text: "Before anything is sent, diffs are truncated and filtered. Lockfiles and generated files are skipped, and content that matches common secret patterns is stripped. `--echo` prints the exact prompt and exits without contacting the service.",
    },

    { kind: "h2", id: "requirements", text: "Requirements" },
    {
      kind: "table",
      head: ["Requirement", "Version"],
      align: ["left", "right"],
      rows: [
        ["Node.js", "20.12.0 or newer"],
        ["Git", "Any recent version"],
        ["Repository", "Must be a Git repo with at least one commit"],
      ],
    },
    {
      kind: "p",
      text: "Run it per-command, or add it to a project or your machine globally. Pick your package manager and the command fills itself in. Either way the binary is called `gitcomm`.",
    },

    { kind: "h2", id: "first-run", text: "Your first run" },
    {
      kind: "p",
      text: "Stage something and run the command:",
    },
    {
      kind: "code",
      lang: "bash",
      code: [
        "git add src/auth/login.ts src/auth/session.ts",
        "npx gitcomm",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "gitcomm prints what it found before it asks anything, so you can see whether it read your repo correctly:",
    },
    {
      kind: "code",
      lang: "text",
      code: [
        "◆  gitcomm",
        "",
        "┌─ repository status ────────────────────────────────┐",
        "│ branch: main                                       │",
        "│ 2 staged file(s)                                   │",
        "│   A  src/auth/login.ts                        auth  +80 -0       │",
        "│   A  src/auth/session.ts                      auth  +20 -0       │",
        "│ working tree: 2 staged, 0 modified, 0 untracked    │",
        "│ hints: type=feat, scope=auth                       │",
        "│ style: conventional commits, en, subject <= 72 chars│",
        "└─────────────────────────────────────────────────────┘",
        "",
        "◆ Choose a commit message:",
        "● feat(auth): add login and session modules",
        "○ feat(auth): scaffold auth module with login and session",
        "○ Write my own message",
        "○ Cancel",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "Arrow keys move the selection, Enter confirms. Choosing **Write my own message** opens your editor so you can type the subject yourself, and **Cancel** exits without touching the repository.",
    },

    { kind: "h2", id: "next-steps", text: "Next steps" },
    {
      kind: "list",
      items: [
        "[Installation](/docs/installation) — install it globally or keep it per-project.",
        "[Usage](/docs/usage) — the full commit flow, including staging and pushing.",
        "[Commands](/docs/commands) — every flag, grouped by what it affects.",
      ],
    },
  ],
};

const installation: DocPage = {
  slug: "installation",
  title: "Installation",
  summary:
    "Install gitcomm for a single run, globally, or as a project dependency. Node 20.12 or newer is required.",
  blocks: [
    {
      kind: "p",
      text: "gitcomm ships as a single executable with no native modules, so installation is a single command on any platform Node runs on.",
    },

    { kind: "h2", id: "requirements", text: "Requirements" },
    {
      kind: "list",
      items: [
        "Node.js 20.12.0 or newer. Check with `node --version`.",
        "Git on your `PATH`, which it is on any normal development machine.",
        "A Git repository with at least one commit. Style detection reads your history, so an empty repository gives gitcomm nothing to learn from.",
      ],
    },

    { kind: "h2", id: "one-off-run", text: "One-off run" },
    {
      kind: "p",
      text: "Nothing to install. Your package manager downloads the package, runs it, and cleans up:",
    },
    {
      kind: "pm",
      variants: runCommands(),
    },
    {
      kind: "p",
      text: "The package is cached after the first run, so later invocations start immediately. This is the recommended way to try gitcomm.",
    },

    { kind: "h2", id: "global", text: "Globally" },
    {
      kind: "p",
      text: "Install once and call `gitcomm` from any repository:",
    },
    {
      kind: "pm",
      variants: globalCommands(),
    },
    {
      kind: "note",
      tone: "warn",
      title: "A second binary",
      text: "The package also installs a `ci` binary as a shorthand. `ci` is a common alias for continuous integration, so prefer `gitcomm` in scripts where that name could collide.",
    },

    { kind: "h2", id: "per-project", text: "As a project dependency" },
    {
      kind: "p",
      text: "Pin the version for a team so everyone generates messages the same way:",
    },
    {
      kind: "pm",
      variants: devCommands(),
    },
    {
      kind: "p",
      text: "Then run it through your package manager:",
    },
    {
      kind: "pm",
      variants: runCommands(),
    },

    { kind: "h2", id: "updating", text: "Updating" },
    {
      kind: "p",
      text: "Check which version you have:",
    },
    {
      kind: "pm",
      variants: runCommands("gitcomm", " --version"),
    },
    {
      kind: "p",
      text: "For a global install, update with your package manager:",
    },
    {
      kind: "pm",
      variants: latestCommands(),
    },
    {
      kind: "note",
      tone: "info",
      title: "Cached versions",
      text: "After a new release, a one-off run may still resolve to a cached copy. Pin the version, for example `npx gitcomm@latest`, to force a fresh download.",
    },
  ],
};

const usage: DocPage = {
  slug: "usage",
  title: "Usage",
  summary:
    "The commit flow end to end: choosing what to stage, reviewing suggestions, adding a body, and pushing.",
  blocks: [
    {
      kind: "p",
      text: "Every run follows the same path. Stage changes, run gitcomm, choose a message, and decide whether to push.",
    },

    { kind: "h2", id: "basic-workflow", text: "Basic workflow" },
    {
      kind: "p",
      text: "gitcomm only looks at staged changes by default, so decide what belongs in this commit before you run it:",
    },
    {
      kind: "code",
      lang: "bash",
      code: [
        "git status",
        "git add src/auth/login.ts",
        "git add -p src/routes/web.ts",
        "npx gitcomm",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "When the commit lands, review the result as usual:",
    },
    {
      kind: "code",
      lang: "bash",
      code: "git show --stat",
    },

    { kind: "h2", id: "staging", text: "Choosing what to stage" },
    {
      kind: "p",
      text: "Two flags change what goes into the diff gitcomm reads.",
    },
    {
      kind: "code",
      lang: "bash",
      code: [
        "# Stage every tracked change first (git add -u)",
        "npx gitcomm --all",
        "",
        "# Never auto-stage; use only what is already staged",
        "npx gitcomm --stageddonly",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "`--all` uses `git add -u`, which stages modifications and deletions to files Git already tracks. It does not add untracked files. Use `--stageddonly` in scripts and hooks where an unexpected `git add` would be a surprise.",
    },

    { kind: "h2", id: "reviewing-suggestions", text: "Reviewing suggestions" },
    {
      kind: "p",
      text: "gitcomm asks for three candidates by default and lists them in the order it ranks them. The first is the one it would pick. Request more with `--count`:",
    },
    {
      kind: "code",
      lang: "bash",
      code: [
        "npx gitcomm --count 5",
        "npx gitcomm --count 1",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "The accepted range is 1 to 5. Outside that, gitcomm falls back to the default of three.",
    },
    {
      kind: "p",
      text: "Two options in the list are always there: **Write my own message**, which opens your editor with the selected subject pre-filled, and **Cancel**, which exits without committing.",
    },

    { kind: "h2", id: "commit-and-push", text: "Commit and push in one go" },
    {
      kind: "p",
      text: "`--push` runs `git push` after a commit succeeds:",
    },
    {
      kind: "code",
      lang: "bash",
      code: "npx gitcomm --push",
    },
    {
      kind: "p",
      text: "For a branch you are done with, `--commit` skips the final confirmation and `--yes` skips the prompt entirely, taking the top suggestion:",
    },
    {
      kind: "code",
      lang: "bash",
      code: "npx gitcomm -a -y -c --push",
    },
    {
      kind: "p",
      text: "That one line stages tracked changes, takes the first suggestion, commits, and pushes. It is the shortest path from a dirty working tree to a pushed branch.",
    },

    { kind: "h2", id: "dry-runs", text: "Dry runs and scripts" },
    {
      kind: "p",
      text: "To see the message without writing a commit:",
    },
    {
      kind: "code",
      lang: "bash",
      code: "npx gitcomm --dry-run",
    },
    {
      kind: "p",
      text: "To pipe subjects somewhere without any prompts at all:",
    },
    {
      kind: "code",
      lang: "bash",
      code: "npx gitcomm --print",
    },
    {
      kind: "p",
      text: "`--print` writes candidate subjects to stdout and exits, which makes it easy to feed a changelog generator or a ticket template.",
    },

    { kind: "h2", id: "forcing-a-style", text: "Forcing a type and scope" },
    {
      kind: "p",
      text: "Detected hints are a starting point. Override them when you already know what the commit is:",
    },
    {
      kind: "code",
      lang: "bash",
      code: [
        "npx gitcomm -t fix",
        "npx gitcomm -t feat -s auth",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "If your repository does not use Conventional Commits and you want messages in that format anyway, add `--force-conventional`:",
    },
    {
      kind: "code",
      lang: "bash",
      code: "npx gitcomm --force-conventional",
    },

    { kind: "h2", id: "language", text: "Choosing a language" },
    {
      kind: "p",
      text: "gitcomm follows the language your history is written in. Force it when detection guesses wrong:",
    },
    {
      kind: "code",
      lang: "bash",
      code: [
        "npx gitcomm --language en",
        "npx gitcomm --language id",
        "npx gitcomm --language auto",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "`auto` is the default and reads the language from your commit subjects.",
    },

    { kind: "h2", id: "offline", text: "Working offline" },
    {
      kind: "p",
      text: "Rule-based suggestions need no network and no API key:",
    },
    {
      kind: "code",
      lang: "bash",
      code: "npx gitcomm --offline",
    },
    {
      kind: "p",
      text: "The same engine runs on its own if the service is unreachable or rate limited, so you always get something to pick from. Offline suggestions still follow your repository's style and name the affected unit, but they cannot read file contents, so they read as more generic than the ones the service returns.",
    },

    { kind: "h2", id: "hooks", text: "Git hooks" },
    {
      kind: "p",
      text: "To skip pre-commit and commit-msg hooks for one commit:",
    },
    {
      kind: "code",
      lang: "bash",
      code: "npx gitcomm --no-verify",
    },
  ],
};

const commands: DocPage = {
  slug: "commands",
  title: "Commands",
  summary:
    "Every flag gitcomm accepts, grouped by staging, committing, suggestions, language, debugging, and general options.",
  blocks: [
    {
      kind: "p",
      text: "Run `npx gitcomm --help` for the same list on your machine.",
    },

    { kind: "h2", id: "staging", text: "Staging" },
    {
      kind: "table",
      head: ["Flag", "Description"],
      rows: [
        ["`-a`, `--all`", "Stage all tracked working-tree changes first (`git add -u`) before suggesting."],
        ["`--stageddonly`", "Use only what is already staged. Never auto-stage anything."],
      ],
    },

    { kind: "h2", id: "committing", text: "Committing" },
    {
      kind: "table",
      head: ["Flag", "Description"],
      rows: [
        ["`-c`, `--commit`", "Skip the final confirmation and run `git commit`."],
        ["`-n`, `--dry-run`", "Print the chosen message without committing."],
        ["`-p`, `--print`", "Print suggestion subjects to stdout and exit. No prompts."],
        ["`--push`", "Run `git push` after a successful commit."],
        ["`--no-verify`", "Pass `--no-verify` to `git commit`, skipping git hooks."],
      ],
    },

    { kind: "h2", id: "suggestions", text: "Suggestions" },
    {
      kind: "table",
      head: ["Flag", "Description"],
      rows: [
        ["`-y`, `--yes`", "Skip all prompts and take the first suggestion."],
        ["`--count <n>`", "How many suggestions to request. 1 to 5, default 3."],
        ["`-t`, `--type <type>`", "Force a commit type. One of `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `ci`, `style`, `perf`, `build`."],
        ["`-s`, `--scope <scope>`", "Force a scope, such as `auth`, `api`, or `ui`."],
        ["`--body`", "Prompt for an optional commit body after you pick a subject."],
        ["`--force-conventional`", "Force Conventional Commits style even when your history does not use it."],
        ["`--offline`", "Skip the service and use rule-based suggestions."],
      ],
    },

    { kind: "h2", id: "language", text: "Language" },
    {
      kind: "table",
      head: ["Flag", "Description"],
      rows: [
        ["`--language <lang>`", "Force suggestion language. `auto` (default), `en`, or `id`."],
      ],
    },

    { kind: "h2", id: "debugging", text: "Debugging" },
    {
      kind: "table",
      head: ["Flag", "Description"],
      rows: [
        ["`-e`, `--echo`", "Print the prompt gitcomm would send, then exit. Nothing is transmitted."],
        ["`--show-prompt`", "Alias for `--echo`."],
        ["`--full`", "With `--echo`, include the full untruncated diff."],
        ["`--verbose`", "Print diagnostics: which provider ran and how long it took."],
        ["`--api-url <url>`", "Override the configured service URL for this run."],
      ],
    },

    { kind: "h2", id: "general", text: "General" },
    {
      kind: "table",
      head: ["Flag", "Description"],
      rows: [
        ["`-v`, `--version`", "Print the version number."],
        ["`-h`, `--help`", "Show help."],
      ],
    },

    { kind: "h2", id: "recipes", text: "Recipes" },
    {
      kind: "code",
      lang: "bash",
      code: [
        "# Quick commit: stage, take the first suggestion, commit, push",
        "npx gitcomm -a -y -c --push",
        "",
        "# See what would be sent, without sending it",
        "npx gitcomm --echo",
        "",
        "# No network, rule-based suggestions",
        "npx gitcomm --offline",
        "",
        "# Force a type and scope",
        "npx gitcomm -t feat -s auth",
        "",
        "# Five suggestions instead of three",
        "npx gitcomm --count 5",
        "",
        "# Subjects only, for a script",
        "npx gitcomm --print",
      ].join("\n"),
    },
  ],
};

const commitAnatomy: DocPage = {
  slug: "commit-anatomy",
  title: "Commit Anatomy",
  summary:
    "The parts of a commit message, what belongs in each one, and the rules that make a subject readable six months later.",
  blocks: [
    {
      kind: "p",
      text: "A commit message has three parts. Most people only ever write the first one, and that is where most commit history becomes unreadable.",
    },
    {
      kind: "code",
      lang: "text",
      code: [
        "feat(auth): add two-factor authentication",
        "",
        "Rate-limited the verification endpoint to five attempts per",
        "minute per device. Failed attempts now return the same response",
        "as an unknown code, so an attacker cannot enumerate registered",
        "devices.",
        "",
        "Closes #482",
        "Refs: SEC-1193",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "The first line is the **subject**. The gap-separated paragraphs after it are the **body**. The `Key: value` pairs at the end are **footers**. Everything is optional except the subject.",
    },

    { kind: "h2", id: "subject", text: "The subject line" },
    {
      kind: "p",
      text: "The subject is the only part most tools show. It is the line you see in `git log --oneline`, in a blame annotation, and in a GitHub or GitLab list. Treat it as the entire message and make it readable on its own.",
    },
    {
      kind: "list",
      ordered: true,
      items: [
        "Start with a capital letter when the history does. gitcomm detects this and matches it.",
        "Use the imperative mood, as in `add` or `fix`, not `added` or `fixes`. The subject describes what the commit does, so the present tense reads correctly in a log.",
        "Leave out the trailing period. Nothing else in the message has one.",
        "Keep it under 72 characters so it never wraps in a terminal.",
        "Say what changed, not that something changed. `fix null token in refresh` beats `fix bug`.",
      ],
    },
    {
      kind: "code",
      lang: "text",
      code: [
        "fix(cart): resolve quantity not updating on click",
        "",
        "fix cart bug",
        "Fixed the cart.",
        "update",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "Only the first line survives. The rest of that list is what you are looking at when someone greps a log six months from now.",
    },

    { kind: "h2", id: "body", text: "The body" },
    {
      kind: "p",
      text: "The body exists to answer the question the subject raises. It is wrapped at about 72 columns and separated from the subject by one blank line.",
    },
    {
      kind: "code",
      lang: "text",
      code: [
        "fix(cart): resolve quantity not updating on click",
        "",
        "The click handler read quantity from the stale cart snapshot that",
        "the reducer keeps for optimistic rendering. Read from the live",
        "cart instead, which is already committed before the render pass",
        "runs.",
        "",
        "Fixes #1197",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "Write the body when the reason is not obvious from the subject. A rename with no logic change needs nothing; a one-character fix that changes behaviour for every request deserves a paragraph.",
    },
    {
      kind: "note",
      tone: "info",
      title: "gitcomm writes it for you",
      text: "Pass `--body` and gitcomm prompts for a body after you pick a subject. Without it you get subjects only, which is the right default for most commits.",
    },

    { kind: "h2", id: "footers", text: "Footers and trailers" },
    {
      kind: "p",
      text: "A footer is a `Token: value` line in the last paragraph. These are not prose; they are parsed by Git, GitHub, and GitLab, so the token has to match exactly.",
    },
    {
      kind: "table",
      head: ["Token", "Effect"],
      rows: [
        ["`Closes #123`", "Closes the issue when the commit lands on the default branch."],
        ["`Fixes #123`, `Resolves #123`", "Same thing, shorter or longer spellings both work."],
        ["`Refs #123`", "Links the issue without closing it."],
        ["`BREAKING CHANGE: ...`", "Marks a major change. Needs its own paragraph, not a subject footer."],
        ["`Co-authored-by: Name <email>`", "Adds a co-author to the commit. Must be the last footer."],
        ["`Signed-off-by: Name <email>`", "Adds a sign-off trailer, used by `git commit -s` and some DCO workflows."],
      ],
    },
    {
      kind: "code",
      lang: "text",
      code: [
        "feat(api): add cursor pagination to /users",
        "",
        "Offsets become slow past a few thousand rows. Switching to a",
        "keyset cursor keeps page cost flat as the table grows.",
        "",
        "Closes #301",
        "BREAKING CHANGE: ?limit now takes a cursor instead of an offset.",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "There is no need to type these by hand. Many editors and GitHub's web UI insert them for you when you reference an issue.",
    },

    { kind: "h2", id: "conventional", text: "The conventional form" },
    {
      kind: "p",
      text: "Conventional Commits adds a fixed structure to the subject: a type, an optional scope, and a description.",
    },
    {
      kind: "code",
      lang: "text",
      code: [
        "feat(auth): add two-factor authentication",
        "│    │       │",
        "│    │       └─ description: what changed, imperative, no period",
        "│    └───────── scope: the area of the project affected, optional",
        "└────────────── type: the category of change",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "The scope comes from the files in the diff. When gitcomm sees an `auth` directory it offers `auth` as the scope without being told. The [ten types](/docs/commit-types) are listed separately, with an example of each.",
    },
    {
      kind: "p",
      text: "The format is not mandatory. gitcomm reads your existing history and matches whichever style it finds, so a repository of plain sentences keeps getting plain sentences. Force the other direction with `--force-conventional`.",
    },

    { kind: "h2", id: "reading-history", text: "Reading your own history" },
    {
      kind: "p",
      text: "Before writing a new message, look at what is already there. This is the fastest way to match your own conventions.",
    },
    {
      kind: "code",
      lang: "bash",
      code: [
        "# What the last twenty subjects look like",
        "git log --oneline -20",
        "",
        "# How many commits per file, which hints at your scopes",
        "git log --name-only --pretty=format: -20 | sort | uniq -c | sort -rn",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "If the subjects are inconsistent, that is usually a sign nobody agreed on a convention. Adopting Conventional Commits in a repository that has none of it is a larger decision than a tool change, and `--force-conventional` is a reasonable first step while you decide.",
    },
  ],
};

const commitTypes: DocPage = {
  slug: "commit-types",
  title: "Commit Types",
  summary:
    "The ten Conventional Commit types gitcomm can emit, when each one applies, and an example of each.",
  blocks: [
    {
      kind: "p",
      text: "When your history already follows [Conventional Commits](https://www.conventionalcommits.org/), gitcomm reads that and matches it. The types below are the ones it can produce.",
    },
    {
      kind: "table",
      head: ["Type", "Use it for", "Example"],
      rows: [
        ["`feat`", "A new capability the user can see", "`feat(auth): add Google OAuth login`"],
        ["`fix`", "A bug fix", "`fix(cart): resolve quantity not updating on click`"],
        ["`refactor`", "Restructuring with no behaviour change", "`refactor(api): extract validation into middleware`"],
        ["`docs`", "Documentation only", "`docs: update API endpoint examples in README`"],
        ["`test`", "Adding or changing tests", "`test(auth): add unit tests for login flow`"],
        ["`chore`", "Maintenance, dependencies, tooling", "`chore(deps): update axios to v1.7`"],
        ["`ci`", "Pipeline changes such as GitHub Actions", "`ci: add Node 22 to test matrix`"],
        ["`style`", "Formatting with no logic change", "`style: apply prettier formatting to utils/`"],
        ["`perf`", "A measurable speed or memory gain", "`perf(query): add database index for user lookup`"],
        ["`build`", "Build system or external dependencies", "`build: switch bundler from webpack to vite`"],
      ],
    },

    { kind: "h2", id: "anatomy", text: "Anatomy of a conventional commit" },
    {
      kind: "code",
      lang: "text",
      code: [
        "feat(auth): add two-factor authentication",
        "│    │       │",
        "│    │       └─ subject: what changed, lowercase, no trailing period",
        "│    └───────── scope (optional): the area of the project affected",
        "└────────────── type: the category of change",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "The scope is optional and comes from the files in your diff. When gitcomm recognises an `auth` directory it will offer `auth` as the scope without being told.",
    },

    { kind: "h2", id: "detection", text: "How the style is detected" },
    {
      kind: "p",
      text: "gitcomm reads your recent commit subjects and checks whether they follow the pattern. If most of them do, suggestions follow it. If your history is plain sentences, suggestions are plain sentences.",
    },
    {
      kind: "p",
      text: "Detection also picks up subject length, capitalisation, trailing punctuation, and emoji use, so a repository that writes short lowercase subjects keeps getting them.",
    },
    {
      kind: "p",
      text: "To override detection in either direction:",
    },
    {
      kind: "code",
      lang: "bash",
      code: [
        "# Force Conventional Commits even in a plain-history repo",
        "npx gitcomm --force-conventional",
        "",
        "# Force a specific type and scope",
        "npx gitcomm -t fix -s cart",
      ].join("\n"),
    },
  ],
};

const safety: DocPage = {
  slug: "safety-and-privacy",
  title: "Safety & Privacy",
  summary:
    "What gitcomm sends to the suggestion service, what it strips first, and how to keep everything local.",
  blocks: [
    {
      kind: "p",
      text: "gitcomm sends code to a service to produce suggestions, so it is worth knowing exactly what leaves your machine.",
    },

    { kind: "h2", id: "what-is-sent", text: "What is sent" },
    {
      kind: "p",
      text: "A truncated, redacted slice of your staged diff. Lockfiles and generated files are excluded, file contents are cut to a length budget, and content matching common secret patterns is removed before the request is built.",
    },
    {
      kind: "p",
      text: "gitcomm also sends the style summary it derived from your history, since that is what shapes the suggestions.",
    },

    { kind: "h2", id: "inspect-the-prompt", text: "Inspect the prompt" },
    {
      kind: "p",
      text: "Before trusting a service with your diff, read what it gets. `--echo` prints the prompt and exits without contacting anything:",
    },
    {
      kind: "code",
      lang: "bash",
      code: [
        "npx gitcomm --echo",
        "npx gitcomm --echo --full",
      ].join("\n"),
    },
    {
      kind: "p",
      text: "`--full` includes the whole diff instead of the truncated version, which is what you want when you are checking whether anything sensitive survived redaction.",
    },

    { kind: "h2", id: "stay-local", text: "Keep it local" },
    {
      kind: "p",
      text: "`--offline` skips the service entirely and uses the rule-based engine:",
    },
    {
      kind: "code",
      lang: "bash",
      code: "npx gitcomm --offline",
    },
    {
      kind: "p",
      text: "Suggestions are derived from file paths, roles, and your commit style. They name the unit that changed, such as `feat(task): add task controller`, but they cannot read inside the files, so they are more generic than service-generated ones.",
    },

    { kind: "h2", id: "self-hosting", text: "Running your own service" },
    {
      kind: "p",
      text: "The service URL is configurable, so you can point gitcomm at your own deployment:",
    },
    {
      kind: "code",
      lang: "bash",
      code: "npx gitcomm --api-url https://gitcomm.internal.example",
    },
    {
      kind: "p",
      text: "`--verbose` reports which provider served a request and how long it took, which is the quickest way to confirm your override took effect.",
    },
  ],
};

export const docPages: DocPage[] = [
  gettingStarted,
  commitAnatomy,
  installation,
  usage,
  commands,
  commitTypes,
  safety,
];

export const docSections = [
  { label: "Getting started", pages: [gettingStarted, commitAnatomy] },
  { label: "Using gitcomm", pages: [usage, commitTypes, safety] },
  { label: "Reference", pages: [installation, commands] },
];

export function getDocPage(slug: string): DocPage | undefined {
  return docPages.find((page) => page.slug === slug);
}

export function getHeadings(page: DocPage): DocHeading[] {
  const headings: DocHeading[] = [];
  for (const block of page.blocks) {
    if (block.kind === "h2") {
      headings.push({ id: block.id, text: block.text, level: 2 });
    } else if (block.kind === "h3") {
      headings.push({ id: block.id, text: block.text, level: 3 });
    }
  }
  return headings;
}