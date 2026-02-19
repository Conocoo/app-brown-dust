/** 데미지 계산: 최소 1 보장 */
export function calculateDamage(atk: number, def: number): number {
  return Math.max(1, atk - def)
}
