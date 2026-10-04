// knowledge/*.txt を読み込み、サーバー専用モジュール lib/persona.generated.ts に固める。
// dev / build の前に自動実行される。知識を更新したら knowledge/ のファイルを差し替えて再デプロイ。
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "knowledge");

const files = readdirSync(dir)
  .filter((f) => f.endsWith(".txt"))
  .sort();

const core = files.find((f) => f.startsWith("00_"));
if (!core) throw new Error("knowledge/00_*.txt (中核プロンプト) が見つかりません");

const read = (f) => readFileSync(join(dir, f), "utf8").trim();

const knowledge = files
  .filter((f) => f !== core)
  .map((f) => `<reference name="${f.replace(/\.txt$/, "")}">\n${read(f)}\n</reference>`)
  .join("\n\n");

const out = `// 自動生成ファイル。直接編集しない（scripts/build-persona.mjs が生成）。
export const CORE_PROMPT = ${JSON.stringify(read(core))};
export const KNOWLEDGE = ${JSON.stringify(knowledge)};
`;

writeFileSync(join(root, "lib", "persona.generated.ts"), out);
console.log(`persona: core=${read(core).length}字, knowledge=${knowledge.length}字 (${files.length - 1}ファイル)`);
