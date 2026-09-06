# k-curriculum-2022

> **2022 개정 교육과정 성취기준 + 교과 간 융합 연결 그래프**
> 오픈 데이터셋 · 추출 알고리즘 · 융합수업 설계를 위한 지식 그래프

[![Data License: CC BY 4.0](https://img.shields.io/badge/data-CC%20BY%204.0-blue.svg)](./LICENSE-DATA)
[![Code License: MIT](https://img.shields.io/badge/code-MIT-green.svg)](./LICENSE)
[![validate data](https://github.com/greatsong/k-curriculum-2022/actions/workflows/validate.yml/badge.svg)](https://github.com/greatsong/k-curriculum-2022/actions/workflows/validate.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

한국 2022 개정 교육과정의 **성취기준 6,444개**와, 서로 다른 교과의 성취기준을
**융합 관점으로 잇는 연결 3,874개**를 담은 공개 데이터셋입니다. 연결을 만들어낸
**추출 알고리즘**(임베딩 후보 추출 → LLM 판정)도 함께 공개합니다.

교사·연구자·에듀테크 개발자가 **융합(교과 통합) 교육**을 하는 데 조금이라도 도움이
되었으면 하는 마음에 작업한 결과물을, 저의 **첫 오픈소스 프로젝트**로 공개합니다.

## 이 데이터로 할 수 있는 것

- **교사** — 자신의 교과 성취기준 하나를 선택하면, 다른 교과 성취기준 중 한 수업으로 연결되는 항목과 그 근거, 융합 주제, 수업 아이디어를
  바로 확인할 수 있습니다.
- **연구자** — 성취기준 6,444개를 점, 연결 3,874개를 선으로 구성한 그래프입니다. 교과 간 거리, 학교급 간 계열성, 융합 주제의
  분포를 계산할 수 있습니다.
- **개발자** — JSON 세 파일과 스키마 문서만 있으면 됩니다. 의존성 없이 읽을 수 있고, 정렬이 고정되어 있어 릴리스 간 차이를
  `diff`로 확인할 수 있습니다.

---

## 데이터 규모

| 파일 | 내용 | 규모 |
|------|------|------|
| [`data/standards.json`](./data/standards.json) | 성취기준 (2022 개정) | **6,444개** / 292과목 / 20교과군 |
| [`data/links.published.json`](./data/links.published.json) | 게시 기준을 통과한 융합 연결 | **3,874개** (quality ≥ 0.70, 평균 0.83) |
| [`data/links.candidate.json`](./data/links.candidate.json) | AI가 제안했으나 미검토인 연결 | **11,088개** (0.7대 4,008 · 품질 편차 큼) |
| [`data/manifest.json`](./data/manifest.json) | 스키마 버전 · 출처 커밋 · 건수 · 게시 정책 | schema v2 |

건수는 `manifest.json`이 정본이고, CI가 실제 파일과 대조합니다. 필드 하나하나의 뜻은
**[docs/SCHEMA.md](./docs/SCHEMA.md)**, 의도된 용도와 한계는 [data/DATACARD.md](./data/DATACARD.md)에 있습니다.

## 빠른 시작

```bash
git clone https://github.com/greatsong/k-curriculum-2022.git
cd k-curriculum-2022
node examples/find-fusion-partners.mjs "[6실05-05]"   # 이 성취기준과 이어지는 다른 교과 성취기준
node scripts/validate.mjs                              # 데이터 무결성 검사
```

```js
import standards from './data/standards.json' with { type: 'json' }
import links from './data/links.published.json' with { type: 'json' }

// 식별자는 code가 아니라 key입니다 (같은 코드가 두 과목에 쓰인 11건 때문) — docs/SCHEMA.md
const byKey = Object.fromEntries(standards.map((s) => [s.key, s]))
const key = '[6실05-05]'
const partners = links
  .filter((l) => l.source_code === key || l.target_code === key)
  .map((l) => {
    const other = byKey[l.source_code === key ? l.target_code : l.source_code]
    return { 과목: other.subject, 성취기준: other.content, 융합주제: l.integration_theme, 수업아이디어: l.lesson_hook }
  })
console.log(partners)
```

## 데이터 구조

**성취기준** (`standards.json`의 각 항목)
```jsonc
{
  "code": "[4과01-01]",            // 교육부 고시의 성취기준 코드, 원문 표기 그대로
  "key": "[4과01-01]",             // 고유 식별자. 코드가 두 과목에 겹치는 11건만 "코드|과목" 형식
  "subject": "과학",
  "subject_group": "과학",
  "grade_group": "초3-4",           // 초1-2 / 초3-4 / 초5-6 / 중1-3 / 고공통 / 고선택 / 기타
  "school_level": "초등학교",       // 산업수요 전문교과는 빈 문자열
  "curriculum_category": "공통",
  "area": "힘과 우리 생활",
  "content": "일상생활에서 힘과 관련된 현상에 …",   // 고시 원문 verbatim
  "keywords": ["일상생활", "관찰", …],
  "explanation": "…",              // 성취기준 해설 (원문에 있는 경우, 71%)
  "application_notes": "• …"       // 영역 단위 적용 시 고려사항
}
```

**융합 연결** (`links.*.json`의 각 항목)
```jsonc
{
  "source_code": "[4과01-01]",      // 성취기준 key. 항상 source_code < target_code
  "target_code": "[4수02-03]",
  "link_type": "cross_subject",     // cross_subject / same_concept / application / prerequisite / extension
  "rationale": "두 성취기준이 …로 연결되는 근거 (교사용 2~3문장)",
  "integration_theme": "힘과 측정",
  "lesson_hook": "물체를 밀고 당기며 …",
  "semantic_score": 0.71,           // 임베딩 코사인 유사도 (실측)
  "quality_score": 0.85,            // LLM이 판정한 교육적 품질
  "generation_method": "ai"
}
```

---

## ⚠️ 먼저 읽어주세요 — 이 데이터는 완벽하지 않습니다

이 데이터셋은 공공 고시 원문을 파싱하고, 교과 간 연결은 **AI로 생성**했습니다.
그 과정에서 **오류가 남아 있을 수 있습니다** — 성취기준 본문의 미세한 손상,
억지스러운 연결, 학년군 표기 불일치 등. 알려진 문제는 [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)에
투명하게 정리해 두었습니다.

**오류를 발견하면 묻어두지 말고 알려주세요.** 이 프로젝트는 커뮤니티의 교정으로
좋아지는 것을 전제로 설계했습니다.

- 🐛 **오류 신고**: [이슈 열기](../../issues/new/choose) (성취기준 오류 / 억지 연결 신고 템플릿 제공)
- 🔧 **직접 고치기**: [PR 보내기](./CONTRIBUTING.md) — 단 한 글자 수정도 환영합니다

**지금 상태를 숫자로 적어 둡니다.** 성취기준 본문은 2026년 9월에 교육부 고시 별책 PDF에서 다시 추출해 전 필드 검사를 통과한
것이므로, 깨진 수식·잘린
문장·해설 혼입은 0건입니다. 연결은 다릅니다. published 연결이 하나라도 붙은 성취기준은 2,535개(39%)이고, 학교급별로 보면 초등 1-2학년군
24%, 초등 3-4학년군 30%, 중학교 53%, 고등학교 57%입니다. 제2외국어 계열 28개 과목에는 연결이 하나도 없습니다. 게시된 연결 3,874개는 전부
근거·융합 주제·수업 아이디어를 갖추고 있으며, 무작위 표본과 가장 약한 꼬리(유사도 0.2 이하)를 사람이 읽어 억지 연결이 아님을 확인했습니다. 다만 "AI가
판정한 것"이라는 한계는 그대로입니다.

---

## 📄 원문 대조는 이렇게 하세요

이 데이터셋의 성취기준은 아래 **교육부 원문**을 파싱·정제한 것입니다. 값에 의문이
들면 언제든 원문과 대조해 주세요.

- **원문 출처**: 교육부 고시 제2022-33호 「초·중등학교 교육과정」 (2022.12.22)
  및 교과별 각론 고시
- **원문 열람**: 국가교육과정정보센터(NCIC) <https://ncic.re.kr>

원문 파일(PDF·HWP)은 이 저장소에 **재호스팅하지 않습니다.** 교육부/NCIC를 언제나
최신·정본으로 두고, 이 저장소는 원문 링크와 그 파싱 결과만 관리합니다.

> 이 원문을 *기계가 읽도록* 만드는 일이 왜 그토록 어려웠는지는
> [프로젝트 이야기의 부록](./docs/NARRATIVE.md#부록--교육부-원문-데이터의-파싱-난점)과
> [교육부에 드리는 제언](./docs/NARRATIVE.md#차기-교육과정-데이터에-드리는-제언-초안)에서
> 실제 사례로 설명합니다.

## 어떻게 만들었나

찾는 일과 판단하는 일을 분리했습니다. 후보는 성취기준 본문의 임베딩 유사도로 좁힙니다. 이 과정은 계산이므로 여러 번 실행해도 결과가 같습니다.
그다음 후보만
AI에 보여 교육적으로 타당한지 판정하게 했습니다. AI는 성취기준을 번호로만 가리킬 수 있으므로 없는 코드를 만들어 낼 수 없습니다. 판정 점수가 0.7 이상인
연결만 게시합니다.

배경과 원칙, 재현용 명세, 작업하며 배운 내용은 **[docs/NARRATIVE.md](./docs/NARRATIVE.md)**에 있습니다. 실행
코드는 [`algorithm/`](./algorithm)에 있습니다.

## 버전과 갱신

- **무엇이 언제 바뀌었나** — [CHANGELOG.md](./CHANGELOG.md). 데이터 릴리스는 날짜로 구분합니다. 스키마가 바뀌면
  `manifest.json`의 `schema_version`이 올라갑니다.
- **이 파일이 어디서 왔나** — `manifest.json`의 `source.commit`은 데이터를 뽑은 원천 서비스의 커밋입니다. 같은
  커밋에서 다시 뽑으면 같은 파일이 나옵니다.
- **깨지지 않았나** — PR마다 [GitHub Actions](./.github/workflows/validate.yml)가
  `scripts/validate.mjs`를 실행하여 식별자 고유성, 링크의 참조 무결성, 점수 범위를 검사합니다. manifest의 건수와 실제
  파일을 대조합니다. 실패하면 머지가 막힙니다.
- **다시 뽑으려면** — 원천은
  [curriculum-weaver](https://github.com/greatsong/curriculum-weaver)의 정본 성취기준과
  `curriculum_links` 테이블입니다. 수출 명령과 순서는
  [CONTRIBUTING.md](./CONTRIBUTING.md#데이터를-새로-뽑을-때-관리자용)에 있습니다.

## 로드맵

이 데이터셋은 진행 중입니다. 남은 과제를 숫자와 함께 적어 둡니다. 각 항목은 이슈로도 열려 있고, **함께 해주실 분을 찾습니다.**

- [ ] **제2외국어 연결 0건 해소** — 독일어·러시아어·베트남어·스페인어 계열 28개 과목에 published 연결이 없습니다. 임베딩 유사도만으로는 후보에 들지 못하므로, 과목쌍별로 상위 N쌍을 보장하는 후보 추출이 필요합니다.
- [ ] **초등 1-2학년군 커버리지** — 100개 중 24개만 연결이 있습니다. 통합교과(바른 생활·슬기로운 생활·즐거운 생활)가 다른 교과와 어떻게 이어지는지는 별도 판정 프롬프트가 필요합니다.
- [ ] **candidate 0.7대 4,008건 검토** — 사람이 읽고 published로 올릴 후보입니다. 검토 결과를 되먹여 판정 기준을 정교화합니다.
- [ ] **전문교과 연결의 별도 배포** — 산업수요 전문교과끼리의 연결 1,318건은 일반고 대상 정책으로 candidate에만 있습니다. 특성화고 맥락에서 쓰려면 별도 게시 기준이 필요합니다.
- [ ] **`key` 규약 단순화** — 겹치는 코드 11건 중 한쪽만 `"코드|과목"`인 현재 규약은 헷갈립니다. 양쪽 모두 명시하는 쪽으로 바꾸려면 원천 서비스와 함께 바꿔야 합니다.
- [ ] **표준 포맷 export** — RDF/JSON-LD, Neo4j import, CSV
- [ ] **다국어 필드** — 영문 요약/키워드

## 라이선스

- **데이터** (`data/`): [CC BY 4.0](./LICENSE-DATA) — 출처 표시 후 자유 이용.
  성취기준 원문의 저작권 원천은 **교육부(2022 개정 교육과정 고시)** 이며, 재이용 시
  교육부 출처를 함께 표기해 주세요.
- **코드** (`algorithm/`, `examples/`, `scripts/`): [MIT](./LICENSE)

## 인용

연구·출판에 사용하실 때는 [CITATION.cff](./CITATION.cff)를 참고해 인용해 주세요.

## 기여

모든 규모의 기여를 환영합니다 — 오타 하나부터 알고리즘 개선까지.
[CONTRIBUTING.md](./CONTRIBUTING.md)에서 시작하세요.

---

<sub>이 데이터셋은 융합수업 협력 설계 플랫폼 **curriculum-weaver** 프로젝트에서
추출·정리되었습니다. 한국 융합교육 생태계의 공동 자산이 되기를 바랍니다.</sub>
