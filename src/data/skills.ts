// 스킬 데이터 레이어
// 소스: Docs/명세/data/skills.json

import type { SkillTemplate, RangePattern, SearchType } from '../types/skill'

import rawSkills from '../../../Docs/명세/data/skills.json'

interface RawBuffRef {
  buffCode: number
  subBuffCode?: number
}

interface RawSkill {
  code: number
  nameKr: string
  nameEn: string
  type: string
  timing: string
  rangePattern: string
  rangePatternRaw: number
  rangeSize: number
  searchType: string
  searchTypeRaw: number
  repeatCount: number
  coolTimeCount: number
  buffs: RawBuffRef[]
  [key: string]: unknown
}

function parseSkill(raw: RawSkill): SkillTemplate {
  return {
    code: raw.code,
    nameKr: raw.nameKr,
    nameEn: raw.nameEn,
    type: raw.type === 'attack' ? 'attack' : 'support',
    timing: raw.timing as SkillTemplate['timing'],
    rangePattern: raw.rangePattern as RangePattern,
    rangePatternRaw: raw.rangePatternRaw ?? 1,
    rangeSize: raw.rangeSize,
    searchType: raw.searchType as SearchType,
    searchTypeRaw: raw.searchTypeRaw ?? 1,
    repeatCount: raw.repeatCount,
    coolTimeCount: raw.coolTimeCount,
    buffs: Array.isArray(raw.buffs) ? raw.buffs : [] as import('../types/skill').SkillBuffRef[],
  }
}

const skillMap = new Map<number, SkillTemplate>()

for (const raw of rawSkills as RawSkill[]) {
  skillMap.set(raw.code, parseSkill(raw))
}

export function getSkillByCode(code: number): SkillTemplate | undefined {
  return skillMap.get(code)
}

export function getAllSkills(): SkillTemplate[] {
  return Array.from(skillMap.values())
}

export function getSkillCount(): number {
  return skillMap.size
}
