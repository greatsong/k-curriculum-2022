# 데이터 스키마 (schema v2)

`data/manifest.json`의 `schema_version`이 이 문서의 버전과 같아야 합니다. 스키마가 바뀌면 버전을 올리고 [CHANGELOG](../CHANGELOG.md)에 적습니다.

## 파일

| 파일 | 내용 | 정렬 |
|---|---|---|
| `data/standards.json` | 성취기준 배열 | `key` 오름차순 |
| `data/links.published.json` | 게시 기준을 통과한 융합 연결 | `source_code`+`target_code` |
| `data/links.candidate.json` | AI가 제안했으나 게시 기준에 못 미친 연결 | 위와 같음 |
| `data/manifest.json` | 스키마 버전·출처 커밋·건수·게시 정책 | — |

정렬이 고정돼 있어 두 릴리스를 `diff`로 비교할 수 있습니다.

## 성취기준 (`standards.json`)

| 필드 | 형 | 설명 |
|---|---|---|
| `code` | string | 교육부 고시의 성취기준 코드. 대괄호 포함, 원문 표기 그대로 (`[4과01-01]`, `[12미적Ⅰ-02-03]`, `[공관 01-01-01]`) |
| `key` | string | **고유 식별자.** 기본은 `code`와 같고, 같은 code가 두 과목에 쓰인 항목만 `"code\|subject"` 형식 (아래 참고) |
| `subject_group` | string | 교과군 20종 (국어·수학·사회·과학·… ·산업수요전문) |
| `subject` | string | 과목 292종 |
| `grade_group` | string | 학년군: `초1-2` `초3-4` `초5-6` `중1-3` `고공통` `고선택` `기타` |
| `school_level` | string | `초등학교` `중학교` `고등학교`. **산업수요 전문교과는 빈 문자열** (`grade_group`은 `기타`) |
| `curriculum_category` | string | 공통·일반선택·진로선택·융합선택·선택·전문공통·전공일반·전공실무 |
| `area` | string | 원문의 성취기준 소제목(영역) |
| `content` | string | 성취기준 본문. 고시 원문 verbatim, 줄바꿈 없음, 문장 끝 마침표 |
| `keywords` | string[] | 본문 앞 어절을 단순 분리한 값. 검색 보조용이며 의미 분석에는 부적합 |
| `explanation` | string | 성취기준 해설. 원문에 해설이 있는 경우만 (전체의 71%) |
| `application_notes` | string | 영역 단위 "성취기준 적용 시 고려사항" 전체. 불릿마다 `• ` 접두 |

### `key`가 왜 필요한가

교육부 코드 체계가 과목 간에 겹칩니다. `[12심독01-01]`~`[12심독02-04]` 8건은 「심화 영어 독해와 작문」과 「심화 독일어」에, `[12스문01-01]`~`[12스문01-03]` 3건은 「스포츠 문화」와 「스페인어권 문화」에 같은 코드로 쓰였습니다. 그래서 `code`만으로는 행을 특정할 수 없습니다.

- 겹치지 않는 6,433건은 `key === code`입니다.
- 겹치는 11건 중 **한쪽**(심화 영어 독해와 작문·스포츠 문화)은 `key === code`이고, **다른 쪽**(심화 독일어·스페인어권 문화)만 `"[12심독01-01]|심화 독일어"` 형식입니다.
- 링크의 `source_code`·`target_code`는 **`key` 값**입니다. 성취기준과 조인할 때는 `code`가 아니라 `key`로 맞추세요.
- 맨 코드로 조회하면 한쪽으로 조용히 풀립니다. 코드가 겹치는지 먼저 확인하는 예가 [`examples/find-fusion-partners.mjs`](../examples/find-fusion-partners.mjs)에 있습니다.

## 융합 연결 (`links.*.json`)

