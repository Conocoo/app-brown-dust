import type { MercenaryTemplate } from '../../../types/mercenary'

export const edwin: MercenaryTemplate = {
  id: 'edwin',
  name: '에드윈',
  type: 'mage',
  star: 5,
  maxHp: 6195,
  atk: 960,
  def: 10,
  emoji: '🔮',
  imageId: '3565',
  critRate: 20,
  critDamage: 50,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'cross',
    rangeSize: 2,
    effects: [
      { type: 'charm', value: 0, duration: 12, debuffClass: 'cc' },
      { type: 'on_death_trigger', value: 0, duration: 12, debuffClass: 'stat_weaken' },
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 30, duration: 50, buffType: 'shield', target: 'self' },
      { type: 'regeneration', value: 10, duration: 50, buffType: 'stat_enhance', target: 'self' },
      { type: 'summon', value: 0, duration: 24, debuffClass: 'stat_weaken' },
    ],
  },
}
