import type { MercenaryTemplate } from '../../../types/mercenary'

export const kumari: MercenaryTemplate = {
  id: 'kumari',
  name: '쿠마리',
  type: 'attacker',
  star: 5,
  maxHp: 3423,
  atk: 2667,
  def: 5,
  emoji: '⚔️',
  imageId: '4415',
  critRate: 50,
  critDamage: 75,
  agility: 50,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'front_n',
    rangeSize: 1,
    effects: [
      { type: 'summon', value: 0, duration: 16, debuffClass: 'stat_weaken' },
      { type: 'dispel', value: 0, debuffClass: 'cc' },
      { type: 'direct_damage', value: 0.45, debuffClass: 'stat_weaken' },
      { type: 'direct_damage', value: 2, debuffClass: 'stat_weaken' },
      { type: 'taunt_immune', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
