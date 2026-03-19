#!/usr/bin/env node
/**
 * import-skills.mjs
 *
 * RE의 mercenaries.json + skills-mapped.json을 기반으로
 * 시뮬레이터 용병 파일의 skill.timing / skill.target / skill.attackRange / skill.rangeSize를 업데이트.
 *
 * skill.effects는 건드리지 않음 (기존 수동 구현 보존).
 *
 * Usage: node scripts/import-skills.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { argv } from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const RE_EXPORT = resolve(ROOT, '..', 'app-brown-reverse-engineering', 'analysis', 'game-data', 'webapp-export')
const MERCS_DIR = join(ROOT, 'src', 'data', 'mercenaries')

const DRY_RUN = argv.includes('--dry-run')

// ─── 범위 패턴 매핑 ─────────────────────────────────────────────────────────
// RE rangePattern (SAT_* enum) → 시뮬레이터 AttackRange
const RANGE_MAP = {
  'single':             'single',      // SAT_NORMAL
  'horizontal':         'horizontal',  // SAT_PIERCING: 직선 관통 (양방향 = horizontal)
  'cross':              'cross',       // SAT_RANGE1: 십자형
  'square':             'area_n',      // SAT_RANGE2: 사각형
  'spread':             'back_n',      // SAT_SPREAD: 후방 확산
  'x_shape':            'x_shape',     // SAT_RANGE_X: X자형
  'reverse_horizontal': 'front_n',     // SAT_REVERSE_PIERCING: 역방향 관통
  'triangle':           'single',      // SAT_RANGE_TRIANGLE: 삼각형 (미구현 → 단일 폴백)
  'spread_horizontal':  'horizontal',  // SAT_SPREAD_HORIZONTAL: 수평 확산
  'wide_spread':        'front_n',     // SAT_WIDE_SPREAD: 광역 확산
  'full_column':        'vertical',    // SAT_ONE_X_FULL_Y: 1열 전체
  'fat_cross':          'small_cross', // SAT_FAT_CROSS: 두꺼운 십자
  'chaining_cross':     'cross',       // SAT_LINKED_CROSS_CHAINING: 체이닝 십자
  'range_piercing':     'horizontal',  // SAT_RANGE_PIERCING: 범위 관통
}

// ─── 타겟 매핑 ───────────────────────────────────────────────────────────────
const TARGET_MAP = {
  'enemy_front':  'enemy_front',
  'enemy_second': 'enemy_second',
  'enemy_third':  'enemy_third',
  'enemy_back':   'enemy_back',
  'enemy_random': 'enemy_random',
  'next_ally':    'next_ally',
}

// ─── RE 데이터 로드 ──────────────────────────────────────────────────────────
const reMercs = JSON.parse(readFileSync(join(RE_EXPORT, 'mercenaries.json'), 'utf-8'))
const reSkills = JSON.parse(readFileSync(join(RE_EXPORT, 'skills-mapped.json'), 'utf-8'))

const skillByCode = new Map(reSkills.map(s => [s.code, s]))

// 중복 id가 있을 경우 finalStar가 높은(=성장 가능한) 버전 우선 선택
const reMercById = new Map()
for (const m of reMercs) {
  const ex = reMercById.get(m.id)
  if (!ex || (m.finalStar ?? 0) > (ex.finalStar ?? 0)) {
    reMercById.set(m.id, m)
  }
}

// ─── 통계 ────────────────────────────────────────────────────────────────────
let updated = 0
let unchanged = 0
let notFound = 0
let errors = 0
const warnings = []

// ─── 파일 처리 ───────────────────────────────────────────────────────────────

/**
 * skill: { 헤더 부분(timing/target/attackRange/rangeSize)만 교체.
 * effects: 이하는 건드리지 않음.
 *
 * 매칭 대상:
 *   skill: {
 *     timing: '...',
 *     target: '...',
 *     attackRange: '...',
 *     rangeSize: N,      ← 있을 수도 없을 수도
 *     effects:
 */
