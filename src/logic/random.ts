// WELL512a — Deterministic pseudo-random number generator
// 명세: src/logic/battle.ts 내 PlayRandomManager 대응
// 원본: Well512a.java 디컴파일 기반

const STATE_SIZE = 16

export class WELL512 {
  private state: Uint32Array
  private index: number

  constructor(seed: number) {
    this.state = new Uint32Array(STATE_SIZE)
    this.index = 0
    // LCG로 초기 상태 채우기
    this.state[0] = seed >>> 0
    for (let i = 1; i < STATE_SIZE; i++) {
      this.state[i] = (Math.imul(1664525, this.state[i - 1]) + 1013904223) >>> 0
    }
  }

  /** 다음 uint32 값 생성 */
  nextInt(): number {
    const a = this.state[this.index]
    const c = this.state[(this.index + 13) & 15]
    const b = (a ^ (a << 16)) ^ (c ^ (c << 15))
    const d = this.state[(this.index + 9) & 15]
    const dShifted = d ^ (d >>> 11)
    this.state[this.index] = b ^ dShifted
    const e = this.state[this.index]
    this.index = (this.index + 15) & 15
    const f = this.state[this.index]
    this.state[this.index] = (f ^ (f << 2)) ^ (b ^ (b << 18)) ^ (dShifted ^ (dShifted << 28)) ^ (e ^ ((e << 5) & 0xda442d24))
    return this.state[this.index] >>> 0
  }

  /**
   * GetRandom(min, max) — 원본 PlayRandomManager.GetRandom
   * [min, max) 범위 정수 반환
   */
  getRandom(min: number, max: number): number {
    if (min >= max) return min
    return min + (this.nextInt() % (max - min))
  }
}

/** 전투 외부 단순 테스트용 (0~max 균일 분포) */
export function randomInt(max: number): number {
  return Math.floor(Math.random() * max)
}
