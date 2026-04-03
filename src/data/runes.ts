// 룬 데이터 레이어
// 소스: Docs/명세/data/runes.json

import type { RuneData } from '../types/rune'

import rawRunes from './raw/runes.json'

const runeMap = new Map<number, RuneData>()

for (const raw of rawRunes as RuneData[]) {
  runeMap.set(raw.code, raw)
}

export function getRuneByCode(code: number): RuneData | undefined {
  return runeMap.get(code)
}

export function getAllRunes(): RuneData[] {
  return Array.from(runeMap.values())
}

export function getRuneCount(): number {
  return runeMap.size
}
