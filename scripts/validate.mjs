#!/usr/bin/env node
/**
 * 데이터 무결성 검증 — PR 전에 실행하세요.
 *   node scripts/validate.mjs
 *
 * 검사 항목:
 *  - JSON 파싱 가능 여부
 *  - 성취기준: code 형식·중복·필수 필드
 *  - 링크: source<target 정규화, 참조 코드 존재, 점수 범위, link_type 유효성
 * 오류가 있으면 비정상 종료(exit 1) — CI 게이트로도 쓸 수 있음.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf-8'))

const CODE_RE = /^\[.+\]$/
const GRADE_GROUPS = new Set(['초1-2', '초3-4', '초5-6', '중1-3', '고공통', '고선택', '기타'])
const LINK_TYPES = new Set(['cross_subject', 'same_concept', 'application', 'prerequisite', 'extension'])

let errors = 0
const fail = (msg) => { console.error(`  ✗ ${msg}`); errors++ }

// ── 성취기준 ──────────────────────────────────────────────
console.log('▶ standards.json 검증')
const standards = read('standards.json')
const codes = new Set()
for (const [i, s] of standards.entries()) {
  if (!s.code || !CODE_RE.test(s.code)) fail(`[${i}] code 형식 오류: ${JSON.stringify(s.code)}`)
  if (codes.has(s.code)) fail(`중복 code: ${s.code}`)
  codes.add(s.code)
  if (!s.content || !s.content.trim()) fail(`${s.code}: content 비어 있음`)
  if (s.grade_group && !GRADE_GROUPS.has(s.grade_group)) fail(`${s.code}: 알 수 없는 grade_group "${s.grade_group}"`)
}
console.log(`  성취기준 ${standards.length}개 / 고유 코드 ${codes.size}개`)

// ── 링크 ──────────────────────────────────────────────────
for (const file of ['links.published.json', 'links.candidate.json']) {
  console.log(`▶ ${file} 검증`)
  const links = read(file)
  let dangling = 0
  for (const [i, l] of links.entries()) {
    if (!l.source_code || !l.target_code) { fail(`[${i}] source/target 누락`); continue }
    if (!(l.source_code < l.target_code)) fail(`정규화 위반(source<target 아님): ${l.source_code} / ${l.target_code}`)
    if (!codes.has(l.source_code)) dangling++
    if (!codes.has(l.target_code)) dangling++
    if (l.link_type && !LINK_TYPES.has(l.link_type)) fail(`알 수 없는 link_type "${l.link_type}"`)
    for (const k of ['semantic_score', 'quality_score']) {
      if (l[k] != null && (l[k] < 0 || l[k] > 1)) fail(`${l.source_code}~${l.target_code}: ${k} 범위 벗어남 (${l[k]})`)
    }
  }
  console.log(`  링크 ${links.length}개` + (dangling ? `  ⚠️ 존재하지 않는 코드 참조 ${dangling}건` : ''))
  if (dangling) fail(`${file}: 성취기준에 없는 코드를 참조하는 링크가 있습니다`)
}

console.log(errors ? `\n❌ 검증 실패: 오류 ${errors}건` : '\n✅ 검증 통과')
process.exit(errors ? 1 : 0)
