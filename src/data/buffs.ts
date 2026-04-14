// 버프 데이터 레이어
// 소스: Docs/명세/data/buffs.json + visual/buff-names.json

import type { BuffData } from '../types/buff'

import rawBuffs from './raw/buffs.json'
import rawBuffNames from './raw/buff-names.json'

// 버프 이름 매핑 (code → 한글 이름)
const nameMap = new Map<number, string>()
for (const [code, info] of Object.entries(rawBuffNames as Record<string, { name: string }>)) {
  nameMap.set(Number(code), info.name)
}

const buffMap = new Map<number, BuffData>()

for (const raw of rawBuffs as BuffData[]) {
  const named = { ...raw, nameKr: nameMap.get(raw.code) ?? raw.classType }
  buffMap.set(raw.code, named as BuffData)
}

export function getBuffByCode(code: number): BuffData | undefined {
  return buffMap.get(code)
}

export function getAllBuffs(): BuffData[] {
  return Array.from(buffMap.values())
}

export function getBuffCount(): number {
  return buffMap.size
}
