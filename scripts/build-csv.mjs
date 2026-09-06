#!/usr/bin/env node
/**
 * data/standards.json → data/standards.csv
 * 스프레드시트에서 바로 여는 사용자를 위한 배포본. JSON이 정본이고 CSV는 파생물이다.
 *   node scripts/build-csv.mjs
 * - UTF-8 BOM을 붙인다(한국어 Excel이 인코딩을 못 맞추는 문제 방지)
 * - keywords 배열은 ';'로 잇는다. 줄바꿈·쌍따옴표·쉼표는 RFC 4180대로 인용한다
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const standards = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'standards.json'), 'utf-8'))
const FIELDS = ['key', 'code', 'subject_group', 'subject', 'school_level', 'grade_group', 'curriculum_category', 'area', 'content', 'keywords', 'explanation', 'application_notes', 'source_book', 'source_doc']
const cell = (v) => {
  const s = Array.isArray(v) ? v.join(';') : (v ?? '')
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
const lines = [FIELDS.join(','), ...standards.map((s) => FIELDS.map((f) => cell(s[f])).join(','))]
fs.writeFileSync(path.join(ROOT, 'data', 'standards.csv'), '﻿' + lines.join('\r\n') + '\r\n')
console.log(`data/standards.csv: ${standards.length}행, ${FIELDS.length}열`)
