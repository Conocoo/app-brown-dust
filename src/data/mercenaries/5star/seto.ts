import type { MercenaryTemplate } from '../../../types/mercenary'

export const seto: MercenaryTemplate = {
  id: 'seto',
  name: '세토',
  type: 'attacker',
  star: 5,
  maxHp: 5674,
  atk: 1413,
  def: 10,
  emoji: '⚔️',
  imageId: '2895',
  critRate: 10,
  critDamage: 50,
  agility: 65,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'taunt_immune', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, duration: 20, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_31', value: 1, duration: 12, debuffClass: 'dot', atkScaling: true },
      { type: 'shield', value: 100, duration: 12, debuffClass: 'stat_weaken' },
    ],
  },
}
