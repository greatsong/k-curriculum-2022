# 변경 이력 · Changelog

릴리스는 `vX.Y.Z`로 태그하고 GitHub Release에 `standards.json`·`standards.csv`를 첨부합니다. 스키마가 바뀌면 `data/manifest.json`의 `schema_version`이 올라갑니다. / Releases are tagged `vX.Y.Z` with `standards.json` and `standards.csv` attached; `schema_version` in `data/manifest.json` increments on schema changes.

## v3.0.1 — 2026-09-06 · 라이선스 고지를 세 층으로 / License notice restructured

- 데이터 자체는 바뀌지 않았습니다. / No data change.
- [LICENSE-DATA](./LICENSE-DATA)를 다시 썼습니다. **원문 층**(교육부 고시, 저작권법 제7조 제2호에 따라 보호받지 못하는 저작물로 이해, 조건 없음) / **이 저장소가 더한 층**(CC BY 4.0) / **출처 표기**(의무가 아니라 요청)를 분리했습니다. 종전 문안은 세 층을 뭉뚱그려 원문에도 CC BY 조건이 걸리는 것처럼 읽혔습니다.
- [docs/LICENSE-REVIEW.md](./docs/LICENSE-REVIEW.md) 신설: 확인한 사실(고시 붙임, 제7조, 공공누리 미표시, 교육부·NCIC 정책), 해석, 남은 불확실성, 교육부 서면 문의 내용, 시나리오별 대응.
- `datapackage.json`·`dataset.jsonld`의 라이선스·출처 설명을 같은 내용으로 맞췄습니다.

## v3.0.0 — 2026-09-06 · 성취기준 전용 리포로 / Standards-only repository

- **교과 간 융합 연결을 [k-curriculum-2022-links](https://github.com/greatsong/k-curriculum-2022-links)로 분리했습니다.** 성취기준은 교육부 원문 verbatim이라 느리게 바뀌는 공공재이고, 연결은 AI가 만들어 모델·정책에 따라 자주 바뀝니다. 둘을 한 리포에 두면 성취기준의 신뢰도가 연결의 불확실성에 묻혀 나눴습니다. 연결 리포는 이 리포의 릴리스 태그에 고정됩니다. / Cross-subject links moved to a separate repository pinned to a release tag of this one.
- 스키마 v3: 행 단위 출처 **`source_book`·`source_doc`** 추가(어느 별책에서 왔는지). `domain`은 v2에서 이미 제거. / Schema v3 adds per-row provenance.
- 배포 형식 추가: `data/standards.csv`(스프레드시트용, BOM), `datapackage.json`(Frictionless), `dataset.jsonld`(schema.org), `llms.txt`(AI 에이전트 진입점). / Added CSV, Frictionless Data Package, schema.org JSON-LD, and llms.txt.
- 문서를 한·영으로: README, SCHEMA, CONTRIBUTING. 행동 강령 추가. / Bilingual docs; code of conduct.
- 건수 6,444 (변동 없음). / 6,444 standards, unchanged.

## v2026.09.06 — 스키마 v2 (성취기준 + 연결 통합 시절)

- 성취기준 5,907 → **6,444**. 교육부 고시 별책 PDF를 파서 19종으로 다시 추출하고 전 필드 결점 게이트(완결성·문장 verbatim·학교급·교과 귀속·영역·해설·고려사항·형식)를 통과한 정본으로 교체.
- 고유 식별자 `key` 도입 — 같은 code가 두 과목에 쓰인 11건([12심독01-01~02-04], [12스문01-01~03]) 구분.
- 연결 관련 변경은 [연결 리포의 CHANGELOG](https://github.com/greatsong/k-curriculum-2022-links/blob/master/CHANGELOG.md)로.

## 2026-07-23

- 필수·선택 교과 누락 복원: 5,739 → 5,907 (영어 초3~중3, 초1-2 통합교과, 중학 환경·보건·진로와 직업, 중학 사회 74).

## 2026-07-14 — 최초 공개

- 성취기준 5,665.
