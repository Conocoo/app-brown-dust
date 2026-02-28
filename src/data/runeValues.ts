import type { RuneStat } from '../types/game'

/**
 * 룬 수치 기준표 (임시값 — 이 파일만 수정하면 전체 반영됨)
 *
 * single  : 단일 룬 메인 (100%)
 * dualA   : 듀얼 룬 메인 A (55%)
 * dualB   : 듀얼 룬 메인 B (50%)
 * sub     : 부가 옵션
 */
export const RUNE_VALUES: Record<RuneStat, { single: number; dualA: number; dualB: number; sub: number }> = {
  hp_percent:  { single: 15,   dualA: 8,   dualB: 8,   sub: 5  },
  hp_flat:     { single: 1000, dualA: 550, dualB: 500, sub: 300 },
  atk_percent: { single: 15,   dualA: 8,   dualB: 8,   sub: 5  },
  atk_flat:    { single: 200,  dualA: 110, dualB: 100, sub: 60  },
  def:         { single: 10,   dualA: 6,   dualB: 5,   sub: 3  },
  crit_rate:   { single: 10,   dualA: 6,   dualB: 5,   sub: 3  },
  crit_damage: { single: 20,   dualA: 11,  dualB: 10,  sub: 5  },
}
