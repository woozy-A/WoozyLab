# WoozyLab 사이트 구조 점검 기록

- 점검일: 2026-07-18
- 점검 기준 커밋: `fbe6929` (`origin/main`, 작업 시작 시점)
- 범위: 모든 HTML, CSS, 이미지, 내부 링크, 앱별 공개 정보와 URL

이 문서는 구조 점검 결과와 남은 확인 항목을 기록한다. 앱 정보의 단일 기준은 `apps/*.json`과 각 앱의 공개 HTML이며, 이 문서만으로 개인정보·권한·지원 내용을 새로 만들면 안 된다.

## 1. 파일 구성 점검

| 구분 | 작업 전 | 정리 후 |
|---|---:|---:|
| 공개 HTML | 9개 | 9개, 기존 경로 유지 |
| 외부 CSS | 0개 | 공통 `assets/css/site.css` 1개 |
| 이미지 | PNG 2개 | 기존 PNG 2개 유지, 밥픽 Web Lab 미리보기 JPG 1개 추가 |
| 구조화된 앱 데이터 | 없음 | `apps/keypic.json`, `apps/glasslingo.json` |
| 데이터 검증 규칙 | 없음 | `schema/app.schema.json`과 npm 검증 스크립트 |
| 운영 기준 문서 | 간단한 README만 존재 | `SITE_RULES.md`, `SITE_AUDIT.md`, 보강된 README |

작업 전 9개 HTML 모두 자체 `<style>` 또는 인라인 스타일을 포함했다. 정리 후 루트·허브·앱 지원/개인정보 페이지는 공통 CSS를 사용한다. GlassLingo 소개 페이지의 고유한 렌즈 디자인 CSS는 사용자-facing 디자인을 크게 바꾸지 않기 위해 페이지 안에 유지하고, 공통 CSS의 컴포넌트 선택자가 침범하지 않도록 범위를 제한했다.

배포 이미지는 다음 세 파일이며 파일 형식과 실제 크기를 확인했다.

| 파일 | 형식 | 크기 | 상태 |
|---|---|---:|---|
| `assets/keypic-logo.png` | PNG RGBA | 1024 × 1024 | 유지 |
| `assets/glasslingo-icon.png` | PNG RGB | 512 × 512 | 유지 |
| `assets/babpick-preview.jpg` | JPEG RGB | 1280 × 720 | 밥픽 공개 화면 미리보기 |

## 2. 발견 문제와 처리 결과

| 구분 | 작업 전 발견 | 위험 | 처리 결과 |
|---|---|---|---|
| 내부 링크·이미지 | 작업 전 공개 파일에서 누락된 내부 대상은 발견되지 않음 | 이후 앱 추가 시 수동 점검 누락 가능 | 모든 HTML 링크·이미지·앵커와 JSON asset을 자동 검사 |
| CSS·레이아웃 중복 | 9개 HTML이 공통 레이아웃과 스타일을 각각 보유 | 수정 누락과 앱별 품질 편차 | 공통 기반을 `assets/css/site.css`로 분리 |
| 루트 Support | `/support/`가 KeyPic 전용 내용 | 다른 앱 사용자가 잘못된 지원 페이지로 이동 | 앱 선택형 허브로 변경하고 KeyPic 전용 URL 유지 |
| 루트 Privacy | `/privacy/`가 KeyPic 전용 정책 | 다른 앱 정책으로 오인 가능 | 앱 선택형 허브로 변경하고 KeyPic 전용 URL 유지 |
| KeyPic 호환 URL | 루트 Support/Privacy가 첫 제출용 URL로 문서화됨 | URL은 살아 있어도 페이지 의미가 허브로 바뀜 | 경로는 유지. 다음 App Store 등록·업데이트 시 전용 URL 확인 필요 |
| GlassLingo 중복 | 소개 페이지에 상세 지원·개인정보 내용이 있고 전용 페이지는 짧음 | 같은 사실이 여러 곳에서 다르게 수정될 수 있음 | 상세 내용은 전용 페이지로 모으고 소개 페이지는 요약 링크만 유지 |
| 브랜드 표기 | GlassLingo 소개에서 `Woozy Lab`, 다른 곳은 `WoozyLab` | 브랜드 표기 불일치 | 공식 표기를 `WoozyLab`로 통일 |
| 앱 정보 기준 | HTML과 README에 정보가 흩어짐 | AI나 작업자가 빈칸을 추측할 위험 | 앱 JSON, Schema, 규칙 문서를 추가하고 핵심 JSON↔HTML 일치 검사 |
| URL 복사 오류 | 앱 URL의 도메인·slug·페이지 역할을 강제하지 않음 | 다른 앱의 지원·정책 URL을 등록할 위험 | 정확한 GitHub Pages origin과 앱별 3개 경로를 검증 |
| 반응형 | 모바일 자동 검증이 없음 | 가로 스크롤, 헤더 겹침 가능 | 1440px, 390px, 320px에서 9개 페이지와 GlassLingo 앵커 확인 |

