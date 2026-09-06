import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonicalOrigin = "https://woozy-a.github.io";
const projectPrefix = "/WoozyLab/";
const errors = [];
let checkedReferences = 0;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

function display(target) {
  return path.relative(root, target) || ".";
}

function isInsideRepository(target) {
  const relative = path.relative(root, target);
  return relative === ""
    || (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function containsHtmlValue(html, value) {
  const escaped = value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
  return html.includes(value) || html.includes(escaped);
}

function requireHtmlValue(file, html, value, field) {
  if (!containsHtmlValue(html, value)) {
    errors.push(`${display(file)}: apps JSON의 ${field} 값이 페이지에 없습니다 (${value}).`);
  }
}

function appPageFiles(app) {
  const appRoot = path.join(root, app.slug);
  return {
    marketingURL: path.join(appRoot, "index.html"),
    supportURL: path.join(appRoot, "support/index.html"),
    privacyURL: path.join(appRoot, "privacy/index.html")
  };
}

function imageAssetTarget(asset) {
  const assetsRoot = path.join(root, "assets");
  if (asset !== path.posix.normalize(asset) || asset.includes("\\")) return null;
  const target = path.resolve(root, asset);
  const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

  if (target !== assetsRoot && !target.startsWith(`${assetsRoot}${path.sep}`)) return null;
  if (!allowedExtensions.has(path.extname(target).toLowerCase())) return null;
  return target;
}

function expectedAppURLs(app) {
  const basePath = `${projectPrefix}${app.slug}/`;
  return {
    marketingURL: new URL(basePath, canonicalOrigin).href,
    supportURL: new URL(`${basePath}support/`, canonicalOrigin).href,
    privacyURL: new URL(`${basePath}privacy/`, canonicalOrigin).href
  };
}

function hasExpectedAppURL(app, field, url) {
  return new URL(url).href === expectedAppURLs(app)[field];
}

function htmlTarget(fromFile, rawPath) {
  const decodedPath = decodeURIComponent(rawPath);
  let base;

  if (decodedPath.startsWith("/")) {
    // GitHub project Pages에서 /support/는 도메인 루트를 가리킨다.
    // 절대경로는 반드시 /WoozyLab/ 접두사를 포함해야 저장소 안의 파일과 일치한다.
    if (!decodedPath.startsWith(projectPrefix)) return null;
    base = path.resolve(root, decodedPath.slice(projectPrefix.length));
  } else {
    base = path.resolve(path.dirname(fromFile), decodedPath);
  }

  if (!isInsideRepository(base)) return null;
  if (path.extname(base)) return base;
  return path.join(base, "index.html");
}

function runInternalGuards() {
  const sampleApp = { slug: "sample-app" };
  const cases = [
    ["canonical marketing URL", hasExpectedAppURL(sampleApp, "marketingURL", "https://woozy-a.github.io/WoozyLab/sample-app/"), true],
    ["foreign origin", hasExpectedAppURL(sampleApp, "marketingURL", "https://example.com/WoozyLab/sample-app/"), false],
    ["wrong slug", hasExpectedAppURL(sampleApp, "supportURL", "https://woozy-a.github.io/WoozyLab/other-app/support/"), false],
    ["wrong page role", hasExpectedAppURL(sampleApp, "privacyURL", "https://woozy-a.github.io/WoozyLab/sample-app/support/"), false],
    ["project absolute path", htmlTarget(path.join(root, "index.html"), "/WoozyLab/support/") === path.join(root, "support/index.html"), true],
    ["domain-root absolute path", htmlTarget(path.join(root, "index.html"), "/support/") === null, true],
    ["sibling prefix path", isInsideRepository(path.join(`${root}-backup`, "index.html")) === false, true],
    ["CSS rejected as image", imageAssetTarget("assets/css/site.css") === null, true],
    ["asset traversal rejected", imageAssetTarget("assets/../assets/keypic-logo.png") === null, true],
    ["asset dot segment rejected", imageAssetTarget("assets/./keypic-logo.png") === null, true]
  ];

  for (const [name, actual, expected] of cases) {
    if (actual !== expected) errors.push(`내부 검증 guard 실패: ${name}`);
  }
  return cases.length;
}

async function validateHtml(file) {
  const html = await readFile(file, "utf8");
  const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]));
  const seenIds = new Set();

  for (const match of html.matchAll(/\sid=["']([^"']+)["']/g)) {
    if (seenIds.has(match[1])) errors.push(`${display(file)}: duplicate id #${match[1]}`);
    seenIds.add(match[1]);
  }

  const references = html.matchAll(/\s(?:href|src)=["']([^"']+)["']/g);
  for (const match of references) {
    const reference = match[1].trim();
    checkedReferences += 1;

    if (!reference || /^(?:https?:|mailto:|tel:|data:)/i.test(reference)) continue;

    const [rawPath, fragment] = reference.split("#", 2);
    const target = rawPath ? htmlTarget(file, rawPath.split("?", 1)[0]) : file;

    if (!target) {
      errors.push(`${display(file)}: repository 밖을 가리키는 경로 ${reference}`);
      continue;
    }

    if (!await exists(target)) {
      errors.push(`${display(file)}: 찾을 수 없는 경로 ${reference} -> ${display(target)}`);
      continue;
    }

    if (fragment && target.endsWith(".html")) {
      const targetHtml = target === file ? html : await readFile(target, "utf8");
      const targetIds = target === file
        ? ids
        : new Set([...targetHtml.matchAll(/\sid=["']([^"']+)["']/g)].map((idMatch) => idMatch[1]));
      if (!targetIds.has(decodeURIComponent(fragment))) {
        errors.push(`${display(file)}: 찾을 수 없는 앵커 ${reference}`);
      }
    }
  }
}

