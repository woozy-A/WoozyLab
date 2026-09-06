# WoozyLab 작업 시작점

어떤 작업에서 들어와도 `SITE_RULES.md` 전체를 먼저 읽는다.
앱 사실은 `apps/*.json`, 공통 화면은 `scripts/lib/`, 문서 본문은 `content/documents.json`이 기준이다.
생성된 `index.html`들을 직접 편집하지 않는다. `npm run build`로 재생성한다.
공통 스타일은 `assets/css/site.css`, 앱별 색은 `assets/css/themes.css`에서 관리한다.
지원·개인정보 본문은 디자인 정리 과정에서 의미를 바꾸지 않는다.
기존 공개 주소, 언어 링크, 다른 앱의 내용을 보존한다.
변경 후 `npm run validate`와 `git diff --check`를 실행한다.
브라우저 검증과 공개 배포는 요청 범위 및 `SITE_RULES.md`에 따른다.
