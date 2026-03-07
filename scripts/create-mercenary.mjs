#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { argv } from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const MERCS_DIR = join(ROOT, 'src', 'data', 'mercenaries')
const INDEX_PATH = join(MERCS_DIR, 'index.ts')

const VALID_TYPES = ['attacker', 'defender', 'support', 'mage']
const VALID_STARS = [3, 4, 5]
const VALID_TARGETS = ['enemy_front', 'enemy_second', 'enemy_back', 'enemy_random']
const VALID_RANGES = ['single', 'horizontal', 'vertical', 'back_n', 'front_n', 'cross', 'x_shape', 'area_n', 'diamond']

// -- CLI -------------------------------------------------------

function printHelp() {
  console.log(`사용법: node scripts/create-mercenary.mjs --config <file.json> [--dry-run] [--force]

옵션:
  --config <file>   용병 정의 JSON 파일 경로
  --dry-run         파일 수정 없이 결과만 출력
  --force           기존 파일 덮어쓰기 허용
  --help            도움말 출력

JSON 형식:
{
  "mercenaries": [
    {
      "id": "carlson",
      "name": "칼슨",
      "type": "defender",
      "star": 3,
      "maxHp": 8000,
      "atk": 500,
      "def": 25,
      "emoji": "🛡️",
      "imageId": "825",
      "critRate": 0,
      "critDamage": 0,
      "agility": 0,
      "attackTarget": "enemy_front",
      "attackRange": "single",
      "skills": [
        { "skillId": "advanced_taunt" }
      ]
    }
  ]
}

선택 필드: supportPower, imageId, attackTarget, attackRange, rangeSize, runes, skills`)
}

function parseArgs() {
  const args = argv.slice(2)
  if (args.includes('--help') || args.length === 0) {
    printHelp()
    process.exit(0)
  }

  const configIdx = args.indexOf('--config')
  if (configIdx === -1 || !args[configIdx + 1]) {
    console.error('오류: --config <file> 필수')
    process.exit(1)
  }

  return {
    configPath: resolve(args[configIdx + 1]),
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force'),
  }
}

// -- 유효성 검증 -----------------------------------------------

function validate(mercenaries) {
  const errors = []
  for (const m of mercenaries) {
    const prefix = `[${m.id || '?'}]`
    if (!m.id) errors.push(`${prefix} id 필수`)
    if (!m.name) errors.push(`${prefix} name 필수`)
    if (!VALID_TYPES.includes(m.type)) errors.push(`${prefix} type 잘못됨: ${m.type} (${VALID_TYPES.join('|')})`)
    if (!VALID_STARS.includes(m.star)) errors.push(`${prefix} star 잘못됨: ${m.star} (3|4|5)`)
    if (typeof m.maxHp !== 'number') errors.push(`${prefix} maxHp 필수 (숫자)`)
    if (typeof m.atk !== 'number') errors.push(`${prefix} atk 필수 (숫자)`)
    if (typeof m.def !== 'number') errors.push(`${prefix} def 필수 (숫자)`)
    if (!m.emoji) errors.push(`${prefix} emoji 필수`)
    if (typeof m.critRate !== 'number') errors.push(`${prefix} critRate 필수 (숫자)`)
    if (typeof m.critDamage !== 'number') errors.push(`${prefix} critDamage 필수 (숫자)`)
    if (typeof m.agility !== 'number') errors.push(`${prefix} agility 필수 (숫자)`)
    if (m.attackTarget && !VALID_TARGETS.includes(m.attackTarget)) errors.push(`${prefix} attackTarget 잘못됨: ${m.attackTarget}`)
    if (m.attackRange && !VALID_RANGES.includes(m.attackRange)) errors.push(`${prefix} attackRange 잘못됨: ${m.attackRange}`)
  }

  // config 내 ID 중복 체크
  const ids = mercenaries.map((m) => m.id).filter(Boolean)
  const seen = new Set()
  for (const id of ids) {
    if (seen.has(id)) errors.push(`[${id}] id 중복`)
    seen.add(id)
  }

  if (errors.length > 0) {
    console.error('유효성 검증 실패:\n' + errors.map((e) => '  - ' + e).join('\n'))
    process.exit(1)
  }
}

// -- 용병 파일 생성 --------------------------------------------

