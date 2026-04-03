// 용병 데이터 레이어
// 소스: Docs/명세/data/mercenaries.json + mercenary-config.json

import type { MercenaryData } from '../types/character'
import type { MercenarySkill } from '../types/skill'

import rawMercenaries from '../../../Docs/명세/data/mercenaries.json'
import rawConfigs from '../../../Docs/명세/data/mercenary-config.json'

// ─── 내부 타입 (JSON 원본 형태) ───────────────────────────

interface RawMercenary {
  id: string
  name: string
  nameEn?: string
  type: string
  star: number
  finalStar?: number
  code: number
  skillCode: number
  maxHp: number
  atk: number
  def: number
  critRate: number
  critDamage: number
  agility: number
  piercing: number
  patience: number
  supportPower?: number
  maxLevel?: number
  baseLv1?: { atk: number; hp: number; supportPower: number }
  imageId: string
  emoji: string
}

interface RawConfig {
  id: string
  skills?: MercenarySkill[]
  attackTarget?: string
  _skillStatus?: string
  [key: string]: unknown
}

// ─── 파싱 ────────────────────────────────────────────────

const configMap = new Map<string, RawConfig>()
for (const cfg of rawConfigs as RawConfig[]) {
  configMap.set(cfg.id, cfg)
}

function parseMercenary(raw: RawMercenary): MercenaryData {
  return {
    id: raw.id,
    name: raw.name,
    nameEn: raw.nameEn,
    type: raw.type as MercenaryData['type'],
    star: raw.star,
    finalStar: raw.finalStar,
    code: raw.code,
    skillCode: raw.skillCode,
    maxHp: raw.maxHp,
    atk: raw.atk,
    def: raw.def,
    critRate: raw.critRate,
    critDamage: raw.critDamage,
    agility: raw.agility,
    piercing: raw.piercing,
    patience: raw.patience,
    supportPower: raw.supportPower,
    maxLevel: raw.maxLevel,
    baseLv1: raw.baseLv1,
    imageId: raw.imageId,
    emoji: raw.emoji,
  }
}

// ─── 레지스트리 ───────────────────────────────────────────

const mercenaryMap = new Map<string, MercenaryData>()

for (const raw of rawMercenaries as RawMercenary[]) {
  mercenaryMap.set(raw.id, parseMercenary(raw))
}

export function getMercenaryById(id: string): MercenaryData | undefined {
  return mercenaryMap.get(id)
}

export function getAllMercenaries(): MercenaryData[] {
  return Array.from(mercenaryMap.values())
}

export function getMercenarySkills(id: string): MercenarySkill[] {
  return configMap.get(id)?.skills ?? []
}

export function getMercenaryCount(): number {
  return mercenaryMap.size
}
