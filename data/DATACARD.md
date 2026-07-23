# 데이터 카드 (Data Card)

## 개요
2022 개정 교육과정 성취기준과, 서로 다른 교과의 성취기준을 잇는 융합 연결.
융합(교과 통합) 수업 설계와 교육과정 지식 그래프 연구를 위한 데이터셋.

## 파일

| 파일 | 항목 수 | 설명 |
|------|--------|------|
| `standards.json` | 5,907 | 성취기준 (2022 개정) |
| `links.published.json` | 3,927 | 검토·정제된 융합 연결 (quality_score ≥ 0.70) |
| `links.candidate.json` | 10,351 | AI 제안 연결 (미검토, 품질 편차 큼) |

## 성취기준 필드 (`standards.json`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `code` | string | 성취기준 코드. 대괄호 포함(예: `[4과01-01]`). **고유 식별자.** |
| `subject` | string | 과목명 |
| `subject_group` | string | 교과(군) |
| `grade_group` | string | 학년군: `초1-2` `초3-4` `초5-6` `중1-3` `고공통` `고선택` `기타` |
| `school_level` | string | 학교급: `초등학교` `중학교` `고등학교` (빈 값 다수 — 아래 한계) |
| `curriculum_category` | string | `공통` `선택` 등 |
| `area` / `domain` | string | 영역/내용 영역 (있는 경우) |
| `content` | string | 성취기준 본문 |
| `keywords` | string[] | 추출 키워드 |
| `explanation` | string | 성취기준 해설 (있는 경우) |
| `application_notes` | string | 적용 시 고려사항 (있는 경우) |

## 연결 필드 (`links.*.json`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `source_code` / `target_code` | string | 연결된 두 성취기준 코드. **`source_code < target_code` 정규화(사전순).** |
| `link_type` | string | `cross_subject`(교과 간) `same_concept`(동일 개념) `application`(응용) `prerequisite`(선수) `extension`(확장) |
| `rationale` | string | 연결 근거 |
| `integration_theme` | string | 융합 주제 (예: "에너지와 환경") |
| `lesson_hook` | string | 수업 아이디어 한 줄 |
| `semantic_score` | number | 임베딩 코사인 유사도 (0~1, 실측) |
| `quality_score` | number | LLM 판정 교육적 품질 (0~1) |
| `generation_method` | string | 생성 방법 (주로 `ai`) |

## 생성 방법

- **성취기준**: 교육부 「2022 개정 교육과정」 고시 문서(HWP/xlsx)를 파싱·정제.
  누락 과목(지리·역사·경제·제2외국어 등 811개)은 원문 대조로 복원.
  중학교 「사회」(지리·일반사회) 74개는 2026-07 별책7 표 셀 재파싱으로 추가(→ KNOWN_ISSUES 9).
  2026-07-23 완결성 복원 168개 추가(→ KNOWN_ISSUES 10): 영어 초3~중3 61(별책14),
  통합교과 바른/슬기로운/즐거운 생활 48(별책2), 중학 선택 환경·보건·진로와 직업 59(별책18 표 셀).
  이와 함께 신규 성취기준용 융합 연결 1,677개 생성(published 475).
- **연결**: 2단계 파이프라인 — ① 성취기준 임베딩의 코사인 유사도로 후보쌍을
  결정적으로 추출 → ② LLM(claude-sonnet-5)이 인덱스 참조 방식으로 교육적 타당성을
  판정하고 품질 점수·융합 주제·수업 아이디어 생성. 코드는 [`../algorithm/`](../algorithm) 참고.
- **게시 정책**: `quality_score ≥ 0.70`만 `published`. 그 미만은 `candidate`.

## 학년군 정규화 (공개본 적용)
정본에 혼재하던 오염 표기를 표준 학년군으로 통일했습니다(총 894건):
`초2`→`초1-2`, `초4`→`초3-4`, `초6`→`초5-6`, `중1~3`→`중1-3`.

**정규화 후 `grade_group` 분포**
| 학년군 | 수 |
|--------|-----|
| 고선택 | 2,826 |
| 기타(전문교과 등) | 1,490 |
| 중1-3 | 634 |
| 고공통 | 266 |
| 초5-6 | 260 |
| 초3-4 | 211 |
| 초1-2 | 52 |

## 한계 (요약 — 전체는 [KNOWN_ISSUES.md](../KNOWN_ISSUES.md))
- 성취기준 본문에 파싱 잔존 손상 가능(특히 `explanation`).
- `school_level` 빈 값 2,797개(전문교과·고등 선택 등).
- 1~2학년군은 국어·수학 2개 교과 52개뿐(통합교과 미포함).
- 모든 연결은 AI 생성 — `published`에도 억지 연결이 있을 수 있음.
- `candidate`는 미검토, 품질 편차 큼.

## 무결성 검증
```bash
node scripts/validate.mjs
```
코드 형식·중복·링크 정규화·참조 무결성(dangling)·점수 범위를 검사합니다.

## 라이선스
데이터 [CC BY 4.0](../LICENSE-DATA) (성취기준 원문 출처: 교육부 2022 개정 교육과정).