function serializeSkillRef(ref) {
  if (!ref.effects || ref.effects.length === 0) {
    return `{ skillId: '${ref.skillId}' }`
  }
  const effectParts = ref.effects.map((e) => {
    const props = Object.entries(e).map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : v}`)
    return `{ ${props.join(', ')} }`
  })
  return `{ skillId: '${ref.skillId}', effects: [${effectParts.join(', ')}] }`
}

function serializeRune(rune) {
  const props = Object.entries(rune).map(([k, v]) => {
    if (typeof v === 'string') return `${k}: '${v}'`
    if (Array.isArray(v)) {
      const items = v.map((item) => {
        if (typeof item === 'object') {
          const inner = Object.entries(item).map(([ik, iv]) => `${ik}: ${typeof iv === 'string' ? `'${iv}'` : iv}`)
          return `{ ${inner.join(', ')} }`
        }
        return typeof item === 'string' ? `'${item}'` : item
      })
      return `${k}: [${items.join(', ')}]`
    }
    return `${k}: ${v}`
  })
  return `{ ${props.join(', ')} }`
}

function generateMercenaryFile(merc) {
  const starFolder = `${merc.star}star`
  const lines = []

  lines.push("import type { MercenaryTemplate } from '../../../types/mercenary'")
  lines.push('')
  lines.push(`export const ${merc.id}: MercenaryTemplate = {`)
  lines.push(`  id: '${merc.id}',`)
  lines.push(`  name: '${merc.name}',`)
  lines.push(`  type: '${merc.type}',`)
  lines.push(`  star: ${merc.star},`)
  lines.push(`  maxHp: ${merc.maxHp},`)
  lines.push(`  atk: ${merc.atk},`)
  if (merc.supportPower !== undefined) {
    lines.push(`  supportPower: ${merc.supportPower},`)
  }
  lines.push(`  def: ${merc.def},`)
  lines.push(`  emoji: '${merc.emoji}',`)
  if (merc.imageId !== undefined) {
    lines.push(`  imageId: '${merc.imageId}',`)
  }
  lines.push(`  critRate: ${merc.critRate},`)
  lines.push(`  critDamage: ${merc.critDamage},`)
  lines.push(`  agility: ${merc.agility},`)
  if (merc.attackTarget) {
    lines.push(`  attackTarget: '${merc.attackTarget}',`)
  }
  if (merc.attackRange) {
    lines.push(`  attackRange: '${merc.attackRange}',`)
  }
  if (merc.rangeSize !== undefined) {
    lines.push(`  rangeSize: ${merc.rangeSize},`)
  }

  // skills
  const skills = merc.skills || []
  lines.push('  skills: [')
  for (const ref of skills) {
    lines.push(`    ${serializeSkillRef(ref)},`)
  }
  lines.push('  ],')

  // runes
  if (merc.runes && merc.runes.length > 0) {
    lines.push('  runes: [')
    for (const rune of merc.runes) {
      lines.push(`    ${serializeRune(rune)},`)
    }
    lines.push('  ],')
  }

  lines.push('}')
  lines.push('')

  return { content: lines.join('\n'), starFolder }
}

// -- index.ts 업데이트 -----------------------------------------

function updateMercIndex(mercenaries, dryRun) {
  const content = readFileSync(INDEX_PATH, 'utf-8')
  const lines = content.split('\n')

  // import 삽입 위치: 마지막 용병 import 바로 다음
  let lastImportLine = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("import { ") && lines[i].includes("from './")) {
      lastImportLine = i
    }
  }

  // register 삽입 위치: 마지막 register() 호출 바로 다음
  let lastRegisterLine = -1
  for (let i = 0; i < lines.length; i++) {
    if (/^register\(.+\)$/.test(lines[i])) {
      lastRegisterLine = i
    }
  }

  if (lastImportLine === -1 || lastRegisterLine === -1) {
    console.error('오류: index.ts 구조를 파싱할 수 없습니다')
    process.exit(1)
  }

  // 이미 등록된 용병 필터링
  const newMercs = mercenaries.filter((m) => {
    if (content.includes(`import { ${m.id} }`)) {
      console.log(`  -> ${m.id} -- 이미 index.ts에 등록됨, 건너뜀`)
      return false
    }
    return true
  })

  if (newMercs.length === 0) return content

  const importLines = newMercs.map((m) =>
    `import { ${m.id} } from './${m.star}star/${m.id}'`
  )
  const registerLines = newMercs.map((m) =>
    `register(${m.id})`
  )

  // register 먼저 삽입 (뒤쪽)
  lines.splice(lastRegisterLine + 1, 0, ...registerLines)
  // import 삽입 (앞쪽)
  lines.splice(lastImportLine + 1, 0, ...importLines)

  const result = lines.join('\n')

  if (dryRun) {
    console.log('\nindex.ts 변경 사항:')
    for (const line of importLines) console.log(`  + ${line}`)
    for (const line of registerLines) console.log(`  + ${line}`)
  } else {
    writeFileSync(INDEX_PATH, result, 'utf-8')
    console.log(`  index.ts 업데이트 (${newMercs.length}개 용병 추가)`)
  }

  return result
}

// -- 메인 ------------------------------------------------------

function main() {
  const { configPath, dryRun, force } = parseArgs()

  if (!existsSync(configPath)) {
    console.error(`오류: 설정 파일 없음: ${configPath}`)
    process.exit(1)
  }

  const config = JSON.parse(readFileSync(configPath, 'utf-8'))
  const mercenaries = config.mercenaries || [config]

  validate(mercenaries)

  if (dryRun) console.log('Dry-run 모드 -- 파일 수정 없음\n')

  // 1. 용병 파일 생성
  for (const merc of mercenaries) {
    const { content, starFolder } = generateMercenaryFile(merc)
    const dirPath = join(MERCS_DIR, starFolder)
    const filePath = join(dirPath, `${merc.id}.ts`)

    if (existsSync(filePath) && !force) {
      console.log(`  -> ${merc.id}.ts 이미 존재, 건너뜀 (--force로 덮어쓰기)`)
      continue
    }

    if (dryRun) {
      console.log(`${merc.id}.ts:`)
      console.log(content)
    } else {
      if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true })
      writeFileSync(filePath, content, 'utf-8')
      console.log(`  ${merc.id}.ts 생성`)
    }
  }

  // 2. index.ts 업데이트
  updateMercIndex(mercenaries, dryRun)

  if (!dryRun) console.log('\n완료!')
}

main()
