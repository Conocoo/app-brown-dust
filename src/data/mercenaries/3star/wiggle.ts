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
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 0.04, duration: 5, debuffClass: 'dot', atkScaling: true },
    ],
  },
}
