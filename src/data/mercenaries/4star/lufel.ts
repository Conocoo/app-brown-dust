import type { MercenaryTemplate } from '../../../types/mercenary'

export const lufel: MercenaryTemplate = {
  id: 'lufel',
  name: '루펠',
  type: 'mage',
  star: 4,
  maxHp: 3020,
  atk: 1945,
  def: 0,
  emoji: '🔮',
  imageId: '2745',
  critRate: 0,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'back_n',
    rangeSize: 2,
    effects: [
      { type: 'atk_down', value: 65, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'crit_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'crit_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'crit_rate_down', value: 30, duration: 3, debuffClass: 'stat_weaken' },
    ],
  },
}
