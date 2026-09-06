# 기여 가이드 (Contributing)

**환영합니다.** 이 데이터셋은 커뮤니티의 교정으로 좋아지도록 설계했습니다.
오타 한 글자 수정부터 알고리즘 개선까지, 모든 규모의 기여가 소중합니다.

우리 데이터에는 **오류가 있을 수 있습니다.** 발견하셨다면 그것을 알려주시는 것
자체가 가장 큰 기여입니다.

## 어떻게 기여하나요?

### 🐛 오류를 발견했을 때 (신고만 해도 충분)
직접 고칠 시간이 없어도 괜찮습니다. [이슈 열기](../../issues/new/choose)에서
템플릿을 골라 알려주세요.
- **성취기준 오류**: 본문 손상, 코드 오기, 학년군/교과 오류
- **억지 연결 신고**: `published`인데 교육적으로 부적절한 연결

가능하면 **근거(교육부 고시 원문 페이지, 스크린샷 등)**를 함께 주시면 확인이 빠릅니다.

### 🔧 직접 고칠 때 (Pull Request)

1. 이 저장소를 **Fork** 합니다.
2. 브랜치를 만듭니다: `git checkout -b fix/standard-4과01-01`
3. 해당 JSON 파일(`data/…`)을 수정합니다.
4. **검증 스크립트**를 돌려 형식이 깨지지 않았는지 확인합니다:
   ```bash
   node scripts/validate.mjs
   ```
5. 커밋 후 PR을 엽니다. PR 템플릿의 체크리스트를 채워주세요.

## 데이터 수정 규칙

성취기준·링크는 다운스트림(연구·서비스)에서 그대로 쓰이므로, 몇 가지 원칙이 있습니다.

- **성취기준 `key`는 식별자입니다 — 바꾸지 마세요.** 링크가 `key`로 참조하므로,
  `key`나 `code`를 바꾸면 연결이 깨집니다. 코드 자체 오류라면 이슈로 먼저 논의해 주세요.
  `key`와 `code`의 관계는 [docs/SCHEMA.md](./docs/SCHEMA.md)에 있습니다.
- **본문(`content`) 수정은 교육부 고시 원문을 근거로.** 추정·의역이 아니라 **원문 대조**로
  고쳐주세요. 근거를 PR 설명에 남겨주세요.
- **링크 추가/수정 시** `rationale`(근거)를 반드시 채워주세요. 근거 없는 연결은
  받기 어렵습니다.
- **링크 정규화**: `source_code < target_code` 정렬을 지켜주세요(사전순).
- **대량 변경**(수십 건 이상)은 PR 전에 이슈로 먼저 상의해 주세요.

## 데이터를 새로 뽑을 때 (관리자용)

데이터는 손으로 고치기도 하지만, 원천은 [curriculum-weaver](https://github.com/greatsong/curriculum-weaver) 서비스의
정본 성취기준과 `curriculum_links` 테이블입니다. 원천이 바뀌면 다음 순서로 다시 뽑습니다.

1. 앱 리포에서 수출: `node scripts/export-open-dataset.mjs --out ../k-curriculum-2022/data`
   — `standards.json`·`links.*.json`·`manifest.json`을 결정적으로 다시 씁니다.
2. 이 리포에서 검증: `node scripts/validate.mjs` (PR을 열면 GitHub Actions가 같은 검사를 돌립니다).
3. [CHANGELOG.md](./CHANGELOG.md)에 날짜·건수·바뀐 정책을 적습니다. 스키마가 바뀌었으면
   `manifest.schema_version`과 [docs/SCHEMA.md](./docs/SCHEMA.md)도 함께 올립니다.
4. [CITATION.cff](./CITATION.cff)의 `date-released`와 README의 건수를 맞춥니다.
5. 커밋 메시지에 `data:` 접두를 붙이고, 태그 `vYYYY.MM.DD`를 답니다.

## 스타일

- JSON은 UTF-8, 필드 순서는 기존 항목을 따릅니다.
- 한 PR은 **하나의 논리적 변경**만 담아주세요 (리뷰·되돌리기 용이).
- 커밋 메시지는 무엇을·왜 고쳤는지 한 줄로.

## 행동 규범

교사·연구자·개발자가 함께 쓰는 공간입니다. 서로 존중하고, 근거로 이야기하고,
초심자의 첫 기여를 환대해 주세요.

## 라이선스 동의

기여하신 데이터는 [CC BY 4.0](./LICENSE-DATA), 코드는 [MIT](./LICENSE)로 배포됩니다.
PR을 여는 것으로 이에 동의하는 것으로 간주합니다.

---

궁금한 점은 [Discussions](../../discussions) 또는 이슈로 편하게 물어보세요.
**당신의 교정 하나가 전국의 융합수업을 조금 더 정확하게 만듭니다.**