async function validateAppData(file) {
  const app = JSON.parse(await readFile(file, "utf8"));
  const pageFiles = appPageFiles(app);
  const expectedURLs = expectedAppURLs(app);

  if (path.basename(file, ".json") !== app.slug) {
    errors.push(`${display(file)}: 파일 이름과 slug가 다릅니다.`);
  }

  for (const asset of [app.icon, ...app.screenshots.map((screenshot) => screenshot.path)]) {
    checkedReferences += 1;
    const target = imageAssetTarget(asset);
    if (!target) {
      errors.push(`${display(file)}: asset은 assets/ 안의 지원 이미지 파일이어야 합니다 (${asset}).`);
    } else if (!await exists(target)) {
      errors.push(`${display(file)}: 찾을 수 없는 asset ${asset}`);
    }
  }

  for (const [field, url] of [
    ["marketingURL", app.marketingURL],
    ["supportURL", app.supportURL],
    ["privacyURL", app.privacyURL]
  ]) {
    checkedReferences += 1;
    const actualURL = new URL(url).href;
    if (!hasExpectedAppURL(app, field, url)) {
      errors.push(`${display(file)}: ${field}는 ${expectedURLs[field]} 이어야 합니다 (${actualURL}).`);
    }

    const target = pageFiles[field];
    if (!await exists(target)) errors.push(`${display(file)}: ${field} 대상 파일이 없습니다 (${display(target)}).`);
  }

  if (Object.values(pageFiles).every((pageFile) => files.includes(pageFile))) {
    const marketingHtml = await readFile(pageFiles.marketingURL, "utf8");
    const supportHtml = await readFile(pageFiles.supportURL, "utf8");
    const privacyHtml = await readFile(pageFiles.privacyURL, "utf8");

    requireHtmlValue(pageFiles.marketingURL, marketingHtml, app.name, "name");
    requireHtmlValue(pageFiles.marketingURL, marketingHtml, app.summary, "summary");
    requireHtmlValue(pageFiles.supportURL, supportHtml, app.name, "name");
    requireHtmlValue(pageFiles.supportURL, supportHtml, app.supportEmail, "supportEmail");
    requireHtmlValue(pageFiles.privacyURL, privacyHtml, app.name, "name");
    requireHtmlValue(pageFiles.privacyURL, privacyHtml, app.supportEmail, "supportEmail");

    for (const fact of app.privacyFacts) {
      requireHtmlValue(pageFiles.privacyURL, privacyHtml, fact, "privacyFacts");
    }

    if (app.privacyPolicyUpdatedAt !== null) {
      requireHtmlValue(
        pageFiles.privacyURL,
        privacyHtml,
        app.privacyPolicyUpdatedAt,
        "privacyPolicyUpdatedAt"
      );
    }

    for (const permission of app.permissions ?? []) {
      requireHtmlValue(pageFiles.supportURL, supportHtml, permission.name, "permissions.name");
      requireHtmlValue(pageFiles.supportURL, supportHtml, permission.purpose, "permissions.purpose");
    }

    if (app.appStoreURL !== null) {
      requireHtmlValue(pageFiles.marketingURL, marketingHtml, app.appStoreURL, "appStoreURL");
    }
  }

  for (const source of app.sourceFiles) {
    checkedReferences += 1;
    const target = path.resolve(root, source);
    if (!isInsideRepository(target)) {
      errors.push(`${display(file)}: sourceFiles는 저장소 안의 파일이어야 합니다 (${source}).`);
    } else if (!await exists(target)) {
      errors.push(`${display(file)}: sourceFiles 항목이 없습니다 (${source}).`);
    }
  }

  return app;
}

