#!/usr/bin/env node
/**
 * migrate-to-char-skill.mjs
 *
 * Migrates mercenary TS files from old format (skills: MercenarySkillRef[] + attackTarget? + attackRange? + rangeSize?)
 * to new format (skill: CharacterSkill).
 *
 * Only processes files with empty `skills: []` — files with actual skillId refs are skipped (already migrated manually).
 *
 * Usage: node scripts/migrate-to-char-skill.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const MERCS_DIR = join(ROOT, 'src', 'data', 'mercenaries')

let processed = 0
let skipped = 0
let errors = 0

function processFile(filePath) {
  const src = readFileSync(filePath, 'utf-8')

  // Skip files that already have `skill:` (already migrated)
  if (src.includes('skill:') && !src.includes('skills:')) return

  // Skip files that have actual skillId references (manual migration)
  if (src.includes('skillId:')) {
    console.log(`SKIP (has skillId): ${filePath}`)
    skipped++
    return
  }

  // Extract attackTarget, attackRange, rangeSize from the file
  const attackTargetMatch = src.match(/attackTarget:\s*'([^']+)'/)
  const attackRangeMatch = src.match(/attackRange:\s*'([^']+)'/)
  const rangeSizeMatch = src.match(/rangeSize:\s*(\d+)/)

  const attackTarget = attackTargetMatch ? attackTargetMatch[1] : 'enemy_front'
  const attackRange = attackRangeMatch ? attackRangeMatch[1] : 'single'
  const rangeSize = rangeSizeMatch ? Number(rangeSizeMatch[1]) : null

  // Build the skill block
  const rangeSizeLine = rangeSize !== null ? `\n    rangeSize: ${rangeSize},` : ''
  const skillBlock = `  skill: {\n    timing: 'after_attack',\n    target: '${attackTarget}',\n    attackRange: '${attackRange}',${rangeSizeLine}\n    effects: [],\n  },`

  // Remove old fields and replace skills: [] with skill: {...}
  let newSrc = src
  newSrc = newSrc.replace(/^\s*attackTarget:\s*'[^']+',?\n/m, '')
  newSrc = newSrc.replace(/^\s*attackRange:\s*'[^']+',?\n/m, '')
  newSrc = newSrc.replace(/^\s*rangeSize:\s*\d+,?\n/m, '')
  // Replace `skills: [\n  ],` or `skills: [],` with the new skill block
  newSrc = newSrc.replace(/\s*skills:\s*\[\s*\],?/, `\n${skillBlock}`)

  if (newSrc === src) {
    console.log(`UNCHANGED: ${filePath}`)
    skipped++
    return
  }

  writeFileSync(filePath, newSrc, 'utf-8')
  processed++
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
        console.error(`ERROR: ${fullPath}: ${e.message}`)
        errors++
      }
    }
  }
}

walkDir(MERCS_DIR)

console.log(`\nDone: ${processed} migrated, ${skipped} skipped, ${errors} errors`)