function updateSkillHeader(src, timing, target, attackRange, rangeSize) {
  // skill: { 부터 effects: 직전까지를 캡처
  // Group 1: 들여쓰기 포함 'skill: {'
  // Group 2: 내부 줄들 (timing/target/attackRange/rangeSize)
  // Group 3: effects 키워드
  const skillHeaderRe = /([ \t]*skill:\s*\{)\n([\s\S]*?)([ \t]*effects:)/

  return src.replace(skillHeaderRe, (_match, open, _inner, effectsStart) => {
    // effectsStart의 들여쓰기 = 내부 필드(timing/target/attackRange)와 동일 레벨
    const indent = effectsStart.match(/^([ \t]*)/)[1]

    const rangeSizeLine = rangeSize !== null ? `\n${indent}rangeSize: ${rangeSize},` : ''
    const newInner = [
      `\n${indent}timing: '${timing}',`,
      `\n${indent}target: '${target}',`,
      `\n${indent}attackRange: '${attackRange}',${rangeSizeLine}`,
      '\n',
    ].join('')

    return `${open}${newInner}${effectsStart}`
  })
}

function processFile(filePath) {
  const id = basename(filePath, '.ts')
  const src = readFileSync(filePath, 'utf-8')

  if (!src.includes('skill:')) {
    unchanged++
    return
  }

  const reMerc = reMercById.get(id)
  if (!reMerc) {
    notFound++
    return
  }

  const reSkill = skillByCode.get(reMerc.skillCode)
  if (!reSkill) {
    warnings.push(`skillCode ${reMerc.skillCode} not found in skills-mapped: ${id}`)
    unchanged++
    return
  }

  // triangle 폴백 경고
  if (reSkill.rangePattern === 'triangle') {
    warnings.push(`${id}: rangePattern=triangle (미구현) → single 폴백`)
  }

  // mixed: before_attack + after_attack 혼합 → after_attack 사용
  const newTiming = reSkill.skillTiming === 'mixed' ? 'after_attack' : reSkill.skillTiming
  const newTarget = TARGET_MAP[reSkill.target] ?? reSkill.target
  const newRange = RANGE_MAP[reSkill.rangePattern] ?? 'single'
  const newRangeSize = reSkill.rangeSize > 0 ? reSkill.rangeSize : null

  const newSrc = updateSkillHeader(src, newTiming, newTarget, newRange, newRangeSize)

  if (newSrc === src) {
    unchanged++
    return
  }

  if (DRY_RUN) {
    // 무엇이 바뀌었는지 간략 출력
    const oldTimingM = src.match(/timing:\s*'([^']+)'/)
    const oldTargetM = src.match(/target:\s*'([^']+)'/)
    const oldRangeM = src.match(/attackRange:\s*'([^']+)'/)
    const oldTiming = oldTimingM?.[1] ?? '?'
    const oldTarget = oldTargetM?.[1] ?? '?'
    const oldRange = oldRangeM?.[1] ?? '?'
    const changes = []
    if (oldTiming !== newTiming) changes.push(`timing: ${oldTiming}→${newTiming}`)
    if (oldTarget !== newTarget) changes.push(`target: ${oldTarget}→${newTarget}`)
    if (oldRange !== newRange) changes.push(`range: ${oldRange}→${newRange}`)
    if (newRangeSize !== null && !src.includes(`rangeSize: ${newRangeSize}`)) changes.push(`rangeSize: →${newRangeSize}`)
    console.log(`  [${id}] ${changes.join(', ')}`)
  } else {
    writeFileSync(filePath, newSrc, 'utf-8')
  }
  updated++
}

function walkDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDir(fullPath)
    } else if (entry.isFile() && entry.name.endsWith('.ts') && entry.name !== 'index.ts') {
      try {
        processFile(fullPath)
      } catch (e) {
        console.error(`ERROR: ${filePath}: ${e.message}`)
        errors++
      }
    }
  }
}

// ─── 실행 ────────────────────────────────────────────────────────────────────
if (DRY_RUN) console.log('Dry-run 모드 — 파일 수정 없음\n')

walkDir(MERCS_DIR)

if (warnings.length > 0) {
  console.log('\n경고:')
  for (const w of warnings) console.log(`  ⚠ ${w}`)
}

console.log(`\n완료: ${updated} 업데이트, ${unchanged} 변경없음, ${notFound} RE 없음, ${errors} 오류`)
