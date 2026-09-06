import { escapeHTML as e, relativeURL, appRoute } from './layout.mjs';

const englishKeyPic = {
  summary: 'Review large photo sets quickly with keyboard shortcuts and organize them into folders on your Mac.',
  tagline: 'KeyPic',
  features: [{title:'Photo review and organization', description:'Review photos with keyboard shortcuts and organize them into folders on your Mac.'}]
};

export function appCard(app, route, locale, role = '') {
  const english = locale === 'en';
  const koreanTarget = english && app.slug !== 'keypic';
  const summary = english && app.slug === 'keypic' ? englishKeyPic.summary : app.summary;
  const url = target => e(relativeURL(route, target));
  const status = english && app.slug === 'keypic' ? 'Available' : app.status;
  const action = role === 'support' ? 'Support' : role === 'privacy' ? 'Privacy Policy' : english ? 'Explore app' : '앱 살펴보기';
  return `<article class="app-card theme-${app.slug}"><div class="app-card-top"><img class="app-icon" src="${url(app.icon)}" width="88" height="88" alt="${e(app.name)} ${english ? 'app icon' : '앱 아이콘'}"><span class="platform">${e(app.platform)}</span></div><div class="app-card-heading"><h3>${e(app.name)}</h3>${status ? `<span class="status">${e(status)}</span>` : ''}</div><p class="description"${koreanTarget ? ' lang="ko"' : ''}>${e(summary)}</p><a class="card-action" href="${url(appRoute(app, role, locale))}"${koreanTarget ? ' hreflang="ko"' : ''}>${action}${koreanTarget ? ' · 한국어' : ''}<span aria-hidden="true">↗</span></a></article>`;
}

export function homePage(site, apps, route, locale) {
  const english = locale === 'en';
  const copy = site.home[locale];
  const lab = site.webLab;
  const url = target => e(relativeURL(route, target));
  return `<header class="page-heading home-heading"><p class="eyebrow">INDEPENDENT APPS &amp; EXPERIMENTS</p><h1>${copy.title}</h1><p class="intro">${e(copy.intro)}</p></header>
  <section id="apps" class="catalog-section" aria-labelledby="apps-title"><div class="section-heading section-heading-row"><h2 id="apps-title">Apps</h2><p>${english ? 'Tools for work. Stories for life.' : '일상을 돕는 도구, 일상 밖의 발견.'}</p></div><div class="app-grid">${apps.map(app=>appCard(app, route, locale)).join('')}</div></section>
  <section id="web-labs" class="web-labs-section" aria-labelledby="web-labs-title"><div class="section-heading section-heading-row"><h2 id="web-labs-title">Web Labs</h2><p>${english ? 'Small experiments. Open right in your browser.' : '설치 없이 바로 써보는 작은 실험.'}</p></div><a class="web-lab-card" href="${e(lab.url)}"><img src="${url(lab.image)}" width="1280" height="720" loading="lazy" alt="${english ? 'Babpick lunch recommendation screen' : '밥픽 웹앱의 점심 추천 화면'}"><div><p class="eyebrow">LUNCH PICKER</p><h3>${e(english ? lab.nameEN : lab.name)}</h3><p>${e(english ? lab.descriptionEN : lab.description)}</p><span class="text-link">${english ? 'Open on the web' : '웹에서 바로 쓰기'} ↗</span></div></a></section>
  <section id="contact" class="contact-section" aria-labelledby="contact-title"><div><p class="eyebrow">LET’S TALK</p><h2 id="contact-title">${english ? 'A question or an idea?' : '궁금한 점이나 아이디어가 있나요?'}</h2><p>${english ? 'For app-specific help, please use the Support page.' : '앱 사용 문의는 Support에서 해당 앱을 선택해 주세요.'}</p></div><a href="mailto:${e(site.contactEmail)}">${e(site.contactEmail)} ↗</a></section>`;
}

export function hubPage(site, apps, route, locale, kind) {
  const english = locale === 'en';
  const support = kind === 'support';
  const heading = support ? (english ? 'How can we help?' : '어떤 앱을 도와드릴까요?') : (english ? 'Privacy, app by app.' : '앱별 개인정보 처리방침.');
  const intro = support ? (english ? 'Choose your app for help and contact information.' : '사용 중인 앱을 선택하면 지원 안내와 문의 방법을 확인할 수 있습니다.') : (english ? 'Permissions and data handling differ between apps. Please choose the relevant policy.' : '앱마다 사용하는 권한과 데이터 처리 방식이 다릅니다. 확인하려는 앱의 정책을 선택해 주세요.');
  return `<header class="page-heading"><p class="eyebrow">WOOZYLAB / ${support ? 'SUPPORT' : 'PRIVACY'}</p><h1>${heading}</h1><p class="intro">${intro}</p></header><section aria-label="${support ? 'Support' : 'Privacy'} Apps"><div class="app-grid">${apps.map(app=>appCard(app,route,locale,kind)).join('')}</div></section>`;
}

