#!/usr/bin/env node

/**
 * generate-docs.mjs
 * Reads skill/mercenary TS source files and generates markdown docs.
 *
 * Usage: node scripts/generate-docs.mjs
 * Output: Docs/스킬-목록.md, Docs/용병-목록.md
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DOCS_DIR = join(ROOT, 'Docs')
const SKILLS_DIR = join(ROOT, 'src', 'data', 'skills')
const MERCS_DIR = join(ROOT, 'src', 'data', 'mercenaries')

const TYPE_LABEL = {
  attacker: '공격형',
  defender: '방어형',
  support: '지원형',
  mage: '마법형',
}

const TIMING_LABEL = {
  before_attack: '공격 전',
  after_attack: '공격 후',
  passive: '패시브',
}

const TARGET_LABEL = {
  enemy_front: '적 전열',
  enemy_second: '적 2열',
  enemy_back: '적 후열',
  enemy_random: '적 랜덤',
  next_ally: '인접 아군',
  self: '자신',
}

// --- Parse skill files ---

function parseSkillFile(filePath) {
  const src = readFileSync(filePath, 'utf-8')

  const idMatch = src.match(/id:\s*'([^']+)'/)
  const nameMatch = src.match(/name:\s*'([^']+)'/)
  const timingMatch = src.match(/timing:\s*'([^']+)'/)
  const targetMatch = src.match(/target:\s*'([^']+)'/)

  if (!idMatch || !nameMatch) return null

  return {
    id: idMatch[1],
    name: nameMatch[1],
    timing: timingMatch?.[1] ?? '?',
    target: targetMatch?.[1] ?? '?',
  }
}

function generateSkillDocs() {
  const files = readdirSync(SKILLS_DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts')
  const skills = files.map(f => parseSkillFile(join(SKILLS_DIR, f))).filter(Boolean)
  skills.sort((a, b) => a.name.localeCompare(b.name, 'ko'))

  const lines = [
    '# 스킬 목록',
    '',
    `> 자동 생성 문서 (\`npm run generate-docs\`). 총 ${skills.length}개.`,
    '',
    '| 이름 | ID | 타이밍 | 대상 |',
    '|------|-----|--------|------|',
  ]

  for (const s of skills) {
    const timing = TIMING_LABEL[s.timing] ?? s.timing
    const target = TARGET_LABEL[s.target] ?? s.target
    lines.push(`| ${s.name} | \`${s.id}\` | ${timing} | ${target} |`)
  }

  lines.push('')
  writeFileSync(join(DOCS_DIR, '스킬-목록.md'), lines.join('\n'), 'utf-8')
  console.log(`스킬-목록.md generated (${skills.length} skills)`)
}

// --- Parse mercenary files ---

function parseMercFile(filePath) {
  const src = readFileSync(filePath, 'utf-8')

  const idMatch = src.match(/id:\s*'([^']+)'/)
  const nameMatch = src.match(/name:\s*'([^']+)'/)
  const typeMatch = src.match(/type:\s*'([^']+)'/)
  const starMatch = src.match(/star:\s*(\d)/)
  const hpMatch = src.match(/maxHp:\s*(\d+)/)
  const atkMatch = src.match(/atk:\s*(\d+)/)
  const defMatch = src.match(/def:\s*(\d+)/)
  const spMatch = src.match(/supportPower:\s*(\d+(?:\.\d+)?)/)

  // Extract skill IDs
  const skillIds = [...src.matchAll(/skillId:\s*'([^']+)'/g)].map(m => m[1])

  if (!idMatch || !nameMatch) return null

  return {
    id: idMatch[1],
    name: nameMatch[1],
    type: typeMatch?.[1] ?? '?',
    star: starMatch ? Number(starMatch[1]) : 0,
    maxHp: hpMatch ? Number(hpMatch[1]) : 0,
    atk: atkMatch ? Number(atkMatch[1]) : 0,
    def: defMatch ? Number(defMatch[1]) : 0,
    supportPower: spMatch ? Number(spMatch[1]) : undefined,
    skills: skillIds,
  }
}

function generateMercDocs() {
  const starDirs = readdirSync(MERCS_DIR).filter(d => d.match(/^\dstar$/))
  const mercs = []

  for (const dir of starDirs) {
    const dirPath = join(MERCS_DIR, dir)
    const files = readdirSync(dirPath).filter(f => f.endsWith('.ts'))
    for (const f of files) {
      const m = parseMercFile(join(dirPath, f))
      if (m) mercs.push(m)
    }
  }

  mercs.sort((a, b) => b.star - a.star || a.name.localeCompare(b.name, 'ko'))

  const lines = [
    '# 용병 목록',
    '',
    `> 자동 생성 문서 (\`npm run generate-docs\`). 총 ${mercs.length}명.`,
    '',
    '| 이름 | 성급 | 유형 | HP | ATK | DEF | 스킬 |',
    '|------|------|------|----|-----|-----|------|',
  ]

  for (const m of mercs) {
    const type = TYPE_LABEL[m.type] ?? m.type
    const atk = m.supportPower !== undefined ? `SP ${m.supportPower}` : m.atk
    const skillList = m.skills.map(s => `\`${s}\``).join(', ')
    lines.push(`| ${m.name} | ${'★'.repeat(m.star)} | ${type} | ${m.maxHp} | ${atk} | ${m.def}% | ${skillList} |`)
  }

  lines.push('')
  writeFileSync(join(DOCS_DIR, '용병-목록.md'), lines.join('\n'), 'utf-8')
  console.log(`용병-목록.md generated (${mercs.length} mercenaries)`)
}

// --- Run ---

generateSkillDocs()
generateMercDocs()
