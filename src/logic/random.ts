/**
 * WELL512a PRNG (Panneton, L'Ecuyer, Matsumoto 2006)
 * 표준 32비트 WELL512 구현. 원본 게임 PlayRandomManager와 동일한 인터페이스.
 *
 * 미결정 사항: 원본 _state가 long[] (64비트)일 수 있음 (RVA 0x1FC47F8 미디컴파일).
 * 표준 32비트 채택 후 동작 검증 필요.
 */
class WellRandom {
  private state: Uint32Array
  private index: number

  constructor(seed: number) {
    this.state = new Uint32Array(16)
    this.index = 0
    // LCG로 초기 상태 생성
    this.state[0] = seed >>> 0
    for (let i = 1; i < 16; i++) {
      this.state[i] = (Math.imul(1812433253, this.state[i - 1] ^ (this.state[i - 1] >>> 30)) + i) >>> 0
    }
  }

  /**
   * WELL512a 다음 난수 생성 (32비트 unsigned)
   * 원본 알고리즘: M1=13, M2=9, 상수=0xDA442D24
   */
  next(): number {
    const s = this.state
    const i = this.index

    const z0 = s[(i + 15) & 15]
    const v0 = s[i]
    const vm1 = s[(i + 13) & 15]  // M1=13
    const vm2 = s[(i + 9) & 15]   // M2=9

    // z1 = MAT0NEG(-16, V0) ^ MAT0NEG(-15, VM1)
    const z1 = (v0 ^ (v0 << 16) ^ vm1 ^ (vm1 << 15)) >>> 0
    // z2 = MAT0POS(11, VM2)
    const z2 = (vm2 ^ (vm2 >>> 11)) >>> 0
    // newV1 = z1 ^ z2
    const newV1 = (z1 ^ z2) >>> 0
    s[i] = newV1

    // newV0 = MAT0NEG(-2,z0) ^ MAT0NEG(-18,z1) ^ MAT3NEG(-28,z2) ^ MAT4NEG(-5, 0xDA442D24, newV1)
    const newV0 = (
      (z0 ^ (z0 << 2)) ^
      (z1 ^ (z1 << 18)) ^
      (z2 << 28) ^
      (newV1 ^ ((newV1 << 5) & 0xDA442D24))
    ) >>> 0

    this.index = (i + 15) & 15
    s[this.index] = newV0
    return newV0
  }
}

/**
 * 원본 게임 PlayRandomManager 인터페이스
 * 만분율(0~9999) 기반 판정
 */
export class PlayRandomManager {
  private rng: WellRandom

  constructor(seed: number) {
    this.rng = new WellRandom(seed)
  }

  /** 0 이상 n 미만 랜덤 정수 (타겟 선택 등) */
  getRandom(n: number): number {
    if (n <= 1) return 0
    return this.rng.next() % n
  }

  /**
   * 만분율 기반: random(0~9999) < value → true
   * 엡실론(0.0001) 경계: value=0이면 절대 발동 안 됨
   */
  randomLessAndNotEqual(value: number): boolean {
    if (value <= 0) return false
    const r = this.rng.next() % 10000  // [0, 9999]
    return r < value
  }

  /**
   * 만분율 기반: random(0~9999) <= value → true
   */
  randomLessOrEqual(value: number): boolean {
    if (value < 0) return false
    const r = this.rng.next() % 10000
    return r <= value
  }
}
