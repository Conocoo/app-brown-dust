#!/usr/bin/env node
/**
 * Import characters from reverse-engineering data into the webapp.
 *
 * Reads CharBasicList (growType>=1, final evolution only),
 * applies the growth formula at max enhanced level,
 * and outputs a single JSON file for the webapp.
 *
 * Usage:
 *   node scripts/import-characters.mjs
 *
 * Output:
 *   src/data/generated/mercenaries.json
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '..')
const RE_DATA = resolve(PROJECT_ROOT, '../app-brown-reverse-engineering/analysis/game-data')

// ─── Growth Formula (verified with 11 game screenshots) ─────────────────────

function levelMultiply(level) {
  return (level - 1) + 5 * Math.floor(level / 5)
}

function finalStat(baseLv1, level) {
  return baseLv1 + Math.floor(baseLv1 * 0.01 * levelMultiply(level))
}

// ─── Type Mapping ────────────────────────────────────────────────────────────

const TYPE_MAP = { 1: 'attacker', 2: 'defender', 3: 'mage', 4: 'support' }
const EMOJI_MAP = { attacker: '⚔️', defender: '🛡️', mage: '🔮', support: '💚' }

// ─── Load Data ───────────────────────────────────────────────────────────────

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

// ─── Max Level Lookup ────────────────────────────────────────────────────────

function buildMaxLevelMap(growthItems) {
  const map = {}
  for (const g of growthItems) {
    map[g._index] = g._maxLevel
  }
  return map
}

function getEnhancedMaxLevel(growIndex, maxLevelMap) {
  let maxLv = maxLevelMap[growIndex] || 0
  // Extensions follow pattern: base series + 16, +26, ..., +66
  const prefix = Math.floor(growIndex / 100) * 100
  for (let ext = prefix + 16; ext <= prefix + 66; ext += 10) {
    if (maxLevelMap[ext]) maxLv = Math.max(maxLv, maxLevelMap[ext])
  }
  return maxLv
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log('=== Import Characters ===\n')

  // Load source data
  const chars = loadJson(resolve(RE_DATA, 'webapp-export/characters.json'))
  const growthData = loadJson(resolve(RE_DATA, 'masterdata/CharGrowthBasicList.json'))
  const maxLevelMap = buildMaxLevelMap(growthData._itemList)

  console.log(`Source: ${chars.length} characters (growType>=1)`)

  // Filter: final evolution only (nextCharCode === 0)
  const finals = chars.filter(c => c.nextCharCode === 0)
  console.log(`Final evolution: ${finals.length} characters`)

  // Transform to webapp format
  const mercenaries = []
  const skipped = []

  for (const c of finals) {
    const type = TYPE_MAP[c.typeRaw]
    if (!type) {
      skipped.push({ code: c.code, reason: `unknown type ${c.typeRaw}` })
      continue
    }

    // Skip characters with no name
    if (c.nameEn.startsWith('Unknown_')) {
      skipped.push({ code: c.code, reason: 'no name' })
      continue
    }

    // Calculate enhanced max level and final stats
    const maxLevel = getEnhancedMaxLevel(c.growIndex, maxLevelMap)
    const maxAtk = finalStat(c.stats.atk, maxLevel)
    const maxHp = finalStat(c.stats.hp, maxLevel)
    const maxSp = c.stats.supportPower > 0
      ? finalStat(c.stats.supportPower, maxLevel)
      : 0

    // Build mercenary entry
    const id = c.nameEn
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')

    const entry = {
      id,
      name: c.nameKr,
      nameEn: c.nameEn,
      type,
      star: c.star,
      // Base stats (level 1)
      baseLv1: {
        atk: c.stats.atk,
        hp: c.stats.hp,
        supportPower: c.stats.supportPower,
      },
      // Final stats (max enhanced level)
      maxLevel,
      maxHp,
      atk: maxAtk,
      supportPower: maxSp > 0 ? maxSp : undefined,
      def: c.stats.def,
      critRate: Math.round(c.stats.critRate * 10000) / 100,   // 0.075 → 7.5
      critDamage: Math.round(c.stats.critDamage * 10000) / 100, // 0.75 → 75
      agility: Math.round(c.stats.agility * 10000) / 100,     // 0.15 → 15
      piercing: c.stats.piercing,
      patience: c.stats.patience,
      emoji: EMOJI_MAP[type],
      imageId: String(c.designCode),
      // Source reference
      code: c.code,
      skillCode: c.skillCode,
    }

    mercenaries.push(entry)
  }

  // Sort by type, then name
  mercenaries.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name))

  // Output
  const outDir = resolve(PROJECT_ROOT, 'src/data/generated')
  mkdirSync(outDir, { recursive: true })
  const outPath = resolve(outDir, 'mercenaries.json')
  writeFileSync(outPath, JSON.stringify(mercenaries, null, 2), 'utf-8')

  console.log(`\nOutput: ${outPath}`)
  console.log(`Generated: ${mercenaries.length} mercenaries`)
  console.log(`Skipped: ${skipped.length}`)
  if (skipped.length > 0) {
    skipped.forEach(s => console.log(`  - code=${s.code}: ${s.reason}`))
  }

  // Stats
  const byType = {}
  const byStar = {}
  for (const m of mercenaries) {
    byType[m.type] = (byType[m.type] || 0) + 1
    byStar[m.star + '★'] = (byStar[m.star + '★'] || 0) + 1
  }
  console.log(`By type: ${JSON.stringify(byType)}`)
  console.log(`By star: ${JSON.stringify(byStar)}`)

  // Verify Cordelia
  const cord = mercenaries.find(m => m.nameEn === 'Cordelia')
  if (cord) {
    console.log(`\n=== Verification: ${cord.name} ===`)
    console.log(`ATK=${cord.atk} HP=${cord.maxHp} (expected: 849/2941)`)
    console.log(`critRate=${cord.critRate}% critDmg=${cord.critDamage}% def=${cord.def}`)
    console.log(`maxLevel=${cord.maxLevel} imageId=${cord.imageId}`)
  }
}

main()
