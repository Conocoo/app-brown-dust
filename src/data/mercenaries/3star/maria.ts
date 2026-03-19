import type { MercenaryTemplate } from '../../../types/mercenary'

export const maria: MercenaryTemplate = {
  id: 'maria',
  name: '마리아',
  type: 'mage',
  star: 3,
  maxHp: 3630,
  atk: 2626,
  def: 0,
  emoji: '🔮',
  imageId: '835',
  critRate: 35,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 2,
    effects: [
      { type: 'dispel', value: 0 },
      { type: 'damage', value: 200, atkScaling: true },
      { type: 'on_kill_heal_percent', value: 100, target: 'self' },
      { type: 'on_kill_atk_up', value: 100, duration: 24, target: 'self' },
      { type: 'atk_down', value: 65, duration: 18, debuffClass: 'stat_weaken' },
      { type: 'def_down', value: 65, duration: 18, debuffClass: 'stat_weaken' },
      { type: 'crit_rate_down', value: 65, duration: 18, debuffClass: 'stat_weaken' },
      { type: 'crit_damage_down', value: 65, duration: 18, debuffClass: 'stat_weaken' },
      { type: 'agility_down', value: 65, duration: 18, debuffClass: 'stat_weaken' },
    ],
  },
}
