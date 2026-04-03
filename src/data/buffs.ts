// 버프 데이터 레이어
// 소스: Docs/명세/data/buffs.json

import type { BuffData } from '../types/buff'

import rawBuffs from '../../../Docs/명세/data/buffs.json'

const buffMap = new Map<number, BuffData>()

for (const raw of rawBuffs as BuffData[]) {
  buffMap.set(raw.code, raw)
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
