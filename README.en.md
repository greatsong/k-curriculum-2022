# k-curriculum-2022

> **All 6,444 achievement standards of Korea's 2022 Revised National Curriculum — verbatim from the Ministry of Education, machine-readable.**
> [한국어 README](./README.md)

[![Data: CC BY 4.0](https://img.shields.io/badge/data-CC%20BY%204.0-blue.svg)](./LICENSE-DATA)
[![Code: MIT](https://img.shields.io/badge/code-MIT-green.svg)](./LICENSE)
[![validate data](https://github.com/greatsong/k-curriculum-2022/actions/workflows/validate.yml/badge.svg)](https://github.com/greatsong/k-curriculum-2022/actions/workflows/validate.yml)
[![Release](https://img.shields.io/github/v/release/greatsong/k-curriculum-2022)](https://github.com/greatsong/k-curriculum-2022/releases)

This dataset transcribes **every achievement standard** (성취기준) in the 2022 Revised National Curriculum of the Republic of Korea, exactly as printed in the Ministry of Education's notice appendices: 6,444 standards across 292 subjects and 20 subject groups, from primary school through high-school electives and vocational subjects. Each row records which appendix it came from. It is maintained so that anyone building tools on, or studying, the Korean curriculum can use it as a reference copy.

AI-generated cross-subject "fusion" links are **not** in this repository. They live in a spin-off, **[k-curriculum-2022-links](https://github.com/greatsong/k-curriculum-2022-links)**, pinned to a release tag of this one. Standards change only when the source changes; links change with models and policy, so they are kept apart.

## Source

The standards are authored by the **Ministry of Education, Republic of Korea**. This dataset transcribes the following documents; the originals are not re-hosted here.

- **Notice**: Ministry of Education Notice No. 2022-33, "Elementary and Secondary School Curriculum" (22 Dec 2022) and its subject appendices (별책). High-school liberal-arts subjects follow the National Education Commission Notice No. 2024-3 (16 Aug 2024) revision.
- **Where to read the originals**: National Curriculum Information Center (NCIC), <https://ncic.re.kr> → curriculum documents → 2022 Revised Curriculum → by appendix number.
- **Per-row provenance**: `source_book` (appendix number) and `source_doc` (document title) on every row.

| Appendix | Document | Rows |
|---|---|---|
| 별책2 | Elementary school curriculum | 431 |
| 별책5 | Korean language | 170 |
| 별책6 | Ethics | 79 |
| 별책7 | Social studies | 365 |
| 별책8 | Mathematics | 314 |
| 별책9 | Science | 371 |
| 별책10 | Practical arts / technology-home economics / informatics | 320 |
| 별책11 | Physical education | 148 |
| 별책12 | Music | 76 |
| 별책13 | Fine arts | 75 |
| 별책14 | English | 270 |
| 별책16 | Second foreign languages | 607 |
| 별책17 | Classical Chinese | 45 |
| 별책18 | Middle-school elective subjects | 59 |
| 별책19 | High-school liberal-arts subjects | 155 |
| 별책20 | Science-track electives | 389 |
| 별책21 | Physical-education-track electives | 91 |
| 별책22 | Arts-track electives | 486 |
| 별책23 | Business and finance vocational subjects | 1,993 |

## Data

| File | Format | Description |
|---|---|---|
| [`data/standards.json`](./data/standards.json) | JSON array (14 MB) | **Canonical.** Sorted by `key` |
| [`data/standards.csv`](./data/standards.csv) | CSV, UTF-8 with BOM (12 MB) | Derived for spreadsheets; opens directly in Excel, Numbers, Google Sheets |
| [`data/manifest.json`](./data/manifest.json) | JSON | Schema version, provenance commit, counts, identity convention |
| [`datapackage.json`](./datapackage.json) | Frictionless Data Package | Field types, constraints, sources, license — machine-readable |
| [`dataset.jsonld`](./dataset.jsonld) | schema.org Dataset | Metadata for dataset search engines |
| [`llms.txt`](./llms.txt) | text | Entry point for AI agents: where files are and which invariants to keep |

**Size** — 6,444 standards · 292 subjects · 20 subject groups. By school level: elementary 611 · middle 714 · high 3,126 · industry-demand vocational 1,993. `manifest.json` is the source of truth for counts; CI checks the files against it.

## Usage

**Download** — grab `standards.json` / `standards.csv` from the Releases page, or pin a version by URL:

```bash
curl -LO https://raw.githubusercontent.com/greatsong/k-curriculum-2022/v3.0.0/data/standards.json
```

**JavaScript**

```js
import standards from './data/standards.json' with { type: 'json' }

// The identifier is `key`, not `code` (11 codes are shared by two subjects)
const byKey = new Map(standards.map((s) => [s.key, s]))
console.log(byKey.get('[6실05-05]').content)
```

**Python**

```python
import pandas as pd
df = pd.read_json("data/standards.json")          # or pd.read_csv("data/standards.csv")
df[df.subject == "수학"].groupby("grade_group").size()
```

**Spreadsheets** — open `data/standards.csv` as is. The `keywords` column is `;`-separated.

**Validation** — after editing, `node scripts/validate.mjs` checks code format, `key` uniqueness, required fields, grade-band values, and manifest counts.

## Schema

| Field | Type | Meaning |
|---|---|---|
| `code` | string | Achievement-standard code as printed in the notice, brackets included (`[4과01-01]`, `[12미적Ⅰ-02-03]`, `[공관 01-01-01]`) |
| `key` | string | **Unique identifier.** Equals `code` except for 11 code collisions, where it is `"code|subject"` |
| `subject_group` | string | Subject group (20) |
| `subject` | string | Subject (292) |
| `school_level` | string | `초등학교` (elementary), `중학교` (middle), `고등학교` (high). **Empty for industry-demand vocational subjects** |
| `grade_group` | string | Grade band: `초1-2` `초3-4` `초5-6` `중1-3` `고공통` (high, common) `고선택` (high, elective) `기타` (other) |
| `curriculum_category` | string | Common, general elective, career elective, convergence elective, elective, vocational common/major-general/major-practice |
| `area` | string | Content-area heading from the source |
| `content` | string | The standard, verbatim. Single line, ends with a period |
| `keywords` | string[] | Naive tokens from the text; search aid only |
| `explanation` | string | Official explanation where the source provides one (71%) |
| `application_notes` | string | Area-level "notes for applying the standards", bullets prefixed with `•` |
| `source_book` | string | Appendix this row was extracted from (e.g. `별책8`) |
| `source_doc` | string | Source document title (e.g. `[별책8] 수학과 교육과정`) |

Grade band and school level are encoded in the code prefix: `[2…]`=grades 1–2, `[4…]`=3–4, `[6…]`=5–6, `[9…]`=middle school, `[10…]`=high school common, `[12…]`=high school elective, Korean-abbreviation codes = vocational. Full details in [docs/SCHEMA.en.md](./docs/SCHEMA.en.md); intended use and limitations in [data/DATACARD.md](./data/DATACARD.md) (Korean).

## Quality

The text was re-extracted in September 2026 from 19 appendix PDFs with per-appendix parsers, and only rows that passed all eight gates (completeness, verbatim text, school level, subject attribution, area, explanation, application notes, format) were accepted. A full comparison against the PDF text found zero content errors and zero broken math glyphs. It has **not** been proofread end-to-end by a human, and 29% of rows have no `explanation` because the source has none. Everything we know is in [KNOWN_ISSUES.md](./KNOWN_ISSUES.md). Typos in the source are preserved on purpose.

## Versioning

Releases are tagged `vX.Y.Z` with `standards.json` and `standards.csv` attached. `schema_version` in `manifest.json` increments when the schema changes. Files are deterministically sorted, so two releases can be `diff`ed. Every PR runs the validator and a CSV-consistency check in [GitHub Actions](./.github/workflows/validate.yml). The upstream source is [curriculum-weaver](https://github.com/greatsong/curriculum-weaver); the re-export procedure is in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

Finding a place where the data differs from the source is the most valuable contribution. [Open an issue](../../issues/new/choose) or send a PR against `data/standards.json`. The single rule: **compare with the source; fix what differs, keep what matches.** See [CONTRIBUTING.md](./CONTRIBUTING.md) and the [Code of Conduct](./CODE_OF_CONDUCT.md).

## License and citation

The data has two layers; see [LICENSE-DATA](./LICENSE-DATA) and [docs/LICENSE-REVIEW.md](./docs/LICENSE-REVIEW.md) (Korean).

- **Source text** (standard, explanation, application notes): the content of Ministry of Education Notice No. 2022-33. We understand it to be a non-protected work under Article 7(2) of the Korean Copyright Act (notices of the state); this repository imposes no conditions on it. A written confirmation has been requested from the Ministry and will be published on reply.
- **What this repository adds** (structuring, `key`, provenance, CSV, metadata, docs): [CC BY 4.0](./LICENSE-DATA)
- **Code** (`scripts/`): [MIT](./LICENSE)

When reusing, please credit both the source (MOE Notice No. 2022-33, via NCIC) and this repository.
- Cite via [CITATION.cff](./CITATION.cff) (GitHub's "Cite this repository" button gives BibTeX/APA).

## Further reading

- [docs/NOTES.md](./docs/NOTES.md) (Korean) — what made the source documents hard to parse, and recommendations for the next curriculum's data release
- [k-curriculum-2022-links](https://github.com/greatsong/k-curriculum-2022-links) — AI-generated cross-subject links between these standards

---

<sub>Author: Sukree Song (송석리), teacher at Danggok High School, Seoul ([@greatsong](https://github.com/greatsong)). Compiled while building the collaborative lesson-design platform **curriculum-weaver**.</sub>
