import type { MercenaryTemplate } from '../../../types/mercenary'

export const ayan: MercenaryTemplate = {
  id: 'ayan',
  name: '아얀',
  type: 'defender',
  star: 4,
  maxHp: 5754,
  atk: 366,
  def: 15,
  emoji: '🛡️',
  imageId: '3885',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'def_down', value: 45, duration: 4, debuffClass: 'stat_weaken' },
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'stun', value: 0, duration: 6, debuffClass: 'cc' },
      { type: 'dot', value: 0.15, duration: 6, debuffClass: 'dot', atkScaling: true },
      { type: 'agility_down', value: 25, duration: 12, debuffClass: 'stat_weaken' },
    ],
  },
}
