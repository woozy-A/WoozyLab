# GlassLingo 웹 공개 자료 출처

2026년 10월 16일 GlassLingo V4.08의 승인 자료를 WoozyLab에 가져왔다. 첫 무료 Mac App Store 공개 범위는 영어↔한국어이며, 앱은 아직 출시 준비 상태다. 이 기록은 앱 출시나 심사 통과를 뜻하지 않는다.

## 승인 범위

앱 소유자가 2026년 10월 13일 선택한 운영 기준은 신고 해결 후 30일 이내 수신 메일과 별도 사본 삭제, QA 예문 재사용 시 별도 동의다. 한국어·영어 개인정보 본문은 GlassLingo `e1a1086`의 번들 원문을 그대로 가져와 문단과 링크만 HTML로 바꿨다. 개정일은 2026년 10월 13일이며 웹 정리 날짜와 구분한다.

공개 언어, 최소 OS, 모델 준비, 선택형 AI의 조건, 복사·수동 신고 흐름은 같은 커밋의 `APP_STORE_SUBMISSION_DRAFT.md`를 기준으로 소개와 지원 안내에 반영했다. 기존 WoozyLab 지원 페이지의 권한 확인·앱 재실행·문의 정보 안내도 유지했다. 영문 내용은 이 승인된 범위의 번역이며 원어민 교정이나 번역 품질 검수 완료를 주장하지 않는다.

## 원본과 SHA256

| 원본 경로 | SHA256 |
| --- | --- |
| `GlassLingo@e1a1086:Glasslingo/Glasslingo/ko.lproj/PrivacyPolicy.txt` | `3da12a5937be8b759357e7a9ef8a1eea5ab4385b4c438fed9b0dfc5bb39fc185` |
| `GlassLingo@e1a1086:Glasslingo/Glasslingo/en.lproj/PrivacyPolicy.txt` | `8cc36af8bc602d2b7a7e2b2c8c79b3d0301fe5db5aa05266adc5b01f03fdb0b7` |
| `GlassLingo@e1a1086:docs/release/APP_STORE_SUBMISSION_DRAFT.md` | `ba5f5580f640161eb6ae6a2b7f1d41ab8aaa7a9b2b0ba9d134d7effda5d26a02` |

정책 원문 사본은 `content/sources/glasslingo/2026-10-13/`에 보관한다. 생성 본문과 원본 해시는 `content/document-provenance.json`에 기록하며, 이전 공개 본문의 출처도 `previousSource`로 보존한다.

## 유지한 공개 범위

- 기존 한국어 소개·지원·개인정보 주소는 유지한다.
- 대응 영문 세 주소는 `/en/glasslingo/` 아래에 추가한다.
- `appStoreURL`은 확인되지 않아 `null`로 유지하고 다운로드 버튼을 만들지 않는다.
- 다른 앱의 소개·지원·개인정보 본문, 디자인과 GitHub Pages 배포 경로는 유지한다.
- 현재 번역 모델의 정확도나 정식 macOS·첫 설치 검수가 완료됐다고 표시하지 않는다.

## 2026-10-23 화면 읽기 설명 보강

앱 소유자는 `V4.08_PRIVACY_CLARIFICATION_2026-10-23.md`에 정리한 한국어·영어 문안의 웹 공개와 App Review 회신을 명시적으로 승인했다. 제출된 GlassLingo V4.08 (48), 소스 `c7ee540`의 화면 캡처와 메모리 보관 동작을 확인한 자료를 기준으로, 렌즈 영역의 정지 이미지와 별도의 화면 읽기 확인(주 디스플레이 중앙 최대 180×120포인트), 오디오 미수집, 기존 캡처를 재사용하는 AI 재번역, 렌즈 숨김·지우기·권한 확인 미리보기의 보관 차이를 명확히 설명했다.

새 수집 기능이나 전송 경로를 추가한 변경이 아니다. 기존 신고 메일 30일 이내 삭제, QA 예문 별도 동의, 클립보드·메일 사용자 선택 정책과 공개 URL은 유지했다. 웹 정책 개정일은 2026-10-23이다. 심사 중인 48번 바이너리 안의 2026-10-13 정책이 자동 변경되는 것은 아니며 앱 빌드 교체는 이번 게시 범위에 포함하지 않는다.

승인된 보강 문안 SHA256: `b3302006856e2fa96332876ce2a303237b170cd9fab31717c09cdb7079b531f0`.

| 공개 정책 원본 사본 | SHA256 |
| --- | --- |
| `content/sources/glasslingo/2026-10-23/ko-PrivacyPolicy.txt` | `96cbff9a40f49f36a2ac6f3e15872e7cbeac602c5aa1e034b5d7a1e1853a3a52` |
| `content/sources/glasslingo/2026-10-23/en-PrivacyPolicy.txt` | `c1dda83abc19ea2734a527434a1b829453fe6f6bff9fa2e87e819288e97ad66c` |

현재 공개 본문과 원본 해시는 `content/document-provenance.json`에 기록했다. 기존 2026-10-13 원본과 이전 출처는 그대로 보존했다. 이 기록은 정책 게시 작업의 출처이며 App Review 회신 발송이나 심사 통과를 뜻하지 않는다.
