#!/usr/bin/env node
/**
 * 데이터 무결성 검증 — PR 전에 실행하세요.
 *   node scripts/validate.mjs
 *
 * 검사 항목:
 *  - JSON 파싱 가능 여부
 *  - 성취기준: code 형식·key 고유성·필수 필드
 *    (같은 code가 두 과목에 쓰인 11건이 있어 고유 식별자는 key = code 또는 "code|과목")
 *  - manifest.counts.standards와 실제 건수 일치
 * 오류가 있으면 비정상 종료(exit 1) — CI 게이트로도 쓸 수 있음.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf-8'))

const CODE_RE = /^\[.+\]$/
const GRADE_GROUPS = new Set(['초1-2', '초3-4', '초5-6', '중1-3', '고공통', '고선택', '기타'])

let errors = 0
const fail = (msg) => { console.error(`  ✗ ${msg}`); errors++ }

// ── 성취기준 ──────────────────────────────────────────────
console.log('▶ standards.json 검증')
const standards = read('standards.json')
const codes = new Set()
for (const [i, s] of standards.entries()) {
  if (!s.code || !CODE_RE.test(s.code)) fail(`[${i}] code 형식 오류: ${JSON.stringify(s.code)}`)
  if (!s.key) fail(`${s.code}: key 누락`)
  if (codes.has(s.key)) fail(`중복 key: ${s.key}`)
  codes.add(s.key)
  if (!s.content || !s.content.trim()) fail(`${s.code}: content 비어 있음`)
  if (s.grade_group && !GRADE_GROUPS.has(s.grade_group)) fail(`${s.code}: 알 수 없는 grade_group "${s.grade_group}"`)
}
console.log(`  성취기준 ${standards.length}개 / 고유 key ${codes.size}개 / code만으로 겹치는 항목 ${standards.length - new Set(standards.map((s) => s.code)).size}개`)
const manifest = read('manifest.json')
if (manifest.counts.standards !== standards.length) fail(`manifest.counts.standards=${manifest.counts.standards} ≠ 실제 ${standards.length}`)

console.log(errors ? `\n❌ 검증 실패: 오류 ${errors}건` : '\n✅ 검증 통과')
process.exit(errors ? 1 : 0)