export function productPage(app, route, locale) {
  const english = locale === 'en';
  const copy = english ? {...app, ...englishKeyPic} : app;
  const url = target => e(relativeURL(route,target));
  const shots = app.screenshots;
  const visual = shots.length ? `<figure class="product-preview"><img src="${url(shots[0].path)}" width="1260" height="2736" alt="${e(shots[0].alt)}"><figcaption>출시 준비 중인 앱 화면</figcaption></figure>` : `<div class="product-symbol"><img src="${url(app.icon)}" width="240" height="240" alt="${e(app.name)} ${english ? 'app icon' : '앱 아이콘'}"></div>`;
  return `<section class="product-hero" aria-labelledby="product-title"><div><div class="product-identity"><img src="${url(app.icon)}" width="64" height="64" alt=""><span>${e(app.name)}<small>${e(app.platform)}${app.status ? ' · ' + e(english ? 'Available' : app.status) : ''}</small></span></div><h1 id="product-title">${e(copy.tagline ?? app.name)}</h1><p class="intro">${e(copy.summary)}</p><div class="action-links">${app.appStoreURL ? `<a class="button primary" href="${e(app.appStoreURL)}">App Store ↗</a>` : ''}<a class="button ${app.appStoreURL ? 'secondary' : 'primary'}" href="${url(appRoute(app,'support',locale))}">${english ? 'Support' : '사용·지원 안내'}</a><a class="text-link" href="${url(appRoute(app,'privacy',locale))}">${english ? 'Privacy Policy' : '개인정보 처리방침'} ↗</a></div></div>${visual}</section>
  <section class="features-section" id="${e(app.slug)}" aria-labelledby="features-title"><div class="section-heading"><p class="eyebrow">INSIDE ${e(app.name).toUpperCase()}</p><h2 id="features-title">${english ? 'Made for your everyday workflow.' : app.slug === 'orannamu' ? '오래된 나무를 만나는 세 가지 방법.' : '필요한 순간에, 필요한 만큼.'}</h2></div><div class="feature-grid">${copy.features.map((f,i)=>`<article class="feature"><span class="feature-number">0${i+1}</span><h3>${e(f.title)}</h3><p>${e(f.description)}</p></article>`).join('')}</div></section>
  ${shots.length > 1 ? `<section class="story-feature"><figure><img src="${url(shots[1].path)}" width="1260" height="2736" loading="lazy" alt="${e(shots[1].alt)}"></figure><div><p class="eyebrow">WITNESS THE TIME</p><h2>같은 나무 곁에서,<br>다른 시간을 만납니다.</h2><p>나무가 바라본 장소는 어떻게 달라졌을까요? 시대별 장면을 따라가며 오늘의 풍경과 지난 시간을 연결합니다.</p><p class="notice">과거 장면은 편집 재구성 이미지이며 실제 당시 사진이 아닙니다.</p></div></section>` : ''}
  <section class="product-help" id="support"><h2>${english ? 'Help when you need it.' : '사용 중 궁금한 점이 있다면.'}</h2><div class="action-links"><a href="${url(appRoute(app,'support',locale))}">${e(app.name)} ${english ? 'Support' : '고객지원'} ↗</a><a id="privacy" href="${url(appRoute(app,'privacy',locale))}">${english ? 'Privacy Policy' : '개인정보 처리방침'} ↗</a><a href="mailto:${e(app.supportEmail)}">Contact ↗</a></div></section>`;
}

export function documentPage(app, doc, role, locale) {
  const english = locale === 'en';
  const title = role === 'support' ? (english ? 'Support' : '고객지원') : (english ? 'Privacy Policy' : '개인정보 처리방침');
  return `<article class="document-surface"><header class="document-heading"><p class="eyebrow">${e(app.name)} / ${role.toUpperCase()}</p><h1>${title}</h1>${app.slug === 'orannamu' ? `<p class="meta">최종 업데이트: <time datetime="${e(app.privacyPolicyUpdatedAt)}">2026년 9월 6일</time></p>` : ''}</header><div class="document-body">${doc.body}</div></article>`;
}
