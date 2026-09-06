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

**HTML은 생성 결과입니다. 페이지마다 메뉴를 직접 고치지 마세요.**
세 앱과 18개 공개 페이지가 같은 레이아웃을 사용합니다. 앱마다 다른 것은 아이콘·색·내용이고, 메뉴·푸터·지원 문서의 읽기 방식은 같습니다.

| 바꾸려는 것 | 수정할 곳 |
|---|---|
| 앱 이름·상태·링크·기능 | `apps/{slug}.json` |
| 앱 순서·대표 연락처·홈 소개·Web Labs | `content/site.json` |
| 지원·개인정보 본문 | `content/documents.json` (승인된 사실만) |
| 모든 페이지의 메뉴·푸터 | `scripts/lib/layout.mjs` |
| 소개·목록·문서의 공통 구성 | `scripts/lib/pages.mjs` |
| 크기·간격·글꼴·반응형 | `assets/css/site.css` |
| 앱별 강조색·제한된 고유 스타일 | `assets/css/themes.css` |

수정 후 `npm run build` → `npm run validate`. HTML만 수정하면 생성 일치 검사가 실패합니다.
지원·정책 본문은 이전 공개 문서와 오랜나무 승인 문서에서 그대로 옮겼으며 `content/document-provenance.json`에 원본 근거와 본문 해시가 있습니다. 정책을 의도적으로 개정할 때만 근거·본문·JSON 사실·개정일·해시를 함께 검토합니다.

오랜나무 새 경로: `/orannamu/`, `/orannamu/support/`, `/orannamu/privacy/`.
앱 내 기존 WitnessTree-Legal 링크와 별도 사이트는 이번 사이트 작업에서 수정하지 않습니다.

```text
apps/                       앱별 기준 데이터
  keypic.json
  glasslingo.json
schema/
  app.schema.json           앱 데이터 JSON Schema
assets/
  css/site.css              공통 스타일과 반응형 규칙
  css/themes.css            앱별 개성
  ...                       앱 아이콘과 앱·Web Lab 미리보기
scripts/
  build-site.mjs            공통 틀로 18개 HTML 생성
  lib/                     공통 레이아웃과 페이지 구성
  site.test.mjs             문구 보존·메뉴·URL 회귀 검사
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
npm ci
npm run build
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
- 기존 15개 공개 URL과 새 오랜나무 3개 URL이 유지되는지
- 모든 HTML이 공통 틀의 최신 생성 결과인지
- 기존 지원·개인정보 본문과 연락처가 보존되는지
- 한국어·영어 페이지가 서로 대응하는 언어 전환 링크를 제공하는지

## 새 앱 추가

1. `apps/new-app.json` 작성
2. 아이콘과 스크린샷 추가
3. `content/documents.json`에 승인된 지원·개인정보 본문과 출처 기록 추가
4. `content/site.json`의 `appOrder`에 추가하고 `npm run build` (세 페이지와 허브 자동 반영)
5. `npm run validate` 및 데스크톱·모바일 확인
6. diff 검토 후 현재 GitHub Pages 배포 기준인 `main` 브랜치 루트에 커밋·푸시

확인되지 않은 App Store URL, 권한, 개인정보 내용은 추측하지 말고, 스키마가 허용하는 필드만 `null`과 `todos`로 남깁니다. 필수 사실이 확인되지 않으면 배포하지 않습니다. 자세한 절차와 배포 체크리스트는 [SITE_RULES.md](./SITE_RULES.md)를 따릅니다.
