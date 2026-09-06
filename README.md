# k-curriculum-2022

> **2022 개정 교육과정 성취기준 6,444건 — 교육부 고시 원문 그대로, 기계가 읽는 형식으로**
> *Korea's 2022 Revised National Curriculum achievement standards, verbatim and machine-readable.* [English README](./README.en.md)

[![Data: CC BY 4.0](https://img.shields.io/badge/data-CC%20BY%204.0-blue.svg)](./LICENSE-DATA)
[![Code: MIT](https://img.shields.io/badge/code-MIT-green.svg)](./LICENSE)
[![validate data](https://github.com/greatsong/k-curriculum-2022/actions/workflows/validate.yml/badge.svg)](https://github.com/greatsong/k-curriculum-2022/actions/workflows/validate.yml)
[![Release](https://img.shields.io/github/v/release/greatsong/k-curriculum-2022)](https://github.com/greatsong/k-curriculum-2022/releases)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

대한민국 교육부가 고시한 2022 개정 교육과정의 성취기준 6,444건 전부를, 교육부 별책 PDF 원문 그대로 구조화한 공개 데이터셋입니다.
초등학교부터 고등학교 선택과목과 전문교과까지 292과목·20교과군을 담으며, 행마다 어느 별책에서 왔는지 출처를 적었습니다. 교육과정을 다루는 도구를
만들거나 연구하는 누구나 이 파일을 표준 사본으로 쓸 수 있도록 유지합니다.

교과 간 융합 연결(AI 생성)은 이 리포지토리에 포함하지 않습니다. 별도 스핀오프 **[k-curriculum-2022-links](https://github.com/greatsong/k-curriculum-2022-links)**에 있으며, 그
리포지토리는 이 리포지토리의 릴리스 태그에 고정됩니다. 성취기준은 원문이 바뀔 때만 바뀌는 공공재이고, 연결은 모델과 정책에 따라 자주 바뀌는
실험이므로 둘을 분리합니다.

## 원문 · Source

성취기준의 저작권 원천은 **대한민국 교육부**이며, 이 데이터셋은 아래 고시 문서를 옮긴 것입니다. 값에 의문이 들면 언제든 원문과 대조해 주세요. 원문 파일(PDF·HWP)은 이 저장소에 재호스팅하지 않습니다.

- **고시**: 교육부 고시 제2022-33호 「초·중등학교 교육과정」(2022.12.22.) 및 교과별 각론 별책. 고등학교 교양 교과는 국가교육위원회 고시 제2024-3호(2024.08.16.) 수정본.
- **원문 열람**: 국가교육과정정보센터(NCIC) <https://ncic.re.kr> → 교육과정 자료실 → 2022 개정 교육과정 → 별책 번호로 찾기.
- **행 단위 출처**: 각 행의 `source_book`(별책 번호)·`source_doc`(문서 제목)이 대조할 문서를 가리킵니다.

| 별책 | 문서 | 건수 |
|---|---|---|
| 별책2 | 초등학교 교육과정 | 431 |
| 별책5 | 국어과 교육과정 | 170 |
| 별책6 | 도덕과 교육과정 | 79 |
| 별책7 | 사회과 교육과정 | 365 |
| 별책8 | 수학과 교육과정 | 314 |
| 별책9 | 과학과 교육과정 | 371 |
| 별책10 | 실과(기술·가정)/정보과 교육과정 | 320 |
| 별책11 | 체육과 교육과정 | 148 |
| 별책12 | 음악과 교육과정 | 76 |
| 별책13 | 미술과 교육과정 | 75 |
| 별책14 | 영어과 교육과정 | 270 |
| 별책16 | 제2외국어과 교육과정 | 607 |
| 별책17 | 한문과 교육과정 | 45 |
| 별책18 | 중학교 선택 교과 교육과정 | 59 |
| 별책19 | 고등학교 교양 교과 교육과정 | 155 |
| 별책20 | 과학 계열 선택 과목 교육과정 | 389 |
| 별책21 | 체육 계열 선택 과목 교육과정 | 91 |
| 별책22 | 예술 계열 선택 교과 교육과정 | 486 |
| 별책23 | 경영·금융 전문 교과 교육과정 | 1,993 |

## 데이터 · Data

| 파일 | 형식 | 설명 |
|---|---|---|
| [`data/standards.json`](./data/standards.json) | JSON 배열 (14 MB) | **정본.** `key` 오름차순 정렬 |
| [`data/standards.csv`](./data/standards.csv) | CSV, UTF-8 BOM (12 MB) | 스프레드시트용 파생본. Excel·Numbers·Google Sheets에서 바로 열림 |
| [`data/manifest.json`](./data/manifest.json) | JSON | 스키마 버전, 출처 커밋, 건수, 식별자 규약 |
| [`datapackage.json`](./datapackage.json) | Frictionless Data Package | 필드 형·제약·출처·라이선스를 기계가 읽는 형식으로 |
| [`dataset.jsonld`](./dataset.jsonld) | schema.org Dataset | 데이터셋 검색 엔진용 메타데이터 |
| [`llms.txt`](./llms.txt) | 텍스트 | AI 에이전트용 진입점: 파일 위치와 지켜야 할 불변식 |

**규모** — 성취기준 6,444 · 과목 292 · 교과군 20. 학교급별 초 611 · 중 714 · 고 3,126 · 산업수요 전문교과 1,993. 건수의 정본은 `manifest.json`이고 CI가 파일과 대조합니다.

## 사용 방법 · Usage

**내려받기** — 릴리스 페이지에서 `standards.json`·`standards.csv`를 받거나, 특정 버전을 URL로 고정합니다.

```bash
curl -LO https://raw.githubusercontent.com/greatsong/k-curriculum-2022/v3.0.0/data/standards.json
```

**JavaScript**

```js
import standards from './data/standards.json' with { type: 'json' }

// 식별자는 code가 아니라 key입니다 (같은 코드가 두 과목에 쓰인 11건 때문)
const byKey = new Map(standards.map((s) => [s.key, s]))
console.log(byKey.get('[6실05-05]').content)

// 예: 중학교 과학의 성취기준을 영역별로 세기
const count = {}
for (const s of standards) if (s.subject === '과학' && s.school_level === '중학교') count[s.area] = (count[s.area] ?? 0) + 1
console.log(count)
```

**Python**

```python
import pandas as pd
df = pd.read_json("data/standards.json")          # 또는 pd.read_csv("data/standards.csv")
df[df.subject == "수학"].groupby("grade_group").size()
```

**스프레드시트** — `data/standards.csv`를 그대로 여세요. `keywords` 열은 `;`로 구분돼 있습니다.

**검증** — 파일을 고쳤다면 `node scripts/validate.mjs`가 형식·`key` 고유성·필수 필드·학년군 값·manifest 건수를 검사합니다.

## 데이터 구조 · Schema

```jsonc
{
  "code": "[4과01-01]",              // 교육부 고시의 성취기준 코드, 원문 표기 그대로
  "key": "[4과01-01]",               // 고유 식별자. 코드가 두 과목에 겹치는 11건만 "코드|과목"
  "subject_group": "과학",           // 교과군 (20)
  "subject": "과학",                 // 과목 (292)
  "school_level": "초등학교",        // 초등학교·중학교·고등학교. 산업수요 전문교과는 빈 문자열
  "grade_group": "초3-4",            // 초1-2 / 초3-4 / 초5-6 / 중1-3 / 고공통 / 고선택 / 기타
  "curriculum_category": "공통",     // 공통·일반선택·진로선택·융합선택·선택·전문공통·전공일반·전공실무
  "area": "힘과 우리 생활",          // 원문의 성취기준 소제목(영역)
  "content": "일상생활에서 힘과 관련된 현상에 …",   // 성취기준 본문, 원문 verbatim
  "keywords": ["일상생활", "관찰", …],            // 검색 보조용 단순 토큰
  "explanation": "…",                // 성취기준 해설 (원문에 있는 경우, 71%)
  "application_notes": "• …",        // 영역 단위 적용 시 고려사항
  "source_book": "별책9",            // 이 행이 실린 별책
  "source_doc": "[별책9] 과학과 교육과정"   // 원문 문서 제목 (NCIC에서 이 제목으로 열람)
}
```

필드 하나하나의 뜻과 값의 범위는 **[docs/SCHEMA.md](./docs/SCHEMA.md)** ([English](./docs/SCHEMA.en.md)), 의도된 용도와 한계는 [data/DATACARD.md](./data/DATACARD.md)에 있습니다.

## 얼마나 믿을 수 있나 · Quality

본문은 2026년 9월에 별책 PDF 19종을 별책별 파서로 다시 추출했습니다. 완결성, 문장 verbatim, 학교급, 교과 귀속, 영역, 해설,
고려사항, 형식의 8개 게이트를 전부 통과한 것만 정본으로 삼았습니다. 별책 PDF 텍스트와의 전수 대조에서 본문 오류는 0건이며, 수식의 깨진
글리프도 0건입니다. 다만 사람이 원문을 눈으로 전수 대조한 것은 아닙니다. 원문에 해설이 없는 29%는 `explanation`이 비어 있습니다.
알려진 한계는 [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)에 전부 적어 두었습니다. 원문의 오탈자는 원문 그대로 둡니다.

## 버전과 갱신 · Versioning

- 릴리스는 `vX.Y.Z`로 태그하고 [Releases](https://github.com/greatsong/k-curriculum-2022/releases)에 `standards.json`·`standards.csv`를 첨부합니다. 스키마가 바뀌면 `manifest.json`의 `schema_version`이 올라갑니다.
- 바뀐 것은 [CHANGELOG.md](./CHANGELOG.md)에 있습니다. 정렬이 고정돼 있어 두 릴리스를 `diff`로 비교할 수 있습니다.
- PR마다 [GitHub Actions](./.github/workflows/validate.yml)가 검증 스크립트와 CSV 일치 검사를 돌립니다. 실패하면 머지가 막힙니다.
- 원천은 [curriculum-weaver](https://github.com/greatsong/curriculum-weaver)의 정본이며, 다시 뽑는 절차는 [CONTRIBUTING.md](./CONTRIBUTING.md#데이터를-새로-뽑을-때-관리자용)에 있습니다.

## 기여 · Contributing

원문과 다른 곳을 찾으셨다면 그것이 가장 큰 기여입니다. [이슈](../../issues/new/choose)로 알려 주시거나, `data/standards.json`을 고쳐 PR을 보내 주세요. 기준은 하나입니다 — **원문과 대조해 다르면 고치고, 같으면 그대로 둡니다.** 절차와 규칙은 [CONTRIBUTING.md](./CONTRIBUTING.md), 행동 강령은 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)에 있습니다.

## 라이선스 · License

- **데이터** (`data/`): [CC BY 4.0](./LICENSE-DATA). 재이용 시 이 저장소와 함께 원문 출처를 표기해 주세요 — 교육부 고시 제2022-33호 「초·중등학교 교육과정」(2022. 12. 22.) 및 교과별 각론 별책.
- **코드** (`scripts/`): [MIT](./LICENSE)

## 인용 · Citation

[CITATION.cff](./CITATION.cff)를 참고해 주세요. GitHub의 "Cite this repository" 버튼으로 BibTeX·APA 형식을 바로 받을 수 있습니다.

## 더 읽을 것

- [docs/NOTES.md](./docs/NOTES.md) — 교육부 원문을 기계가 읽게 만들며 겪은 어려움과, 다음 교육과정 데이터에 드리는 제언
- [k-curriculum-2022-links](https://github.com/greatsong/k-curriculum-2022-links) — 이 성취기준 사이의 교과 간 융합 연결(AI 생성, 스핀오프)

---

<sub>이 데이터셋은 융합수업 협력 설계 플랫폼 **curriculum-weaver**를 만들며 정리한 것입니다. 공교육이 만든 교육과정 데이터가 공공재답게 널리, 오래, 정확하게 재사용되기를 바랍니다.</sub>
