#!/usr/bin/env node
/**
 * 예제: 한 성취기준과 융합 가능한 상대 교과 성취기준 찾기
 *   node examples/find-fusion-partners.mjs "[6실05-05]"
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const standards = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'standards.json'), 'utf-8'))
const links = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'links.published.json'), 'utf-8'))

const code = process.argv[2] || '[6실05-05]'
const byCode = Object.fromEntries(standards.map((s) => [s.code, s]))

if (!byCode[code]) {
  console.error(`성취기준을 찾을 수 없습니다: ${code}`)
  process.exit(1)
}

console.log(`\n▶ 기준 성취기준: ${code} (${byCode[code].subject})`)
console.log(`  ${byCode[code].content}\n`)

const partners = links
  .filter((l) => l.source_code === code || l.target_code === code)
  .map((l) => {
    const other = l.source_code === code ? l.target_code : l.source_code
    return { other, std: byCode[other], link: l }
  })
  .filter((p) => p.std)
  .sort((a, b) => b.link.quality_score - a.link.quality_score)

console.log(`융합 가능한 성취기준 ${partners.length}개:\n`)
for (const { other, std, link } of partners) {
  console.log(`  • ${other} (${std.subject}) — 품질 ${link.quality_score}`)
  console.log(`    ${std.content.replace(/\n/g, ' ')}`)
  console.log(`    🔗 융합주제: ${link.integration_theme}`)
  console.log(`    📝 수업: ${link.lesson_hook}\n`)
}