| 필드 | 형 | 설명 |
|---|---|---|
| `source_code` | string | 성취기준 `key`. 항상 `source_code < target_code` (유니코드 사전순) |
| `target_code` | string | 성취기준 `key` |
| `link_type` | string | `cross_subject` 같은 현상을 다른 관점으로 · `same_concept` 본질적으로 같은 개념 · `application` 한쪽 개념을 다른 쪽에 적용 · `prerequisite` 선수학습 · `extension` 심화·확장 |
| `rationale` | string | 교사용 근거 2~3문장. 어떤 수업 활동으로 이어지는지 |
| `integration_theme` | string | 융합 주제 한 구절 |
| `lesson_hook` | string | 수업 아이디어 한 문장 |
| `semantic_score` | number | 두 본문 임베딩의 코사인 유사도 (0~1, 실측). 후보 추출에 쓴 값 |
| `quality_score` | number | LLM이 판정한 교육적 품질 (0~1). 0.9 이상 바로 수업 가능, 0.7대 좋은 연결, 0.6 이하 쓸 만한 정도 |
| `generation_method` | string | `ai` |

`prerequisite`·`extension`은 방향이 의미입니다. 저장은 `source < target`로 정규화하므로 **방향은 `rationale`에서 읽으세요** — "A를 익힌 뒤 B로 확장" 같은 서술이 방향입니다.

## 게시 정책 (`manifest.policy`)

| 항목 | 값 | 뜻 |
|---|---|---|
| `published_min_quality` | 0.7 | `quality_score`가 0.7 미만이면 published에 없습니다 |
| `published_excludes_vocational_pairs` | true | 양쪽 모두 산업수요 전문교과(`subject_group === "산업수요전문"`)인 연결은 candidate에만 둡니다. 이 데이터를 만든 서비스의 대상이 일반계 고등학교이기 때문입니다. 한쪽만 전문교과인 연결(예: 금융과 경제생활 ↔ 금융 일반)은 게시합니다 |
| `candidate_excludes_rejected` | true | 재판정에서 떨어진 연결(원본 점수 0.2)은 candidate에도 싣지 않습니다 |

candidate는 **미검토**입니다. 0.7대 4,008건은 검토하면 게시 후보가 될 수 있고, 0.6 이하는 대체로 일반론이거나 범용 기능(사칙연산·워드프로세서·글쓰기)을 아무 대상에나 붙인 연결입니다. 참고·실험용으로만 쓰세요.

## 커버리지 (2026-09-06)

published 연결이 하나 이상 붙은 성취기준은 2,570건(40%)입니다.

| 학교급 | 연결 있음 / 전체 |
|---|---|
| 초등 1-2학년군 | 29 / 100 (29%) |
| 초등 3-4학년군 | 70 / 231 (30%) |
| 초등 5-6학년군 | 117 / 280 (42%) |
| 중학교 | 385 / 714 (54%) |
| 고등 공통 | 144 / 266 (54%) |
| 고등 선택 | 1,672 / 2,860 (58%) |
| 산업수요 전문교과 | 153 / 1,993 (8%) |

연결이 하나도 없는 보통교과 과목은 12개입니다 — 제2외국어 회화 6과목(일본어·중국어·프랑스어·러시아어·베트남어·스페인어), 심화 독일어·생활 독일어·생활 프랑스어·생활 러시아어·러시아어, 그리고 체육의 스포츠 문화. 2026-09-06에 상대 과목을 지리·역사·문학·진로로 한정한 후보 추출로 제2외국어 16과목에 연결을 만들었고, 남은 12과목은 0.7대 후보만 있어 사람 검토가 필요합니다([이슈 #1](../../issues/1)).

## 출처 표기

성취기준 원문의 저작권 원천은 교육부(2022 개정 교육과정 고시)입니다. 재이용할 때 이 저장소와 함께 교육부 출처를 표기해 주세요. 원문은 국가교육과정정보센터(<https://ncic.re.kr>)에서 볼 수 있습니다.
