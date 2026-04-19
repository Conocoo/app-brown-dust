// 배경 데이터 레이어
// 소스: Docs/명세/data/visual/background-map.json

import type { BackgroundInfo, BackgroundTint } from '../types/background'

import rawBackgroundMap from './raw/background-map.json'

// ─── 내부 타입 (JSON 원본 형태) ───────────────────────────

interface RawBackgroundEntry {
  index: number
  playMapPath: string
  playMapWidth: number
  playMapUIColor: string
  playExtendMapEffect: string
  uiMapPath: string
  bgmSound: string
}

// ─── 파싱 ─────────────────────────────────────────────────

function parseUIColor(colorStr: string): BackgroundTint {
  const [r, g, b, a] = colorStr.split('*').map(Number)
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a,
  }
}

function spriteFromUiMapPath(uiMapPath: string): string {
  return uiMapPath.split('*')[1]
}

// ─── Map 인덱싱 ──────────────────────────────────────────

const bgMap = new Map<number, RawBackgroundEntry>()
for (const entry of rawBackgroundMap as RawBackgroundEntry[]) {
  bgMap.set(entry.index, entry)
}

// ─── API ──────────────────────────────────────────────────

export function getBackgroundByMapIndex(mapIndex: number): BackgroundInfo | null {
  const entry = bgMap.get(mapIndex)
  if (!entry) return null
  const sprite = spriteFromUiMapPath(entry.uiMapPath)
  return {
    mapIndex: entry.index,
    imagePath: `/images/backgrounds/map${entry.index}_${sprite}.png`,
    tint: parseUIColor(entry.playMapUIColor),
  }
}

const DEFAULT_MAP_INDEX = 28

export function getDefaultBackground(): BackgroundInfo {
  return getBackgroundByMapIndex(DEFAULT_MAP_INDEX)!
}

export function getAllMapIndices(): number[] {
  return Array.from(bgMap.keys()).sort((a, b) => a - b)
}
