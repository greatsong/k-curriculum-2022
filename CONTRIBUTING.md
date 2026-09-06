# 기여 가이드 · Contributing

*English follows Korean.*

이 데이터셋의 성취기준은 **교육부 고시 원문 그대로**여야 합니다. 그래서 기여의 기준도 하나입니다 — **원문과 대조해 다르면 고치고, 같으면 그대로 둡니다.** 원문의 오탈자까지 그대로 두는 것이 원칙입니다.

## 오류를 발견했을 때

[이슈 열기](../../issues/new/choose) → "성취기준 오류". 어느 행(`key`)의 어느 필드가 원문과 어떻게 다른지, 원문의 어느 별책 몇 쪽인지 적어 주세요. 각 행의 `source_book`·`source_doc`이 대조할 문서를 가리키고, 원문은 [국가교육과정정보센터(NCIC)](https://ncic.re.kr)에서 볼 수 있습니다.

## 직접 고칠 때 (Pull Request)

1. Fork → 브랜치 (`git checkout -b fix/12미적Ⅰ-02-03`)
2. `data/standards.json`을 고칩니다. **`key`와 `code`는 바꾸지 마세요** — 다른 리포([연결](https://github.com/greatsong/k-curriculum-2022-links))가 `key`로 참조합니다.
3. CSV를 다시 만들고 검증합니다.
   ```bash
   node scripts/build-csv.mjs
   node scripts/validate.mjs
   ```
4. PR 설명에 원문 근거(별책·쪽)를 적습니다. 템플릿 체크리스트를 채워 주세요.

한 PR은 하나의 논리적 변경만. 대량 변경(수십 행 이상)은 이슈로 먼저 상의해 주세요.

## 데이터를 새로 뽑을 때 (관리자용)

원천은 [curriculum-weaver](https://github.com/greatsong/curriculum-weaver)의 정본 `server/data/standards.js`이며, 교육부 별책 PDF에서 결점 0 파이프라인으로 재작성됩니다.

1. 앱 리포에서 `node scripts/export-open-dataset.mjs --out-standards ../k-curriculum-2022/data`
2. 이 리포에서 `node scripts/build-csv.mjs && node scripts/validate.mjs`
3. `CHANGELOG.md`에 날짜·건수·바뀐 것을 적고 `package.json`·`CITATION.cff`·`datapackage.json`·`dataset.jsonld`의 version을 올립니다.
4. 커밋 메시지 `data:` 접두, 태그 `vX.Y.Z`, GitHub Release에 `standards.json`·`standards.csv`를 첨부합니다.
5. 성취기준이 바뀌었으면 [연결 리포](https://github.com/greatsong/k-curriculum-2022-links)를 새 태그로 다시 수출합니다.

## 행동 규범과 라이선스

[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)를 따릅니다. 데이터는 [CC BY 4.0](./LICENSE-DATA)(원문 저작권: 교육부), 코드는 [MIT](./LICENSE)로 배포되며, PR을 여는 것으로 동의한 것으로 봅니다.

---

# Contributing (English)

Every standard in this dataset must be **verbatim from the Ministry of Education notice**. So there is one rule for contributions: **compare with the source; fix only what differs, keep everything that matches** — including typos in the source itself.

**Found an error?** [Open an issue](../../issues/new/choose) → "Achievement standard error". Say which row (`key`), which field, how it differs, and where in the source (appendix number and page). Each row's `source_book` and `source_doc` point to the document to check; the sources are on [NCIC](https://ncic.re.kr).

**Fixing it yourself:** fork, branch, edit `data/standards.json` (**never change `key` or `code`** — the [links repository](https://github.com/greatsong/k-curriculum-2022-links) references them), then run `node scripts/build-csv.mjs && node scripts/validate.mjs`, and open a PR citing the source page. One logical change per PR; discuss bulk changes in an issue first.

**Re-exporting (maintainers):** the source of truth is `server/data/standards.js` in [curriculum-weaver](https://github.com/greatsong/curriculum-weaver), rebuilt from the MOE appendix PDFs by a zero-defect pipeline. Export with `node scripts/export-open-dataset.mjs --out-standards ../k-curriculum-2022/data`, rebuild the CSV, validate, update CHANGELOG and version fields, tag `vX.Y.Z`, attach `standards.json`/`standards.csv` to the GitHub Release, then re-export the links repository against the new tag.

We follow the [Code of Conduct](./CODE_OF_CONDUCT.md). Data is [CC BY 4.0](./LICENSE-DATA) (source text © Ministry of Education); code is [MIT](./LICENSE). Opening a PR means you agree.