async function localHrefTargets(file) {
  const html = await readFile(file, "utf8");
  const targets = new Set();

  for (const match of html.matchAll(/\shref=["']([^"']+)["']/g)) {
    const reference = match[1].trim();
    if (!reference || /^(?:https?:|mailto:|tel:|data:)/i.test(reference)) continue;

    const rawPath = reference.split("#", 1)[0].split("?", 1)[0];
    if (!rawPath) continue;

    const target = htmlTarget(file, rawPath);
    if (target) targets.add(target);
  }

  return targets;
}

const internalGuardCount = runInternalGuards();
const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const appFiles = files.filter((file) => path.dirname(file) === path.join(root, "apps") && file.endsWith(".json"));

for (const file of htmlFiles) await validateHtml(file);
const apps = [];
for (const file of appFiles) apps.push(await validateAppData(file));

const hubFiles = {
  marketingURL: path.join(root, "index.html"),
  supportURL: path.join(root, "support/index.html"),
  privacyURL: path.join(root, "privacy/index.html")
};
const hubLinks = {};

for (const [field, file] of Object.entries(hubFiles)) {
  hubLinks[field] = await localHrefTargets(file);
}

for (const app of apps) {
  const pageFiles = appPageFiles(app);
  for (const [field, hubFile] of Object.entries(hubFiles)) {
    const target = pageFiles[field];
    if (!hubLinks[field].has(target)) {
      errors.push(`${display(hubFile)}: ${app.name}의 ${field} 링크가 없습니다.`);
    }
  }
}

const requiredPublicFiles = [
  "index.html",
  "support/index.html",
  "privacy/index.html",
  "keypic/index.html",
  "keypic/support/index.html",
  "keypic/privacy/index.html",
  "glasslingo/index.html",
  "glasslingo/support/index.html",
  "glasslingo/privacy/index.html",
  "orannamu/index.html",
  "orannamu/support/index.html",
  "orannamu/privacy/index.html",
  "en/index.html",
  "en/support/index.html",
  "en/privacy/index.html",
  "en/keypic/index.html",
  "en/keypic/support/index.html",
  "en/keypic/privacy/index.html"
];

for (const publicFile of requiredPublicFiles) {
  if (!await exists(path.join(root, publicFile))) errors.push(`필수 공개 URL 파일이 없습니다: ${publicFile}`);
}

const localizedPagePairs = [
  ["index.html", "en/index.html"],
  ["support/index.html", "en/support/index.html"],
  ["privacy/index.html", "en/privacy/index.html"],
  ["keypic/index.html", "en/keypic/index.html"],
  ["keypic/support/index.html", "en/keypic/support/index.html"],
  ["keypic/privacy/index.html", "en/keypic/privacy/index.html"]
];

for (const [koreanPath, englishPath] of localizedPagePairs) {
  const koreanFile = path.join(root, koreanPath);
  const englishFile = path.join(root, englishPath);

  if (!await exists(koreanFile) || !await exists(englishFile)) continue;

  const [koreanHtml, englishHtml, koreanTargets, englishTargets] = await Promise.all([
    readFile(koreanFile, "utf8"),
    readFile(englishFile, "utf8"),
    localHrefTargets(koreanFile),
    localHrefTargets(englishFile)
  ]);

  if (!/<html\s+lang=["']ko["']/.test(koreanHtml)) {
    errors.push(`${display(koreanFile)}: 한국어 페이지의 html lang이 ko가 아닙니다.`);
  }
  if (!/<html\s+lang=["']en["']/.test(englishHtml)) {
    errors.push(`${display(englishFile)}: 영어 페이지의 html lang이 en이 아닙니다.`);
  }
  if (!koreanTargets.has(englishFile)) {
    errors.push(`${display(koreanFile)}: 대응 영어 페이지 링크가 없습니다 (${display(englishFile)}).`);
  }
  if (!englishTargets.has(koreanFile)) {
    errors.push(`${display(englishFile)}: 대응 한국어 페이지 링크가 없습니다 (${display(koreanFile)}).`);
  }
}

if (errors.length > 0) {
  console.error(`Site validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Site validation passed: ${htmlFiles.length} HTML files, ${appFiles.length} app data files, ${checkedReferences} references, ${localizedPagePairs.length} localized page pairs, and ${internalGuardCount} negative guards checked.`);
