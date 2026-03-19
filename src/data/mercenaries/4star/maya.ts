import type { MercenaryTemplate } from '../../../types/mercenary'

export const maya: MercenaryTemplate = {
  id: 'maya',
  name: '마야',
  type: 'attacker',
  star: 4,
  maxHp: 4794,
  atk: 925,
  def: 5,
  emoji: '⚔️',
  imageId: '925',
  critRate: 10,
  critDamage: 50,
  agility: 20,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'focus_fire', value: 0, duration: 6, debuffClass: 'stat_weaken' },
      { type: 'atk_down', value: 30, duration: 6, debuffClass: 'stat_weaken' },
      { type: 'def_down', value: 30, duration: 6, debuffClass: 'stat_weaken' },
      { type: 'crit_rate_down', value: 30, duration: 6, debuffClass: 'stat_weaken' },
      { type: 'crit_damage_down', value: 30, duration: 6, debuffClass: 'stat_weaken' },
      { type: 'agility_down', value: 30, duration: 6, debuffClass: 'stat_weaken' },
      { type: 'taunt_immune', value: 0, duration: 999, target: 'self' },
      { type: 'dispel', value: 0, triggerSkill: 'buff_block' },
      { type: 'atk_down', value: 50, duration: 24, debuffClass: 'stat_weaken' },
    ],
  },
}
