# k-curriculum-2022

> **2022 개정 교육과정 성취기준 + 교과 간 융합 연결 그래프**
> 오픈 데이터셋 · 추출 알고리즘 · 융합수업 설계를 위한 지식 그래프

[![Data License: CC BY 4.0](https://img.shields.io/badge/data-CC%20BY%204.0-blue.svg)](./LICENSE-DATA)
[![Code License: MIT](https://img.shields.io/badge/code-MIT-green.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

한국 2022 개정 교육과정의 **성취기준 5,665개**와, 서로 다른 교과의 성취기준을
**융합 관점으로 잇는 연결 3,452개**를 담은 공개 데이터셋입니다. 연결을 만들어낸
**추출 알고리즘**(임베딩 후보 추출 → LLM 판정)도 함께 공개합니다.

교사·연구자·에듀테크 개발자가 **융합(교과 통합) 수업**을 설계하고, 교육과정을
지식 그래프로 다루는 데 쓰라고 만들었습니다.

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

> "지금 이 그래프가 최종본이라고 생각하지 않습니다. AI가 좋아질수록 연결은 더
> 정교해질 것이고, 그 여정을 공개된 채로 함께 걷고 싶습니다."

---

## 데이터 규모

| 파일 | 내용 | 규모 |
|------|------|------|
| [`data/standards.json`](./data/standards.json) | 성취기준 (2022 개정) | **5,665개** / 270여 과목 |
| [`data/links.published.json`](./data/links.published.json) | 검토·정제된 융합 연결 | **3,452개** (quality ≥ 0.70, 평균 0.83) |
| [`data/links.candidate.json`](./data/links.candidate.json) | AI 제안 연결 (미검토) | **9,149개** (품질 편차 큼) |

필드 정의·생성 방법·한계는 **[데이터 카드](./data/DATACARD.md)** 참고.

## 빠른 시작

```bash
git clone https://github.com/greatsong/k-curriculum-2022.git
cd k-curriculum-2022
```

```js
// 성취기준 로드
import standards from './data/standards.json' assert { type: 'json' }
import links from './data/links.published.json' assert { type: 'json' }

// 예: 특정 성취기준과 융합 가능한 상대 교과 성취기준 찾기
const code = '[6실05-05]'
const byCode = Object.fromEntries(standards.map(s => [s.code, s]))
const partners = links
  .filter(l => l.source_code === code || l.target_code === code)
  .map(l => {
    const other = l.source_code === code ? l.target_code : l.source_code
    return { 성취기준: byCode[other]?.content, 융합주제: l.integration_theme, 수업아이디어: l.lesson_hook }
  })
console.log(partners)
```

더 많은 예시는 [`examples/`](./examples) 참고.

## 데이터 구조

**성취기준** (`standards.json`의 각 항목):
```jsonc
{
  "code": "[4과01-01]",           // 성취기준 코드 (2022 개정 표기, 대괄호 포함)
  "subject": "과학",
  "subject_group": "과학",
  "grade_group": "초3-4",          // 학년군 (초1-2 / 초3-4 / 초5-6 / 중1-3 / 고공통 / 고선택 / 기타)
  "school_level": "초등학교",
  "curriculum_category": "공통",
  "content": "일상생활에서 힘과 관련된 현상에…",  // 성취기준 본문
  "keywords": ["일상생활", "관찰", …],
  "explanation": "…",             // 성취기준 해설 (있는 경우)
  "application_notes": "…"         // 적용 시 고려사항 (있는 경우)
}
```

**융합 연결** (`links.*.json`의 각 항목):
```jsonc
{
  "source_code": "[4과01-01]",
  "target_code": "[4수02-03]",
  "link_type": "cross_subject",    // cross_subject / same_concept / application / prerequisite / extension
  "rationale": "두 성취기준이 …로 연결되는 근거",
  "integration_theme": "힘과 측정",  // 융합 주제
  "lesson_hook": "물체를 밀고 당기며 …",  // 수업 아이디어 한 줄
  "semantic_score": 0.71,          // 임베딩 코사인 유사도 (0~1, 실측)
  "quality_score": 0.85,           // LLM 판정 교육적 품질 (0~1)
  "generation_method": "ai"
}
```

## 추출 알고리즘

교과 간 연결이 어떻게 만들어졌는지 — **2단계 파이프라인**의 참조 구현을
[`algorithm/`](./algorithm)에 공개했습니다.

1. **후보 추출 (결정적)**: 성취기준 임베딩의 코사인 유사도로 top-k 후보쌍 추출
2. **LLM 판정**: 후보를 *인덱스 번호로만* 참조시켜 코드 할루시네이션을 원천 차단,
   교육적 타당성·품질 점수·융합 주제·수업 아이디어를 생성

자세한 방법과 실행법은 [algorithm/README.md](./algorithm/README.md) 참고.

## 로드맵 — 아직 안 된 것들

이 데이터셋은 진행 중입니다. 솔직하게 남은 과제를 적어둡니다.

- [ ] **학년군 표기 완전 정규화** — 일부 학년군이 오염 표기(`초2`→`초1-2` 등)에서
      정규화됐으나, 근본 원인인 원본 파싱 파이프라인 정비는 미완 ([KNOWN_ISSUES](./KNOWN_ISSUES.md))
- [ ] **성취기준 본문 잔존 손상 교정** — 해설/적용사항 혼입(explanation bleed) 등 일부 잔존
- [ ] **1~2학년군 확충** — 현재 국어·수학만 존재. 통합교과(바슬즐)·안전한생활 미포함
- [ ] **전문교과("기타" 1,490개) 메타데이터 보강** — school_level·학년군 미표기 다수
- [ ] **candidate 링크 검토 승격** — 9,149개 미검토 연결의 커뮤니티 리뷰
- [ ] **다국어 필드** — 영문 요약/키워드
- [ ] **표준 포맷 export** — RDF/JSON-LD, Neo4j import, CSV

각 항목은 이슈로도 열려 있습니다. **함께 해주실 분을 찾습니다.**

## 라이선스

- **데이터** (`data/`): [CC BY 4.0](./LICENSE-DATA) — 출처 표시 후 자유 이용.
  성취기준 원문의 저작권 원천은 **교육부(2022 개정 교육과정 고시)** 이며, 재이용 시
  교육부 출처를 함께 표기해 주세요.
- **코드** (`algorithm/`, `examples/`): [MIT](./LICENSE)

## 인용

연구·출판에 사용하실 때는 [CITATION.cff](./CITATION.cff)를 참고해 인용해 주세요.

## 기여

모든 규모의 기여를 환영합니다 — 오타 하나부터 알고리즘 개선까지.
[CONTRIBUTING.md](./CONTRIBUTING.md)에서 시작하세요.

---

<sub>이 데이터셋은 융합수업 협력 설계 플랫폼 **curriculum-weaver** 프로젝트에서
추출·정리되었습니다. 한국 융합교육 생태계의 공동 자산이 되기를 바랍니다.</sub>
