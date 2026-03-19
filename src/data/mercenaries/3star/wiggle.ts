import type { MercenaryTemplate } from '../../../types/mercenary'

export const wiggle: MercenaryTemplate = {
  id: 'wiggle',
  name: '위글',
  type: 'attacker',
  star: 3,
  maxHp: 726,
  atk: 4777,
  def: 0,
  emoji: '💥',
  imageId: '515',
  critRate: 5,
  critDamage: 50,
  agility: 0,
  selfDestruct: true,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'stun', value: 0, duration: 18, debuffClass: 'cc', dmgTakenUp: 50 },
      { type: 'harmful_immune', value: 0, duration: 999, buffType: 'special', target: 'self' },
      { type: 'burn', value: 4, atkScaling: true, duration: 5, debuffClass: 'dot' },
    ],
  },
}
