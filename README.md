# WoozyLab Site

WoozyLab 앱의 제품 소개, 고객지원, 개인정보 처리방침을 제공하는 정적 GitHub Pages 사이트입니다.

## 공개 사이트

- WoozyLab: https://woozy-A.github.io/WoozyLab/
- 밥픽 Web Lab: https://woozy-a.github.io/lunch-picker/
- Support Hub: https://woozy-A.github.io/WoozyLab/support/
- Privacy Hub: https://woozy-A.github.io/WoozyLab/privacy/
- KeyPic: https://woozy-A.github.io/WoozyLab/keypic/
- KeyPic Support: https://woozy-A.github.io/WoozyLab/keypic/support/
- KeyPic Privacy Policy: https://woozy-A.github.io/WoozyLab/keypic/privacy/
- English Home: https://woozy-A.github.io/WoozyLab/en/
- KeyPic (English): https://woozy-A.github.io/WoozyLab/en/keypic/
- KeyPic Support (English): https://woozy-A.github.io/WoozyLab/en/keypic/support/
- KeyPic Privacy Policy (English): https://woozy-A.github.io/WoozyLab/en/keypic/privacy/
- GlassLingo: https://woozy-A.github.io/WoozyLab/glasslingo/
- GlassLingo Support: https://woozy-A.github.io/WoozyLab/glasslingo/support/
- GlassLingo Privacy Policy: https://woozy-A.github.io/WoozyLab/glasslingo/privacy/

`/support/`와 `/privacy/`는 첫 KeyPic App Store 제출에 사용된 호환 URL이기도 합니다. 경로를 삭제하지 말고 앱 선택 허브로 유지합니다. 다음 KeyPic 등록·업데이트에서는 전용 `/keypic/support/`와 `/keypic/privacy/`를 App Store Connect에 사용하는지 확인합니다.

## 관리 구조

```text
apps/                       앱별 기준 데이터
  keypic.json
  glasslingo.json
schema/
  app.schema.json           앱 데이터 JSON Schema
assets/
  css/site.css              공통 스타일과 반응형 규칙
  ...                       앱 아이콘과 앱·Web Lab 미리보기
scripts/
  validate-schema.mjs       앱 JSON Schema 검사
  validate-site.mjs         내부 링크, 이미지, 공개 경로 검사
{app}/
  index.html                제품 소개
  support/index.html        고객지원
  privacy/index.html        개인정보 처리방침
en/
  index.html                영어 WoozyLab 홈
  support/index.html        영어 고객지원 허브
  privacy/index.html        영어 개인정보 허브
  {app}/                    영어 앱 소개·지원·개인정보 페이지
SITE_RULES.md               사이트 운영과 AI 작업의 최상위 규칙
SITE_AUDIT.md               구조 점검 결과와 남은 확인 항목
```

앱 정보나 정책을 수정하기 전에는 [SITE_RULES.md](./SITE_RULES.md), 대상 `apps/{slug}.json`, 대상 앱의 세 HTML을 먼저 읽습니다. 사이트 전체 구조를 바꿀 때는 [SITE_AUDIT.md](./SITE_AUDIT.md)의 기존 위험과 TODO도 확인합니다. AI의 대화 기억이나 다른 저장소의 내용을 앱 정보 근거로 사용하지 않습니다.

## 로컬 검증

Node.js 18 이상과 npm이 필요합니다.

```sh
npm install
npm run validate
```

`npm run validate`는 다음을 확인합니다.

- 모든 앱 JSON이 `schema/app.schema.json`을 통과하는지
- 앱 이름, Support URL, Privacy URL, 개인정보 사실이 누락되지 않았는지
- HTML 내부 링크, 이미지, CSS 경로가 실제로 존재하는지
- 앱 JSON의 아이콘, 스크린샷, 출처 파일이 존재하는지
- 앱 URL이 정확한 GitHub Pages 도메인·slug·소개/지원/개인정보 경로인지
- 앱 이름, 요약, 지원 이메일, 개인정보 사실, 권한 목적이 해당 HTML과 일치하는지
- 모든 앱이 루트·Support·Privacy 허브에 등록되어 있는지
- 현재 공개 URL과 KeyPic 영어 URL에 해당하는 15개 `index.html`이 유지되는지
- 한국어·영어 페이지가 서로 대응하는 언어 전환 링크를 제공하는지

## 새 앱 추가

1. `apps/new-app.json` 작성
2. 아이콘과 스크린샷 추가
3. `new-app/`, `new-app/support/`, `new-app/privacy/` 페이지 생성
4. 루트, Support Hub, Privacy Hub에 링크 추가
5. `npm run validate` 및 데스크톱·모바일 확인
6. diff 검토 후 현재 GitHub Pages 배포 기준인 `main` 브랜치 루트에 커밋·푸시

확인되지 않은 App Store URL, 권한, 개인정보 내용은 추측하지 말고, 스키마가 허용하는 필드만 `null`과 `todos`로 남깁니다. 필수 사실이 확인되지 않으면 배포하지 않습니다. 자세한 절차와 배포 체크리스트는 [SITE_RULES.md](./SITE_RULES.md)를 따릅니다.
