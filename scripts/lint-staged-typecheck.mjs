/* This script exists because lint-staged forwards the staged files list
to `nx affected`, but this has two problems:

1) The typecheck command runs inside each project, but lint-staged passes files that
don't belong to that project.

2) Lint-staged passes files relative to the repo's root, but each command
runs in the context of the project.

Ex: inside `apps/api` it'd run
`tsc --noEmit /apps/app/core/src/index.ts`

The solution is wrapping the call to nx and override what files nx treats as affected
*/

import path from "node:path";
import { execa } from "execa";

const repoRoot = process.cwd();

const files = process.argv
  .slice(2)
  .map((file) => (path.isAbsolute(file) ? path.relative(repoRoot, file) : file))
  .map((file) => file.split(path.sep).join("/"));
if (files.length === 0) process.exit(0);

await execa(
  "pnpm",
  ["nx", "affected", "--target=typecheck", "--files", ...files],
  {
    stdio: "inherit",
  },
);
