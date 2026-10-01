export type PackageManagerId = "npm" | "pnpm" | "yarn" | "bun";

export type PackageCommand = {
  manager: PackageManagerId;
  label: string;
  code: string;
};

const MANAGERS: Record<PackageManagerId, { label: string; run: string; global: string; dev: string }> = {
  npm: { label: "npm", run: "npx", global: "npm install -g", dev: "npm install --save-dev" },
  pnpm: { label: "pnpm", run: "pnpm dlx", global: "pnpm add -g", dev: "pnpm add --save-dev" },
  yarn: { label: "yarn", run: "yarn dlx", global: "yarn global add", dev: "yarn add --dev" },
  bun: { label: "bun", run: "bunx", global: "bun add -g", dev: "bun add --dev" },
};

const ORDER: PackageManagerId[] = ["npm", "pnpm", "yarn", "bun"];

/** One-off run of gitcomm without installing, e.g. `npx gitcomm`. */
export function runCommands(binary = "gitcomm", flags = ""): PackageCommand[] {
  return ORDER.map((manager) => ({
    manager,
    label: MANAGERS[manager].label,
    code: `${MANAGERS[manager].run} ${binary}${flags}`,
  }));
}

/** Force a fresh download past a cached copy, e.g. `npx gitcomm@latest`. */
export function latestCommands(binary = "gitcomm"): PackageCommand[] {
  return ORDER.map((manager) => ({
    manager,
    label: MANAGERS[manager].label,
    code: `${MANAGERS[manager].run} ${binary}@latest`,
  }));
}

/** Machine-wide install, e.g. `npm install -g gitcomm`. */
export function globalCommands(binary = "gitcomm"): PackageCommand[] {
  return ORDER.map((manager) => ({
    manager,
    label: MANAGERS[manager].label,
    code: `${MANAGERS[manager].global} ${binary}`,
  }));
}

/** Project-scoped dev dependency, e.g. `npm install --save-dev gitcomm`. */
export function devCommands(binary = "gitcomm"): PackageCommand[] {
  return ORDER.map((manager) => ({
    manager,
    label: MANAGERS[manager].label,
    code: `${MANAGERS[manager].dev} ${binary}`,
  }));
}