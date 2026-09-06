# 알려진 문제 · Known Issues

이 데이터셋은 교육부 원문을 기계가 읽게 옮긴 것입니다. 옮기는 과정에서 생길 수 있는 한계를 먼저 공개합니다. 여기 없는 문제를 발견하시면 꼭 알려주세요. / Known limitations of the transcription from the MOE source documents. Please report anything not listed here.

## 1. 원문 대조는 표본과 게이트로 했습니다 (전수 사람 대조는 아님)

2026-09-05에 별책 PDF 19종을 다시 추출하고 8개 게이트(완결성·문장 verbatim·학교급·교과 귀속·영역·해설·고려사항·형식)를 통과한 것만 정본으로 삼았습니다. 별책 PDF 텍스트와의 전수 대조에서 본문 오류 0건이었지만, PDF 텍스트 추출 자체의 잡음(표 셀 줄바꿈, 마침표 누락)은 2차 판정으로 걸렀습니다. 사람이 원문을 눈으로 전수 대조한 것은 아닙니다. / Verified by an automated gate against the PDF text and sampled human checks, not a full manual read.

## 2. 원문에 해설이 없는 성취기준은 `explanation`이 비어 있습니다 (29%)

교육부 문서가 모든 성취기준에 해설을 붙이지는 않습니다. 빈 값은 누락이 아니라 원문에 없는 것입니다. / Empty `explanation` means the source has none.

## 3. 산업수요 맞춤형 전문교과는 `school_level`이 비어 있습니다 (1,993건)

원문 코드가 한글 약어(`[공관 01-01-01]`)라 코드에서 학교급을 읽을 수 없고, 교육부 문서도 학교급을 명시하지 않습니다. `grade_group`은 `기타`입니다. / Vocational subjects have no school level in the source; `grade_group` is `기타`.

## 4. 같은 코드가 두 과목에 쓰인 11건 — 식별자는 `key`

`[12심독01-01]`~`[12심독02-04]` 8건은 「심화 영어 독해와 작문」과 「심화 독일어」에, `[12스문01-01]`~`[12스문01-03]` 3건은 「스포츠 문화」와 「스페인어권 문화」에 같은 코드로 쓰였습니다. 그래서 고유 식별자는 `key`이고, 이 11건 중 한쪽(심화 독일어·스페인어권 문화)만 `"코드|과목"` 형식입니다. **`code`로 조인하면 이 11건이 어긋납니다.** 양쪽 모두 `"코드|과목"`으로 바꾸는 편이 덜 헷갈리지만, 원천 서비스와 함께 바꿔야 해 아직 그대로입니다. / 11 code collisions across subject pairs; the unique identifier is `key`, which takes the form `"code|subject"` for one side of each pair.

## 5. 수식은 유니코드 표준 기호로 복원했습니다

원본 HWP 수식 폰트의 사설영역(PUA) 글리프는 원문 대조로 √, ×, ⁿ, ∼ 같은 유니코드 기호로 바꿨고 현재 PUA 글리프는 0건입니다. 복잡한 수식은 한 줄 텍스트로 평탄화되어 원문 조판과 다를 수 있습니다. / Math glyphs from the HWP private-use area were restored to Unicode; complex formulas are flattened to one line.

## 6. `keywords`는 검색 보조용입니다

본문 앞 어절을 단순 분리한 값이라 의미 분석에는 쓰지 마세요. / Naive tokens; not for semantic analysis.

## 7. 원문의 오탈자·표기 흔들림은 그대로 둡니다

verbatim이 원칙이라 원문의 오탈자, 코드 표기 흔들림(예: 해설의 `[10과탐02-01-03]` vs 본문의 `[10과탐2-01-03]`)은 고치지 않습니다. 원문이 개정되면 따라갑니다. / Source typos are preserved by design.

## 범위 밖 · Out of scope

- 교과 간 융합 연결 — [k-curriculum-2022-links](https://github.com/greatsong/k-curriculum-2022-links)
- 2015 개정 이전 교육과정, 시·도 교육청 재구성 자료
