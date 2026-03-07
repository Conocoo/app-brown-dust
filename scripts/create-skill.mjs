#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { argv } from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SKILLS_DIR = join(ROOT, 'src', 'data', 'skills')
const INDEX_PATH = join(SKILLS_DIR, 'index.ts')
const MERCS_DIR = join(ROOT, 'src', 'data', 'mercenaries')

const VALID_TIMINGS = ['before_attack', 'after_attack', 'passive']
const VALID_TARGETS = ['enemy_front', 'enemy_second', 'enemy_back', 'enemy_random', 'next_ally', 'self']

// ── CLI ─────────────────────────────────────────────

function printHelp() {
  console.log(`사용법: node scripts/create-skill.mjs --config <file.json> [--dry-run] [--force]

옵션:
  --config <file>   스킬 정의 JSON 파일 경로
  --dry-run         파일 수정 없이 결과만 출력
  --force           기존 파일 덮어쓰기 허용
  --help            도움말 출력

JSON 형식:
{
  "skills": [
    {
      "id": "advanced_taunt",
      "name": "상급 도발",
      "description": "도발(12턴) + 받는 피해량 -35%",
      "timing": "after_attack",
      "target": "self",
      "effects": [
        { "type": "taunt", "value": 0, "duration": 12, "buffType": "special" }
      ],
      "mercenary": "carlson"
    }
  ]
}`)
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

// ── 유틸 ────────────────────────────────────────────

/** snake_case → kebab-case */
function toFileName(id) {
  return id.replaceAll('_', '-')
}

/** snake_case → camelCase */
function toVarName(id) {
  return id.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

// ── 유효성 검증 ─────────────────────────────────────

function validate(skills) {
  const errors = []
  for (const s of skills) {
    const prefix = `[${s.id || '?'}]`
    if (!s.id) errors.push(`${prefix} id 필수`)
    if (!s.name) errors.push(`${prefix} name 필수`)
    if (!VALID_TIMINGS.includes(s.timing)) errors.push(`${prefix} timing 잘못됨: ${s.timing}`)
    if (!VALID_TARGETS.includes(s.target)) errors.push(`${prefix} target 잘못됨: ${s.target}`)
    if (!Array.isArray(s.effects) || s.effects.length === 0) errors.push(`${prefix} effects 필수 (1개 이상)`)
  }
  // config 내 ID 중복 체크
  const ids = skills.map((s) => s.id).filter(Boolean)
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

// ── 스킬 파일 생성 ──────────────────────────────────

const EFFECT_PROP_ORDER = ['type', 'value', 'atkScaling', 'spScaling', 'duration', 'buffType', 'debuffClass', 'ignoreImmunity', 'dmgTakenUp', 'triggerSkill', 'linkedBuffId']

function serializeEffect(effect) {
  const parts = []
  for (const key of EFFECT_PROP_ORDER) {
    if (effect[key] === undefined) continue
    const val = typeof effect[key] === 'string' ? `'${effect[key]}'` : effect[key]
    parts.push(`${key}: ${val}`)
  }
  return `{ ${parts.join(', ')} }`
}

function generateSkillFile(skill) {
  const effectLines = skill.effects.map((e) => '    ' + serializeEffect(e) + ',')
  const desc = skill.description || skill.name

  return `import type { Skill } from '../../types/skill'

/** ${desc} */
export const ${toVarName(skill.id)}: Skill = {
  id: '${skill.id}',
  name: '${skill.name}',
  timing: '${skill.timing}',
  target: '${skill.target}',
  effects: [
${effectLines.join('\n')}
  ],
}
`
}

// ── index.ts 업데이트 ───────────────────────────────

function updateSkillIndex(skills, dryRun) {
  const content = readFileSync(INDEX_PATH, 'utf-8')
  const lines = content.split('\n')

  // import 삽입 위치: 마지막 skill import 바로 다음
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

  // 이미 등록된 스킬 필터링
  const newSkills = skills.filter((s) => {
    const varName = toVarName(s.id)
    if (content.includes(`import { ${varName} }`)) {
      console.log(`  ⏭ ${s.id} — 이미 index.ts에 등록됨, 건너뜀`)
      return false
    }
    return true
  })

  if (newSkills.length === 0) return content

  // 역순으로 삽입 (줄 번호 안 밀리게)
  const importLines = newSkills.map((s) =>
    `import { ${toVarName(s.id)} } from './${toFileName(s.id)}'`
  )
  const registerLines = newSkills.map((s) =>
    `register(${toVarName(s.id)})`
  )

  // register 먼저 삽입 (뒤쪽)
  lines.splice(lastRegisterLine + 1, 0, ...registerLines)
  // import 삽입 (앞쪽)
  lines.splice(lastImportLine + 1, 0, ...importLines)

  const result = lines.join('\n')

  if (dryRun) {
    console.log('\n📄 index.ts 변경 사항:')
    for (const line of importLines) console.log(`  + ${line}`)
    for (const line of registerLines) console.log(`  + ${line}`)
  } else {
    writeFileSync(INDEX_PATH, result, 'utf-8')
    console.log(`  ✅ index.ts 업데이트 (${newSkills.length}개 스킬 추가)`)
  }

  return result
}

// ── 용병 파일 업데이트 ──────────────────────────────

function findMercenaryFile(mercenaryId) {
  // 3star ~ 5star 디렉토리 순회
  for (const star of ['3star', '4star', '5star']) {
    const filePath = join(MERCS_DIR, star, `${mercenaryId}.ts`)
    if (existsSync(filePath)) return filePath
  }
  return null
}

function updateMercenary(skillId, mercenaryId, overrides, dryRun) {
  const filePath = findMercenaryFile(mercenaryId)
  if (!filePath) {
    console.error(`  ⚠ 용병 파일 없음: ${mercenaryId}`)
    return
  }

  const content = readFileSync(filePath, 'utf-8')

  // 이미 등록되어 있는지 확인
  if (content.includes(`skillId: '${skillId}'`)) {
    console.log(`  ⏭ ${mercenaryId}에 ${skillId} 이미 등록됨, 건너뜀`)
    return
  }

  // skills: [ ... ] 블록 찾기
  const lines = content.split('\n')
  let skillsStartLine = -1
  let skillsEndLine = -1

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('skills:')) {
      skillsStartLine = i
      // 빈 배열 한 줄 처리: skills: []
      if (lines[i].trim().match(/skills:\s*\[\s*\]/)) {
        skillsEndLine = i
        break
      }
    }
    if (skillsStartLine !== -1 && skillsEndLine === -1 && lines[i].trim().startsWith(']')) {
      skillsEndLine = i
      break
    }
  }

  if (skillsStartLine === -1 || skillsEndLine === -1) {
    console.error(`  ⚠ ${mercenaryId}.ts에서 skills 배열을 찾을 수 없음`)
    return
  }

  // 새 엔트리 생성
  let entry
  if (overrides && overrides.length > 0) {
    const overrideStr = overrides.map((o) => {
      const parts = Object.entries(o).map(([k, v]) => `${k}: ${v}`)
      return `{ ${parts.join(', ')} }`
    }).join(', ')
    entry = `    { skillId: '${skillId}', effects: [${overrideStr}] },`
  } else {
    entry = `    { skillId: '${skillId}' },`
  }

  if (dryRun) {
    console.log(`\n📄 ${mercenaryId}.ts 변경 사항:`)
    console.log(`  + ${entry.trim()}`)
  } else {
    // 빈 배열 한 줄(skills: [])이면 여러 줄로 변환
    if (skillsStartLine === skillsEndLine) {
      lines[skillsStartLine] = '  skills: ['
      lines.splice(skillsStartLine + 1, 0, entry, '  ],')
    } else {
      lines.splice(skillsEndLine, 0, entry)
    }
    writeFileSync(filePath, lines.join('\n'), 'utf-8')
    console.log(`  ✅ ${mercenaryId}.ts에 ${skillId} 추가`)
  }
}

// ── 메인 ────────────────────────────────────────────

function main() {
  const { configPath, dryRun, force } = parseArgs()

  if (!existsSync(configPath)) {
    console.error(`오류: 설정 파일 없음: ${configPath}`)
    process.exit(1)
  }

  const config = JSON.parse(readFileSync(configPath, 'utf-8'))
  const skills = config.skills || [config]

  validate(skills)

  if (dryRun) console.log('🔍 Dry-run 모드 — 파일 수정 없음\n')

  // 1. 스킬 파일 생성
  for (const skill of skills) {
    const fileName = toFileName(skill.id) + '.ts'
    const filePath = join(SKILLS_DIR, fileName)

    if (existsSync(filePath) && !force) {
      console.log(`  ⏭ ${fileName} 이미 존재, 건너뜀 (--force로 덮어쓰기)`)
      continue
    }

    const content = generateSkillFile(skill)

    if (dryRun) {
      console.log(`📄 ${fileName}:`)
      console.log(content)
    } else {
      writeFileSync(filePath, content, 'utf-8')
      console.log(`  ✅ ${fileName} 생성`)
    }
  }

  // 2. index.ts 업데이트
  updateSkillIndex(skills, dryRun)

  // 3. 용병 파일 업데이트
  for (const skill of skills) {
    if (skill.mercenary) {
      updateMercenary(skill.id, skill.mercenary, skill.overrides, dryRun)
    }
  }

  if (!dryRun) console.log('\n✨ 완료!')
}

main()
