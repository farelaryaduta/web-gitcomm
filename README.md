# gitcomm

> Reads your staged diff and your commit history, then suggests messages that
> sound like they came from you.

A commit message is the only documentation guaranteed to be read by the person
who needs it, usually urgently. `gitcomm` learns how your repository already
writes commits and proposes a few that match, so you stop writing `update` and
start writing something the next person can actually read.

## Install

Run it without installing anything:

```bash
npx gitcomm
```

Or install it once and call it from any repository:

```bash
npm install -g gitcomm
```

Works with `pnpm`, `yarn`, and `bun` too. Node 20.12 or newer.

## Use

```bash
git add src/auth/login.ts
npx gitcomm
```

`gitcomm` prints what it found before it asks anything, so you can see whether
it read your repo correctly:

```
◆  gitcomm

┌─ repository status ────────────────────────────────┐
│ branch: main                                       │
│ 2 staged file(s)                                   │
│   A  src/auth/login.ts                        auth  +80 -0
│   A  src/auth/session.ts                      auth  +20 -0
│ working tree: 2 staged, 0 modified, 0 untracked    │
│ hints: type=feat, scope=auth                       │
│ style: conventional commits, en, subject <= 72 chars│
└─────────────────────────────────────────────────────┘

◆ Choose a commit message:
● feat(auth): add login and session modules
○ feat(auth): scaffold auth module with login and session
○ Write my own message
○ Cancel
```

Take one, edit it, or write your own. The commit runs through your own Git, so
hooks, config, and signing behave exactly as they normally would.

## How it works

1. Reads the staged diff and classifies each file by role. Built-in presets
   cover Laravel and Next.js; everything else falls back to naming and path
   rules.
2. Reads your recent commit history to work out your style: Conventional
   Commits or plain sentences, English or Indonesian, short or verbose,
   emoji or none.
3. Sends a small, redacted slice of the diff to the suggestion service.
4. Shows you the candidates. Your pick runs through `git commit`, optionally
   followed by `git push`.

There is no config file to write and no account to create. The first run works
from whatever history already exists in the repository.

## Flags worth knowing

| Flag | What it does |
| --- | --- |
| `-a`, `--all` | Stage tracked changes first (`git add -u`) before reading the diff |
| `-c`, `--commit` | Skip the final confirmation and run `git commit` |
| `-y`, `--yes` | Take the first suggestion without prompting |
| `--count <n>` | Ask for more suggestions, 1 to 5 |
| `-t`, `--type <type>` | Force a commit type |
| `-s`, `--scope <scope>` | Force a scope, such as `auth` |
| `--body` | Prompt for a commit body after you pick a subject |
| `--push` | Run `git push` after a successful commit |
| `--dry-run` | Print the chosen message without committing |
| `--print` | Print suggestion subjects to stdout and exit. No prompts |
| `--offline` | Skip the service and use rule-based suggestions |
| `--echo` | Print the exact prompt that would be sent, then exit |
| `--force-conventional` | Force Conventional Commits even if your history does not use it |
| `--no-verify` | Pass `--no-verify` to `git commit`, skipping hooks |

`gitcomm --help` lists the rest.

## Your secrets stay out of it

Before anything is sent, diffs are truncated and filtered. Lockfiles and
generated files are skipped, and content matching common secret patterns is
stripped. Use `--offline` to keep everything on your machine, or `--echo` to
inspect exactly what would go out.

## Documentation

Full docs live at [gitcomm.web.id](https://gitcomm.web.id).

- [Getting started](https://gitcomm.web.id/docs/getting-started)
- [Commit anatomy](https://gitcomm.web.id/docs/commit-anatomy)
- [Installation](https://gitcomm.web.id/docs/installation)
- [Usage](https://gitcomm.web.id/docs/usage)
- [Commands](https://gitcomm.web.id/docs/commands)
- [Commit types](https://gitcomm.web.id/docs/commit-types)
- [Safety & privacy](https://gitcomm.web.id/docs/safety-and-privacy)

## Links

- [Source](https://github.com/farelaryaduta/commit-in)
- [npm](https://www.npmjs.com/package/gitcomm)
