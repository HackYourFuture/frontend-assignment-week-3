import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const task1Dir = resolve(__dirname, "../task-1");

const expectedTsFiles = [
  "src/main.ts",
  "src/store.ts",
  "src/task-manager.ts",
  "src/views/app-view.ts",
  "src/views/task-list-view.ts",
  "src/views/task-edit-view.ts",
  "src/views/utils.ts",
];

const tsFileCount = expectedTsFiles.filter((f) =>
  existsSync(resolve(task1Dir, f))
).length;

let errorCount = 0;

if (tsFileCount > 0) {
  try {
    execSync("npx tsc --noEmit", { cwd: task1Dir, encoding: "utf-8" });
  } catch (err) {
    const output = (err.stdout || "") + (err.stderr || "");
    const matches = output.match(/error TS\d+:/g);
    errorCount = matches ? matches.length : 0;
  }
}

const result = {
  errorCount,
  tsFileCount,
  totalExpectedFiles: expectedTsFiles.length,
};

console.log(JSON.stringify(result));