## 3. 정보 충돌과 기준 위치

| 정보 | 현재 기준 위치 | 충돌 방지 규칙 |
|---|---|---|
| 앱 이름·상태·요약·링크 | `apps/{slug}.json` | Schema와 URL 검증 통과 필요 |
| 고객지원 이메일·권한 목적 | 앱 JSON + `{slug}/support/index.html` | 두 위치의 핵심 문구 자동 대조 |
| 개인정보 사실·정책 개정일 | 앱 JSON + `{slug}/privacy/index.html` | 모든 `privacyFacts`와 ISO 개정일 자동 대조 |
| 기능 소개 | 앱 JSON + `{slug}/index.html` | 변경 시 두 위치를 같은 diff에서 검토 |
| 공통 내비게이션·푸터 | `SITE_RULES.md` + `assets/css/site.css` | 앱 페이지에서 홈·지원·개인정보 이동 경로 유지 |

GlassLingo 정책의 `기본 모드`, `방향을 우선`, `무료 기본 버전`, `향후 별도 안내` 같은 조건은 의미가 달라지지 않도록 원문 조건을 유지했다. KeyPic과 GlassLingo의 개인정보 및 권한 내용에는 현재 저장소에서 확인되지 않은 사실을 추가하지 않았다.

## 4. 공개 URL 보존 확인

| 공개 경로 | 저장소 파일 | 결과 |
|---|---|---|
| `/` | `index.html` | 유지, WoozyLab 앱 목록과 Web Labs 링크 |
| `/support/` | `support/index.html` | 유지, 앱 선택 허브 |
| `/privacy/` | `privacy/index.html` | 유지, 앱 선택 허브 |
| `/keypic/` | `keypic/index.html` | 유지 |
| `/keypic/support/` | `keypic/support/index.html` | 유지 |
| `/keypic/privacy/` | `keypic/privacy/index.html` | 유지 |
| `/glasslingo/` | `glasslingo/index.html` | 유지 |
| `/glasslingo/support/` | `glasslingo/support/index.html` | 유지 |
| `/glasslingo/privacy/` | `glasslingo/privacy/index.html` | 유지 |

작업 시작 시 공개 루트 `index.html`과 `origin/main`의 같은 파일은 SHA-256이 일치했다. 저장소의 기본 브랜치와 유일한 원격 추적 브랜치는 `main`이었다. GitHub Pages 설정을 변경할 때는 GitHub **Settings → Pages**에서 배포 폴더가 `(root)`인지 다시 확인한다.

## 5. 앱 소유자 확인이 필요한 TODO

| 앱 | 확인되지 않은 필드·사실 |
|---|---|
| KeyPic | 별도 tagline, App Store URL, 정확한 macOS 권한 이름과 사용 목적, 제품 스크린샷 |
| GlassLingo | 실제 출시 상태, App Store URL, 단일 대표 색상, 제품 스크린샷, 기본/무료 모드 개인정보 조건과 현재 앱 동작의 일치 여부 |
| 공통 | App Store Connect의 기존 KeyPic Support/Privacy URL이 전용 경로로 갱신되었는지 확인 |

TODO는 사실 확인 전까지 임의로 채우지 않는다. Schema가 `null`을 허용하지 않는 필수 정보가 불명확하면 새 앱 페이지를 배포하지 않는다.

## 6. 최종 로컬 검증 결과

| 검사 | 결과 |
|---|---|
| JSON Schema | 앱 JSON 2개 통과 |
| 누락·오류 guard | 필수 필드 4개, 날짜 1개, 이미지 경로 3개 통과 |
| 사이트 검사 | HTML 9개, 참조 127개, 실패 사례 10개 통과 |
| 데스크톱·모바일 | 기존 9개 경로 × 1440/390/320px 통과, 루트 Web Labs 카드 1280/390px 추가 확인 |
| 이미지·CSS 로딩 | 깨진 이미지와 미로딩 stylesheet 0개 |
| 레이아웃 | 가로 overflow 0개, 각 페이지 H1 1개 |
| Git 형식 검사 | `git diff --check` 통과 |

푸시 후에는 공개 URL의 HTTP 상태와 실제 배포 커밋 반영 여부를 다시 확인한다.
