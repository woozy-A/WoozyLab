# WeatherFit 반영 근거 · 2026-11-06

사용자가 기존 키픽 사이트에 WeatherFit 소개·지원·개인정보처리방침을 공개하도록 요청한 범위다. 기존 키픽 사이트는 현재 WoozyLab으로 연결되며, 새 호스팅을 만들지 않고 같은 GitHub Pages에 추가한다.

- 원본 앱 저장소: WeatherFit. 기준 로컬 커밋 `fcb98d1` 및 2026-11-06 공개 준비 변경. 원본 경로는 `docs/release-site/index.html`, `docs/release-site/privacy.html`이다.
- 운영자·개인정보 문의 담당자 양창우, `ycw012@naver.com`, 답변 완료 후 30일 이내 메일함·휴지통 삭제는 사용자가 직접 확인했다.
- 원본 처리방침에 시행일 2026-11-06과 GitHub Pages 웹 방문 시 IP 주소의 보안 목적 기록을 반영한 후 가져왔다. Apple 날씨·로컬 좌표·외부 검색·진단·메일 보관의 의미를 사이트에서 새로 만들지 않았다.
- `content/sources/weatherfit/2026-11-06/*.source.html.txt`는 가져온 HTML 원본의 변경 없는 사본이다. `.html`로 공개 문서처럼 렌더링하지 않도록 텍스트 확장자를 사용했다.
- 가져온 본문에서는 공통 문서 제목과 중복되는 H1만 제거했다. 원본 상대 링크를 새 `/weatherfit/support/`, `/weatherfit/privacy/` 경로에 맞추고, 시행일에 `time` 태그를 추가했다. 정책 문장은 그대로 유지했다.
- `*-approved.txt`는 이 본문의 텍스트 사본이며, 기존 승인 본문 보존 검사에서 사용한다. 원본 HTML·텍스트·렌더링 본문 SHA-256은 `content/document-provenance.json`에 있다.
- 제품 요약과 기능은 승인 지원 문서의 외출 시간대 체감온도·비·바람 추천, 아이템 상세의 오늘만 변경, 외부 착용 예시 검색, 설정·위젯 설명만 사용했다. 계정·사진 업로드·OOTD·공유·AI 사진 인식·쇼핑 기능을 공개 기능으로 소개하지 않는다.
- 위치 권한은 사용자가 허용 여부를 선택하며, 거부하면 현재 위치 날씨를 새로 불러올 수 없다. `required: false`는 허용을 강제하지 않는다는 뜻이며 위치 없이 새 예보를 제공한다는 뜻이 아니다.
- 아이콘은 `TodayOutfit/Assets.xcassets/AppIcon.appiconset/AppIcon.png`를 편집 없이 복사했다. SHA-256: 82a35146b1472da17ec0054224a6df037472bd79c871c54fad7b2a9ad0f91ff8.
- 별도 앱 테마나 공통 스타일을 변경하지 않고 기존 청색 기본 테마(`#244F8B`)를 사용한다.
- 출시 준비 상태다. 확인되지 않은 App Store 주소는 `null`이다. 영어 상세 페이지와 검토되지 않은 실제 앱 화면은 만들지 않았다. 기존 앱 정책·주소·연락처는 변경하지 않는다.
