/* This script exists because lint-staged forwards staged files list as arguments
to `nx affected`, but nx would execute the command for each affected project and
would append a list of files that don't belong to that project.

Ex: `nx run @prisma-finance/core:lint apps/web/src/page.tsx

The solution is wrapping the call to nx and override what files nx treats as affected
*/

import { execa } from "execa";

const files = process.argv.slice(2);
if (files.length === 0) process.exit(0);

await execa("pnpm", ["nx", "format:write", "--files", ...files], {
  stdio: "inherit",
});
