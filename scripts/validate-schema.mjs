import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(await readFile(path.join(root, "schema/app.schema.json"), "utf8"));
const appNames = (await readdir(path.join(root, "apps")))
  .filter((name) => name.endsWith(".json"))
  .sort();

if (appNames.length === 0) {
  console.error("Schema validation failed: apps 디렉터리에 앱 JSON이 없습니다.");
  process.exit(1);
}

function isValidDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

const ajv = new Ajv2020({ allErrors: true, strict: true });
ajv.addFormat("date", { type: "string", validate: isValidDate });
const validate = ajv.compile(schema);
const failures = [];
const apps = [];

for (const appName of appNames) {
  const app = JSON.parse(await readFile(path.join(root, "apps", appName), "utf8"));
  apps.push(app);
  if (!validate(app)) {
    failures.push({ appName, errors: structuredClone(validate.errors ?? []) });
  }
}

if (failures.length > 0) {
  console.error(`Schema validation failed for ${failures.length} app file(s):`);
  for (const failure of failures) {
    console.error(`- apps/${failure.appName}`);
    for (const error of failure.errors) {
      console.error(`  ${error.instancePath || "/"} ${error.message}`);
    }
  }
  process.exit(1);
}

const guardedFields = ["name", "supportURL", "privacyURL", "privacyFacts"];
for (const field of guardedFields) {
  const incompleteApp = structuredClone(apps[0]);
  delete incompleteApp[field];
  if (validate(incompleteApp)) {
    console.error(`Schema guard failed: missing ${field} was accepted.`);
    process.exit(1);
  }
}

const invalidDateApp = structuredClone(apps[0]);
invalidDateApp.updatedAt = "2026-02-31";
if (validate(invalidDateApp)) {
  console.error("Schema guard failed: invalid updatedAt date was accepted.");
  process.exit(1);
}

const invalidAssets = [
  "assets/css/site.css",
  "assets/../assets/keypic-logo.png",
  "assets/./keypic-logo.png"
];
for (const invalidAsset of invalidAssets) {
  const invalidAssetApp = structuredClone(apps[0]);
  invalidAssetApp.icon = invalidAsset;
  if (validate(invalidAssetApp)) {
    console.error(`Schema guard failed: invalid icon asset was accepted (${invalidAsset}).`);
    process.exit(1);
  }
}

console.log(`Schema validation passed: ${appNames.length} app data files, ${guardedFields.length} required-field guards, date guard, and ${invalidAssets.length} asset guards.`);
