import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { layout } from './lib/layout.mjs';
import { homePage, hubPage, productPage, documentPage } from './lib/pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const json = async name => JSON.parse(await readFile(path.join(root,name),'utf8'));
const site = await json('content/site.json');
const docs = await json('content/documents.json');
const allApps = await Promise.all((await readdir(path.join(root,'apps'))).filter(f=>f.endsWith('.json')).map(f=>json('apps/'+f)));
const apps = [...allApps].sort((a,b)=>site.appOrder.indexOf(a.slug)-site.appOrder.indexOf(b.slug));
const css = await Promise.all(['site.css','themes.css'].map(f=>readFile(path.join(root,'assets/css',f))));
const cssVersion = createHash('sha256').update(Buffer.concat(css)).digest('hex').slice(0,12);
const pages = new Map();
const add = (route, props) => pages.set(route + 'index.html', layout({route,site,cssVersion,...props}));
for (const locale of ['ko','en']) {
  const base = locale === 'en' ? 'en/' : '';
  add(base,{locale,title:'WoozyLab',description:site.home[locale].intro,content:homePage(site,apps,base,locale)});
  for (const role of ['support','privacy']) {
    const route = base+role+'/';
    add(route,{locale,title:`${role === 'support' ? 'Support' : 'Privacy'} | WoozyLab`,content:hubPage(site,apps,route,locale,role),description:locale === 'ko' ? 'WoozyLab 앱별 지원·개인정보 안내입니다.' : 'Support and privacy information for WoozyLab apps.'});
  }
  for (const app of apps.filter(app=>locale === 'ko' || app.slug === 'keypic')) {
    const route = base+app.slug+'/';
    add(route,{locale,app,title:`${app.name} | WoozyLab`,description:locale === 'en' ? 'KeyPic for macOS. Photo review and organization.' : app.summary,content:productPage(app,route,locale)});
    for (const role of ['support','privacy']) {
      const docRoute = route+role+'/';
      const doc = docs[docRoute];
      if (!doc) throw new Error(`Missing reviewed document: ${docRoute}`);
      add(docRoute,{locale,app,role,title:doc.title,description:doc.title,content:documentPage(app,doc,role,locale)});
    }
  }
}
let stale = 0;
for (const [file,html] of pages) {
  const target = path.join(root,file);
  if (process.argv.includes('--check')) {
    const current = await readFile(target,'utf8').catch(()=>null);
    if (current !== html) { console.error(`Rebuild required: ${file}`); stale++; }
  } else {
    await mkdir(path.dirname(target),{recursive:true});
    await writeFile(target,html);
  }
}
if (stale) process.exitCode = 1;
else console.log(`${process.argv.includes('--check') ? 'Verified' : 'Built'} ${pages.size} pages from shared templates.`);
